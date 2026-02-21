import firebaseService from "./services/firebaseService.js";

/**
 * Firebase Agent - Autonomous DevOps Deployment Specialist
 * Handles all Firebase deployment operations with tenant isolation
 */
class FirebaseAgent {
    constructor() {
        this.name = "FirebaseAgent";
        this.role = "DevOps Deployment Specialist";
        this.capabilities = [
            "Deploy websites to Firebase Hosting",
            "Manage Firestore collections per tenant",
            "Handle Firebase Storage for assets",
            "Create tenant-isolated backend environments",
            "Validate deployment integrity",
        ];
    }

    /**
     * Main execution method - orchestrates deployment
     * @param {Object} context - Deployment context
     * @returns {Object} - Deployment result
     */
    async execute(context) {
        const { tenantId, siteId, websiteData, pages, assets = [] } = context;

        console.log(`🤖 [${this.name}] Starting deployment for tenant: ${tenantId}, site: ${siteId}`);

        const result = {
            agent: this.name,
            tenantId,
            siteId,
            timestamp: new Date().toISOString(),
            steps: [],
            success: false,
            error: null,
            hasContactForm: false,
        };

        try {
            // Step 1: Initialize Firebase
            result.steps.push(await this.initializeFirebase());

            // Step 2: Create tenant structure
            result.steps.push(await this.createTenantStructure(tenantId, siteId));

            // Step 3: Deploy pages
            result.steps.push(await this.deployPages(tenantId, siteId, pages));

            // Step 4: Upload assets (if any)
            if (assets.length > 0) {
                result.steps.push(await this.uploadAssets(tenantId, siteId, assets));
            }

            // Step 5: Auto-detect and setup form submission backend
            const hasContactForm = this.detectContactForms(pages);
            if (hasContactForm) {
                result.hasContactForm = true;
                result.steps.push(await this.setupFormSubmissionBackend(tenantId, siteId));
                console.log(`📝 [${this.name}] Contact form detected - Backend auto-configured`);
            }

            // Step 6: Apply security rules
            result.steps.push(await this.applySecurityRules(tenantId));

            // Step 7: Validate deployment
            result.steps.push(await this.validateDeployment(tenantId, siteId));

            result.success = true;
            result.hostingUrl = this.generateHostingUrl(tenantId, siteId);
            result.firestorePath = `tenants/${tenantId}/sites/${siteId}`;

            console.log(`✅ [${this.name}] Deployment successful`);
            return result;
        } catch (error) {
            console.error(`❌ [${this.name}] Deployment failed:`, error.message);
            result.error = {
                message: error.message,
                code: error.code || "DEPLOYMENT_FAILED",
                stack: error.stack,
            };
            return result;
        }
    }

    /**
     * Initialize Firebase service
     */
    async initializeFirebase() {
        try {
            firebaseService.initialize();
            return {
                step: "initialize_firebase",
                status: "success",
                message: "Firebase Admin SDK initialized",
            };
        } catch (error) {
            throw new Error(`Firebase initialization failed: ${error.message}`);
        }
    }

    /**
     * Create tenant-isolated Firestore structure
     */
    async createTenantStructure(tenantId, siteId) {
        try {
            const structure = await firebaseService.createTenantStructure(tenantId, siteId);
            return {
                step: "create_tenant_structure",
                status: "success",
                data: structure,
            };
        } catch (error) {
            throw new Error(`Tenant structure creation failed: ${error.message}`);
        }
    }

    /**
     * Deploy pages to Firestore
     */
    async deployPages(tenantId, siteId, pages) {
        try {
            if (!pages || pages.length === 0) {
                throw new Error("No pages provided for deployment");
            }

            const result = await firebaseService.deployPages(tenantId, siteId, pages);
            return {
                step: "deploy_pages",
                status: "success",
                data: result,
            };
        } catch (error) {
            throw new Error(`Page deployment failed: ${error.message}`);
        }
    }

    /**
     * Upload assets to Firebase Storage
     */
    async uploadAssets(tenantId, siteId, assets) {
        try {
            const urls = await firebaseService.uploadAssets(tenantId, siteId, assets);
            return {
                step: "upload_assets",
                status: "success",
                data: { uploaded: assets.length, urls },
            };
        } catch (error) {
            throw new Error(`Asset upload failed: ${error.message}`);
        }
    }

    /**
     * Apply Firestore security rules
     */
    async applySecurityRules(tenantId) {
        try {
            const result = await firebaseService.applySecurityRules(tenantId);
            return {
                step: "apply_security_rules",
                status: "success",
                data: result,
            };
        } catch (error) {
            throw new Error(`Security rules application failed: ${error.message}`);
        }
    }

    /**
     * Detect if pages contain ContactForm sections
     */
    detectContactForms(pages) {
        for (const page of pages) {
            const sections = page.layoutConfig?.sections || page.sections || [];
            const hasForm = sections.some((section) => section.type === "ContactForm");
            if (hasForm) return true;
        }
        return false;
    }

    /**
     * Setup form submission backend automatically
     */
    async setupFormSubmissionBackend(tenantId, siteId) {
        try {
            const result = await firebaseService.setupFormCollection(tenantId, siteId);
            return {
                step: "setup_form_backend",
                status: "success",
                message: "Form submission backend auto-configured",
                data: result,
            };
        } catch (error) {
            throw new Error(`Form backend setup failed: ${error.message}`);
        }
    }

    /**
     * Validate deployment integrity
     */
    async validateDeployment(tenantId, siteId) {
        try {
            const status = await firebaseService.getDeploymentStatus(tenantId, siteId);
            if (!status.exists) {
                throw new Error("Deployment validation failed: Site not found in Firestore");
            }

            return {
                step: "validate_deployment",
                status: "success",
                data: status,
            };
        } catch (error) {
            throw new Error(`Deployment validation failed: ${error.message}`);
        }
    }

    /**
     * Generate hosting URL for deployed site
     */
    generateHostingUrl(tenantId, siteId) {
        // In production, this would be the actual Firebase Hosting URL
        // Format: https://{tenantId}-{siteId}.web.app or custom domain
        const projectId = process.env.FIREBASE_PROJECT_ID;
        return `https://${projectId}.web.app/tenants/${tenantId}/sites/${siteId}`;
    }

    /**
     * Get agent status and capabilities
     */
    getStatus() {
        return {
            name: this.name,
            role: this.role,
            capabilities: this.capabilities,
            status: "ready",
        };
    }
}

export default FirebaseAgent;
