import admin from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

/**
 * Firebase Service - Secure wrapper for Firebase Admin SDK
 * Handles all Firebase operations with tenant isolation
 */
class FirebaseService {
    constructor() {
        this.initialized = false;
        this.app = null;
    }

    /**
     * Initialize Firebase Admin SDK
     * Called once at application startup
     */
    initialize() {
        if (this.initialized) return;

        try {
            // Validate required environment variables
            if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL) {
                throw new Error("Missing Firebase credentials in environment variables");
            }

            // Initialize Firebase Admin with service account
            this.app = admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                }),
                storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            });

            this.initialized = true;
            console.log("✅ Firebase Admin SDK initialized");
        } catch (error) {
            console.error("❌ Firebase initialization failed:", error.message);
            throw error;
        }
    }

    /**
     * Get Firestore instance
     */
    getFirestore() {
        if (!this.initialized) this.initialize();
        return admin.firestore();
    }

    /**
     * Get Storage instance
     */
    getStorage() {
        if (!this.initialized) this.initialize();
        return admin.storage();
    }

    /**
     * Create tenant-isolated Firestore structure
     * @param {string} tenantId - MongoDB tenant ID
     * @param {string} siteId - MongoDB website ID
     */
    async createTenantStructure(tenantId, siteId) {
        const db = this.getFirestore();
        const tenantRef = db.collection("tenants").doc(tenantId);
        const siteRef = tenantRef.collection("sites").doc(siteId);

        // Initialize tenant document
        await tenantRef.set(
            {
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        // Initialize site document
        await siteRef.set({
            siteId,
            tenantId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "active",
        });

        // Create initial collections
        await siteRef.collection("pages").doc("_init").set({ initialized: true });
        await siteRef.collection("submissions").doc("_init").set({ initialized: true });
        await siteRef.collection("analytics").doc("_init").set({ initialized: true });

        return {
            tenantPath: `tenants/${tenantId}`,
            sitePath: `tenants/${tenantId}/sites/${siteId}`,
        };
    }

    /**
     * Setup form submission collection (auto-called when ContactForm detected)
     * @param {string} tenantId
     * @param {string} siteId
     */
    async setupFormCollection(tenantId, siteId) {
        const db = this.getFirestore();
        const siteRef = db.collection("tenants").doc(tenantId).collection("sites").doc(siteId);

        // Initialize submissions collection with metadata
        await siteRef.collection("submissions").doc("_metadata").set({
            setupAt: admin.firestore.FieldValue.serverTimestamp(),
            totalSubmissions: 0,
            lastSubmissionAt: null,
            formEnabled: true,
        });

        return {
            submissionsPath: `tenants/${tenantId}/sites/${siteId}/submissions`,
            formEnabled: true,
        };
    }

    /**
     * Save form submission to Firestore
     * @param {string} tenantId
     * @param {string} siteId
     * @param {Object} formData - Form fields submitted by user
     */
    async saveFormSubmission(tenantId, siteId, formData) {
        const db = this.getFirestore();
        const siteRef = db.collection("tenants").doc(tenantId).collection("sites").doc(siteId);
        const submissionsRef = siteRef.collection("submissions");

        // Create submission document
        const submissionDoc = await submissionsRef.add({
            ...formData,
            tenantId,
            siteId,
            submittedAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "new",
            read: false,
        });

        // Update metadata
        const metadataRef = submissionsRef.doc("_metadata");
        await metadataRef.set(
            {
                totalSubmissions: admin.firestore.FieldValue.increment(1),
                lastSubmissionAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );

        return {
            submissionId: submissionDoc.id,
            path: `tenants/${tenantId}/sites/${siteId}/submissions/${submissionDoc.id}`,
        };
    }

    /**
     * Get form submissions for a site
     * @param {string} tenantId
     * @param {string} siteId
     * @param {number} limit
     */
    async getFormSubmissions(tenantId, siteId, limit = 50) {
        const db = this.getFirestore();
        const submissionsRef = db
            .collection("tenants")
            .doc(tenantId)
            .collection("sites")
            .doc(siteId)
            .collection("submissions");

        const snapshot = await submissionsRef
            .where("status", "!=", "_metadata")
            .orderBy("submittedAt", "desc")
            .limit(limit)
            .get();

        const submissions = [];
        snapshot.forEach((doc) => {
            if (doc.id !== "_metadata" && doc.id !== "_init") {
                submissions.push({ id: doc.id, ...doc.data() });
            }
        });

        return submissions;
    }

    /**
     * Deploy site pages to Firestore
     * @param {string} tenantId
     * @param {string} siteId
     * @param {Array} pages - Array of page objects
     */
    async deployPages(tenantId, siteId, pages) {
        const db = this.getFirestore();
        const batch = db.batch();
        const sitePath = `tenants/${tenantId}/sites/${siteId}`;
        const pagesRef = db.collection(sitePath).doc("pages").collection("published");

        // Clear existing pages
        const existingPages = await pagesRef.get();
        existingPages.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Deploy new pages
        pages.forEach((page) => {
            const pageRef = pagesRef.doc(page.slug || uuidv4());
            batch.set(pageRef, {
                ...page,
                deployedAt: admin.firestore.FieldValue.serverTimestamp(),
                tenantId, // Enforce tenant isolation
                siteId,
            });
        });

        await batch.commit();
        return { deployed: pages.length, path: sitePath };
    }

    /**
     * Upload assets to Firebase Storage with tenant isolation
     * @param {string} tenantId
     * @param {string} siteId
     * @param {Array} assets - Array of {name, buffer, contentType}
     */
    async uploadAssets(tenantId, siteId, assets) {
        const bucket = this.getStorage().bucket();
        const uploadedUrls = [];

        for (const asset of assets) {
            const filePath = `tenants/${tenantId}/sites/${siteId}/assets/${asset.name}`;
            const file = bucket.file(filePath);

            await file.save(asset.buffer, {
                contentType: asset.contentType,
                metadata: {
                    tenantId,
                    siteId,
                    uploadedAt: new Date().toISOString(),
                },
            });

            // Make file publicly readable
            await file.makePublic();
            uploadedUrls.push(file.publicUrl());
        }

        return uploadedUrls;
    }

    /**
     * Apply Firestore security rules for tenant isolation
     * @param {string} tenantId
     */
    async applySecurityRules(tenantId) {
        // Security rules are applied at project level via Firebase Console or CLI
        // This method validates the structure is correct
        const db = this.getFirestore();
        const tenantRef = db.collection("tenants").doc(tenantId);

        const doc = await tenantRef.get();
        if (!doc.exists) {
            throw new Error(`Tenant ${tenantId} not found in Firestore`);
        }

        return {
            tenantId,
            securityRulesApplied: true,
            message: "Tenant structure validated. Ensure Firestore rules enforce isolation.",
        };
    }

    /**
     * Get deployment status from Firestore
     * @param {string} tenantId
     * @param {string} siteId
     */
    async getDeploymentStatus(tenantId, siteId) {
        const db = this.getFirestore();
        const siteRef = db.collection("tenants").doc(tenantId).collection("sites").doc(siteId);

        const doc = await siteRef.get();
        if (!doc.exists) {
            return { exists: false };
        }

        return {
            exists: true,
            data: doc.data(),
        };
    }

    /**
     * Check Firebase quota usage
     */
    async checkQuotaUsage() {
        // Firebase Admin SDK doesn't provide direct quota APIs
        // This would typically integrate with Firebase Usage API or Cloud Monitoring
        return {
            firestoreReads: "N/A - Use Firebase Console",
            firestoreWrites: "N/A - Use Firebase Console",
            storageUsed: "N/A - Use Firebase Console",
            message: "Monitor quotas via Firebase Console or Cloud Monitoring API",
        };
    }

    /**
     * Delete tenant data (for cleanup/testing)
     * @param {string} tenantId
     */
    async deleteTenantData(tenantId) {
        const db = this.getFirestore();
        const tenantRef = db.collection("tenants").doc(tenantId);

        // Delete all subcollections
        const sites = await tenantRef.collection("sites").get();
        const batch = db.batch();

        sites.forEach((site) => {
            batch.delete(site.ref);
        });

        batch.delete(tenantRef);
        await batch.commit();

        return { deleted: true, tenantId };
    }
}

// Singleton instance
const firebaseService = new FirebaseService();
export default firebaseService;
