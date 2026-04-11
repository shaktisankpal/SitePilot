/**
 * TEMPLATES.JS — Premium AI Website Builder Templates
 * Each template has a dramatically different personality:
 * - Unique color palette (no two look alike)
 * - Specific font that matches the brand
 * - Matching section variants and content tone
 */

export const TEMPLATES = [
    // ─────────────────────────────────────────────
    // 1. CLEAN MINIMALIST — White / Black / Charcoal
    //    Font: Playfair Display (editorial elegance)
    // ─────────────────────────────────────────────
    {
        id: "modern-minimalist",
        name: "Modern Minimalist",
        description: "An ultra-clean, editorial layout built on white space and typography.",
        themeSelected: "Light",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "Minimal",
                    links: ["Work", "Studio", "Journal", "Contact"],
                    variant: "Minimal Transparent",
                    bgColor: "#ffffff",
                    textColor: "#0f0f0f",
                    accentColor: "#0f0f0f",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Less is more.",
                    subheading: "We build digital experiences that are intuitive, beautiful, and completely purposeful.",
                    ctaText: "View Our Work",
                    variant: "Split Text Left",
                    bgColor: "#ffffff",
                    textColor: "#0f0f0f",
                    accentColor: "#0f0f0f",
                    fontFamily: "Playfair Display",
                    backgroundImageQuery: "architecture",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Design Philosophy",
                    description: "Our approach strips away the unnecessary, leaving only what is essential. Every decision serves a purpose — every pixel earns its place.",
                    variant: "Left Aligned Big",
                    bgColor: "#f5f5f0",
                    textColor: "#0f0f0f",
                    accentColor: "#0f0f0f",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Selected Works",
                    items: [
                        { title: "Brand Identity", description: "Complete visual identity for a fintech startup.", imageQuery: "design" },
                        { title: "Digital Product", description: "SaaS dashboard with seamless UX.", imageQuery: "laptop" },
                        { title: "Web Platform", description: "End-to-end web experience for a creative agency.", imageQuery: "creative" },
                        { title: "Print Design", description: "Sophisticated print collateral and packaging.", imageQuery: "studio" },
                    ],
                    variant: "Modern Grid",
                    bgColor: "#ffffff",
                    textColor: "#0f0f0f",
                    accentColor: "#0f0f0f",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Let's create something extraordinary.",
                    subheading: "We take on a limited number of projects each quarter.",
                    ctaText: "Start a Project",
                    ctaLink: "#contact",
                    variant: "Centered Large",
                    bgColor: "#f5f5f0",
                    textColor: "#0f0f0f",
                    accentColor: "#0f0f0f",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Minimal Studio. All rights reserved.",
                    variant: "Ultra Minimal",
                    bgColor: "#0f0f0f",
                    textColor: "#888888",
                    accentColor: "#ffffff",
                    fontFamily: "Playfair Display",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 2. VIBRANT SaaS — Fuchsia / Violet / Dark Navy
    //    Font: Outfit (modern, rounded, tech-friendly)
    // ─────────────────────────────────────────────
    {
        id: "vibrant-playful",
        name: "Vibrant SaaS",
        description: "Lively, bold, neon-accented SaaS layout for modern digital products.",
        themeSelected: "Dark",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "Spark",
                    links: ["Features", "Pricing", "Community", "Blog"],
                    variant: "Glassy Island",
                    bgColor: "#0e0e1a",
                    textColor: "#ffffff",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Make it pop!",
                    subheading: "Unleash your creativity with tools that are as fun to use as they are powerful.",
                    ctaText: "Start Creating Free",
                    ctaLink: "#signup",
                    variant: "Split Text Left",
                    bgColor: "#0e0e1a",
                    textColor: "#ffffff",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                    backgroundImageQuery: "software",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Why Choose Spark?",
                    description: "Because building software shouldn't feel like a chore. We've built a platform that sparks creativity and makes shipping fast.",
                    variant: "Card Based",
                    bgColor: "#12121e",
                    textColor: "#ffffff",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Everything You Need",
                    items: [
                        { title: "Magic Canvas", description: "Real-time collaborative design tools built for speed.", imageQuery: "code" },
                        { title: "Cloud Sync", description: "Instant sync across all your devices, always.", imageQuery: "tech" },
                        { title: "Collab Hub", description: "Invite your team and build together in real time.", imageQuery: "team" },
                        { title: "Instant Share", description: "One-click publish to anywhere on the web.", imageQuery: "startup" },
                        { title: "AI Assistant", description: "Smart suggestions powered by cutting-edge AI.", imageQuery: "software" },
                        { title: "Analytics", description: "Understand your audience with beautiful insights.", imageQuery: "developer" },
                    ],
                    variant: "Bento Grid",
                    bgColor: "#0e0e1a",
                    textColor: "#ffffff",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Ready to jump in?",
                    subheading: "Join over 50,000 creators already using Spark.",
                    ctaText: "Sign Up Free",
                    ctaLink: "#signup",
                    variant: "Floating Pill",
                    bgColor: "#0e0e1a",
                    textColor: "#ffffff",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Spark App. Built with joy.",
                    variant: "Multi-Column Mock",
                    bgColor: "#08080f",
                    textColor: "#6b6b80",
                    accentColor: "#d946ef",
                    fontFamily: "Outfit",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 3. WEB3 / CRYPTO — Near-Black / Electric Blue
    //    Font: Syne (geometric, futuristic)
    // ─────────────────────────────────────────────
    {
        id: "sleek-dark-mode",
        name: "Dark Web3",
        description: "Premium deep dark theme with electric blue accents — SaaS, crypto, and Web3.",
        themeSelected: "Dark",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "Vortex",
                    links: ["Ecosystem", "Developers", "Network", "Docs"],
                    variant: "Full Width Solid",
                    bgColor: "#050811",
                    textColor: "#ffffff",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "The Future of Web3",
                    subheading: "Constructing decentralized ecosystems with zero compromises on performance or security.",
                    ctaText: "Deploy Now",
                    ctaLink: "#deploy",
                    variant: "Split Text Left",
                    bgColor: "#050811",
                    textColor: "#ffffff",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                    backgroundImageQuery: "abstract",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Core Network Features",
                    items: [
                        { title: "Lightning Fast", description: "Sub-millisecond transaction finality at scale.", imageQuery: "software" },
                        { title: "Ultra Secure", description: "Military-grade cryptography protecting every node.", imageQuery: "tech" },
                        { title: "Decentralized", description: "No single point of failure across 10,000+ nodes.", imageQuery: "code" },
                        { title: "Carbon Neutral", description: "Proof-of-stake. Zero carbon footprint.", imageQuery: "nature" },
                        { title: "Open Source", description: "Fully open codebase with 1,400+ contributors.", imageQuery: "developer" },
                        { title: "Developer First", description: "Best-in-class SDK, APIs, and documentation.", imageQuery: "workspace" },
                    ],
                    variant: "Modern Grid",
                    bgColor: "#050811",
                    textColor: "#ffffff",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Scale globally, instantly.",
                    description: "Deploy your smart contracts to a network designed for planetary scale. 100,000 TPS. 99.99% uptime. Zero compromise.",
                    variant: "Card Based",
                    bgColor: "#080c1a",
                    textColor: "#ffffff",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Start building on Vortex",
                    subheading: "Read our technical whitepaper or jump straight into the developer docs.",
                    ctaText: "View Documentation",
                    ctaLink: "#docs",
                    variant: "Dark Banner",
                    bgColor: "#050811",
                    textColor: "#ffffff",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Vortex Network.",
                    variant: "Multi-Column Mock",
                    bgColor: "#020508",
                    textColor: "#4b5563",
                    accentColor: "#2563eb",
                    fontFamily: "Outfit",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 4. ELEGANT CORPORATE — Cream / Forest Green
    //    Font: Playfair Display (authoritative, premium)
    // ─────────────────────────────────────────────
    {
        id: "elegant-corporate",
        name: "Elegant Corporate",
        description: "Trustworthy, structured professional layout for agencies, law firms, and enterprises.",
        themeSelected: "Light",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "NexusFirm",
                    links: ["Services", "Insights", "Team", "Contact"],
                    variant: "Full Width Solid",
                    bgColor: "#fafaf7",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Strategic Excellence.",
                    subheading: "Delivering world-class financial and legal advisory to Fortune 500 enterprises since 1998.",
                    ctaText: "Our Services",
                    ctaLink: "#services",
                    variant: "Split Text Right",
                    bgColor: "#fafaf7",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                    backgroundImageQuery: "corporate",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Decades of Expertise",
                    description: "Our partners bring unparalleled expertise across global markets. With a proven track record and deep industry relationships, we navigate complexity to deliver results.",
                    variant: "Left Aligned Big",
                    bgColor: "#ffffff",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Practice Areas",
                    items: [
                        { title: "Mergers & Acquisitions", description: "Strategic M&A advisory for transformative deals.", imageQuery: "meeting" },
                        { title: "Corporate Restructuring", description: "Operational restructuring for sustainable growth.", imageQuery: "business" },
                        { title: "Private Equity", description: "Deploying capital into high-growth opportunities.", imageQuery: "finance" },
                        { title: "Risk Management", description: "Comprehensive risk frameworks to protect assets.", imageQuery: "office" },
                    ],
                    variant: "Modern Grid",
                    bgColor: "#f4f4ef",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Ready to work together?",
                    subheading: "Schedule a confidential consultation with one of our senior partners.",
                    ctaText: "Request Consultation",
                    ctaLink: "#contact",
                    variant: "Split Screen CTA",
                    bgColor: "#ffffff",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "ContactForm",
                props: {
                    heading: "Request a Consultation",
                    fields: ["name", "email", "company", "phone", "message"],
                    variant: "Left Text Right Form",
                    bgColor: "#fafaf7",
                    textColor: "#1a2e1a",
                    accentColor: "#166534",
                    fontFamily: "Playfair Display",
                    submitText: "Request Consultation",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Nexus Advisory Firm LLC.",
                    variant: "Multi-Column Mock",
                    bgColor: "#1a2e1a",
                    textColor: "#6b8f6b",
                    accentColor: "#4ade80",
                    fontFamily: "Playfair Display",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 5. BOLD CREATIVE AGENCY — Jet Black / Electric Orange
    //    Font: Outfit (expressive, powerful)
    // ─────────────────────────────────────────────
    {
        id: "bold-agency",
        name: "Bold Creative Agency",
        description: "Maximum impact creative agency template — bold, expressive, unforgettable.",
        themeSelected: "Dark",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "FORMA",
                    links: ["Work", "About", "Process", "Contact"],
                    variant: "Glassy Island",
                    bgColor: "#0a0a0f",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "We make brands unforgettable.",
                    subheading: "Award-winning creative studio crafting bold identities, films, and digital experiences that stop people in their tracks.",
                    ctaText: "See Our Work",
                    ctaLink: "#work",
                    variant: "Centered Image Bg",
                    bgColor: "#0a0a0f",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                    backgroundImageQuery: "studio",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Selected Projects",
                    items: [
                        { title: "Nike Campaign", description: "Global product launch campaign across 40 markets.", imageQuery: "athlete" },
                        { title: "Luxury Rebrand", description: "Complete visual transformation for a heritage brand.", imageQuery: "luxury" },
                        { title: "Film Direction", description: "Short form content driving 12M+ organic views.", imageQuery: "photography" },
                        { title: "App Design", description: "Fintech app with 4.9-star App Store rating.", imageQuery: "tech" },
                        { title: "Brand System", description: "101-page brand bible for a Series B startup.", imageQuery: "design" },
                        { title: "Retail Space", description: "Immersive pop-up experience for 8,000+ visitors.", imageQuery: "interior" },
                    ],
                    variant: "Bento Grid",
                    bgColor: "#0a0a0f",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Strategy meets craft.",
                    description: "Great work starts with deep thinking. We research, question, and push boundaries before a single pixel is placed.",
                    variant: "Card Based",
                    bgColor: "#111118",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Got a bold idea?",
                    subheading: "We're selective about who we work with. Let's find out if we're the right fit.",
                    ctaText: "Start a Conversation",
                    ctaLink: "#contact",
                    variant: "Split Screen CTA",
                    bgColor: "#0a0a0f",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "ContactForm",
                props: {
                    heading: "Let's Talk",
                    fields: ["name", "email", "company", "budget", "message"],
                    variant: "Centered Card",
                    bgColor: "#0a0a0f",
                    textColor: "#ffffff",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                    submitText: "Send Inquiry",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 FORMA Studio. All rights reserved.",
                    variant: "Ultra Minimal",
                    bgColor: "#050508",
                    textColor: "#52525b",
                    accentColor: "#f97316",
                    fontFamily: "Outfit",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 6. RESTAURANT & FOOD — Warm Cream / Amber Brown
    //    Font: Playfair Display (warm, editorial, rich)
    // ─────────────────────────────────────────────
    {
        id: "local-restaurant",
        name: "Restaurant & Food",
        description: "Warm, rich, appetizing layout for restaurants, cafes, and food businesses.",
        themeSelected: "Light",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "Maison",
                    links: ["Menu", "Reservations", "About", "Contact"],
                    variant: "Full Width Solid",
                    bgColor: "#fef3e2",
                    textColor: "#1c0f00",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Taste the difference.",
                    subheading: "Farm-to-table cuisine crafted daily with seasonal ingredients and decades of culinary passion.",
                    ctaText: "Reserve a Table",
                    ctaLink: "#reservations",
                    variant: "Centered Image Bg",
                    bgColor: "#fef3e2",
                    textColor: "#ffffff",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                    backgroundImageQuery: "restaurant",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Our Story",
                    description: "Born from a love of authentic flavors and community, Maison has been bringing people together around the table since 2008. Every dish tells a story.",
                    variant: "Left Aligned Big",
                    bgColor: "#fff9f0",
                    textColor: "#1c0f00",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Featured Dishes",
                    items: [
                        { title: "Seared Duck Breast", description: "Free-range duck with cherry gastrique and truffle jus.", imageQuery: "gourmet" },
                        { title: "Truffle Risotto", description: "Aged parmesan and black truffle from the Périgord.", imageQuery: "dining" },
                        { title: "Catch of the Day", description: "Line-caught fish with seasonal vegetable medley.", imageQuery: "food" },
                        { title: "Artisan Desserts", description: "Handcrafted pastries by our award-winning pastry chef.", imageQuery: "bakery" },
                    ],
                    variant: "Horizontal Scroll",
                    bgColor: "#fef3e2",
                    textColor: "#1c0f00",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Join us for an unforgettable evening.",
                    subheading: "Tables fill quickly. Book yours now.",
                    ctaText: "Make a Reservation",
                    ctaLink: "#reservations",
                    variant: "Centered Large",
                    bgColor: "#fff9f0",
                    textColor: "#1c0f00",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "ContactForm",
                props: {
                    heading: "Reservations & Enquiries",
                    fields: ["name", "email", "phone", "date", "guests", "message"],
                    variant: "Left Text Right Form",
                    bgColor: "#fef3e2",
                    textColor: "#1c0f00",
                    accentColor: "#b45309",
                    fontFamily: "Playfair Display",
                    submitText: "Request Reservation",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Maison Restaurant.",
                    variant: "Simple Centered",
                    bgColor: "#1c0f00",
                    textColor: "#a87d4b",
                    accentColor: "#f59e0b",
                    fontFamily: "Playfair Display",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 7. FITNESS & WELLNESS — Deep Black / Neon Lime
    //    Font: Outfit (athletic, energetic)
    // ─────────────────────────────────────────────
    {
        id: "fitness-wellness",
        name: "Fitness & Wellness",
        description: "Energetic, athletic layout for gyms, studios, and wellness brands.",
        themeSelected: "Dark",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "APEX",
                    links: ["Programs", "Coaches", "Schedule", "Join"],
                    variant: "Full Width Solid",
                    bgColor: "#050505",
                    textColor: "#ffffff",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Transform your body. Master your mind.",
                    subheading:
                        "Elite coaching programs, state-of-the-art facilities, and a community that pushes you to your limit — every single day.",
                    ctaText: "Start Free Trial",
                    ctaLink: "#join",
                    variant: "Centered Image Bg",
                    bgColor: "#050505",
                    textColor: "#ffffff",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                    backgroundImageQuery: "fitness",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Our Programs",
                    items: [
                        { title: "Strength & Power", description: "Progressive overload programming for elite strength gains.", imageQuery: "gym" },
                        { title: "HIIT Cardio", description: "High-intensity intervals that torch calories and build endurance.", imageQuery: "workout" },
                        { title: "Yoga & Mobility", description: "Flexibility, balance, and recovery sessions for all levels.", imageQuery: "yoga" },
                        { title: "Olympic Lifting", description: "Master the snatch and clean & jerk with world-class coaches.", imageQuery: "athlete" },
                        { title: "Nutrition Plan", description: "Personalized meal plans designed for your specific goals.", imageQuery: "food" },
                        { title: "1-on-1 Coaching", description: "Personal trainer sessions tailored entirely to you.", imageQuery: "runner" },
                    ],
                    variant: "Modern Grid",
                    bgColor: "#0a0a0a",
                    textColor: "#ffffff",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Text",
                props: {
                    heading: "Results-driven training.",
                    description: "Our science-based approach combines strength, conditioning, and recovery to deliver measurable results in record time.",
                    variant: "Card Based",
                    bgColor: "#111111",
                    textColor: "#ffffff",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Ready to level up?",
                    subheading: "First 14 days free. No credit card required.",
                    ctaText: "Join Now",
                    ctaLink: "#join",
                    variant: "Floating Pill",
                    bgColor: "#050505",
                    textColor: "#ffffff",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 APEX Performance. All rights reserved.",
                    variant: "Ultra Minimal",
                    bgColor: "#020202",
                    textColor: "#4b5563",
                    accentColor: "#a3e635",
                    fontFamily: "Outfit",
                },
            },
        ],
    },

    // ─────────────────────────────────────────────
    // 8. BEAUTY / SPA — Blush Pink / Rose Gold
    //    Font: Playfair Display (soft, luxurious)
    // ─────────────────────────────────────────────
    {
        id: "beauty-spa",
        name: "Beauty & Spa",
        description: "Soft, luxurious, and feminine — for salons, spas, and beauty brands.",
        themeSelected: "Light",
        sections: [
            {
                type: "Navbar",
                props: {
                    brand: "Lumière",
                    links: ["Services", "Gallery", "About", "Book"],
                    variant: "Minimal Transparent",
                    bgColor: "#fff5f7",
                    textColor: "#3d1c2e",
                    accentColor: "#be185d",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "Hero",
                props: {
                    heading: "Radiance, redefined.",
                    subheading: "Luxury beauty treatments designed to restore, rejuvenate, and reveal your most confident self.",
                    ctaText: "Book an Appointment",
                    ctaLink: "#book",
                    variant: "Split Text Right",
                    bgColor: "#fff5f7",
                    textColor: "#3d1c2e",
                    accentColor: "#be185d",
                    fontFamily: "Playfair Display",
                    backgroundImageQuery: "beauty",
                },
            },
            {
                type: "Gallery",
                props: {
                    heading: "Our Treatments",
                    items: [
                        { title: "Glow Facial", description: "Deep-cleansing radiance treatment using premium botanicals.", imageQuery: "skincare" },
                        { title: "Hot Stone Massage", description: "90 minutes of deep relaxation with heated volcanic stones.", imageQuery: "spa" },
                        { title: "Lash Extensions", description: "Volume and length tailored to your natural beauty.", imageQuery: "beauty" },
                        { title: "Bridal Package", description: "Complete bridal beauty experience for your special day.", imageQuery: "makeup" },
                        { title: "Body Scrub", description: "Full-body exfoliation leaving skin silky-smooth.", imageQuery: "salon" },
                        { title: "Nail Art", description: "Creative nail art by our award-winning technicians.", imageQuery: "skincare" },
                    ],
                    variant: "Modern Grid",
                    bgColor: "#fff0f4",
                    textColor: "#3d1c2e",
                    accentColor: "#be185d",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "CTA",
                props: {
                    heading: "Your glow awaits.",
                    subheading: "New clients receive 20% off their first visit.",
                    ctaText: "Book Now",
                    ctaLink: "#book",
                    variant: "Centered Large",
                    bgColor: "#fff5f7",
                    textColor: "#3d1c2e",
                    accentColor: "#be185d",
                    fontFamily: "Playfair Display",
                },
            },
            {
                type: "ContactForm",
                props: {
                    heading: "Book Your Visit",
                    fields: ["name", "email", "phone", "service", "date", "message"],
                    variant: "Centered Card",
                    bgColor: "#fff0f4",
                    textColor: "#3d1c2e",
                    accentColor: "#be185d",
                    fontFamily: "Playfair Display",
                    submitText: "Request Booking",
                },
            },
            {
                type: "Footer",
                props: {
                    text: "© 2026 Lumière Beauty Lounge.",
                    variant: "Simple Centered",
                    bgColor: "#3d1c2e",
                    textColor: "#c084a0",
                    accentColor: "#f9a8d4",
                    fontFamily: "Playfair Display",
                },
            },
        ],
    },
];
