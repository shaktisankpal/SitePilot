export const TEMPLATES = [
    {
        id: "modern-minimalist",
        name: "Modern Minimalist",
        description: "A clean, spacious layout focusing on typography and whitespace. Ideal for sleek portfolios or tech startups.",
        themeSelected: "Light",
        sections: [
            { type: "Navbar", props: { brand: "Minimal", links: ["Work", "Studio", "News", "Contact"], variant: "Minimal Transparent", bgColor: "#ffffff", textColor: "#111827", accentColor: "#000000" } },
            { type: "Hero", props: { heading: "Less is more.", subheading: "We build digital experiences that are intuitive, beautiful, and completely minimal.", ctaText: "See Our Work", variant: "Split Text Left", bgColor: "#ffffff", textColor: "#111827", accentColor: "#000000", backgroundImage: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1000&q=80" } },
            { type: "Text", props: { heading: "Design Philosophy", description: "Our approach strips away the unnecessary, leaving only what is essential for a beautiful user experience.", variant: "Left Aligned Big", bgColor: "#f9fafb", textColor: "#111827", accentColor: "#000000" } },
            { type: "Gallery", props: { heading: "Selected Works", items: ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"], variant: "Horizontal Flex", bgColor: "#ffffff", textColor: "#111827", accentColor: "#000000" } },
            { type: "Footer", props: { text: "© 2026 Minimal Studio.", variant: "Ultra Minimal", bgColor: "#ffffff", textColor: "#9ca3af" } }
        ]
    },
    {
        id: "vibrant-playful",
        name: "Vibrant Playful",
        description: "Lively, bold, and energetic. This uses rounded Bento Grids and bright colors for a fun aesthetic.",
        themeSelected: "Light",
        sections: [
            { type: "Navbar", props: { brand: "Popcorn", links: ["Features", "Pricing", "Community"], variant: "Glassy Island", bgColor: "#fffbfa", textColor: "#1e1b4b", accentColor: "#f43f5e" } },
            { type: "Hero", props: { heading: "Make it pop!", subheading: "Unleash your creativity with tools that are as fun to use as they are powerful.", ctaText: "Start Creating", variant: "Centered Image Bg", bgColor: "#fffbfa", textColor: "#ffffff", accentColor: "#f43f5e", backgroundImage: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1000&q=80" } },
            { type: "Text", props: { heading: "Why Choose Us?", description: "Because building software shouldn't be boring.", variant: "Card Based", bgColor: "#ffffff", textColor: "#1e1b4b", accentColor: "#f43f5e" } },
            { type: "Gallery", props: { heading: "Everything you need", items: ["Magic Tools", "Cloud Sync", "Collab Hub", "Instant Share"], variant: "Bento Grid", bgColor: "#fffbfa", textColor: "#1e1b4b", accentColor: "#f43f5e" } },
            { type: "CTA", props: { heading: "Ready to jump in?", subheading: "Join thousands of happy creators.", ctaText: "Sign Up Free", variant: "Floating Pill", bgColor: "#f43f5e", textColor: "#ffffff", accentColor: "#ffffff" } },
            { type: "Footer", props: { text: "© 2026 Popcorn App. Built with joy.", variant: "Simple Centered", bgColor: "#1e1b4b", textColor: "#a5b4fc", accentColor: "#f43f5e" } }
        ]
    },
    {
        id: "sleek-dark-mode",
        name: "Sleek Dark Mode",
        description: "A premium, deep, and elegant dark theme with glossy effects. Excellent for SaaS and crypto.",
        themeSelected: "Dark",
        sections: [
            { type: "Navbar", props: { brand: "Vortex", links: ["Ecosystem", "Developers", "Network"], variant: "Full Width Solid", bgColor: "#09090b", textColor: "#ffffff", accentColor: "#3b82f6" } },
            { type: "Hero", props: { heading: "The Future of Web3", subheading: "Constructing decentralized ecosystems with zero compromises on performance.", ctaText: "Deploy Now", variant: "Split Text Right", bgColor: "#09090b", textColor: "#ffffff", accentColor: "#3b82f6", backgroundImage: "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?w=1000&q=80" } },
            { type: "Gallery", props: { heading: "Core Network Features", items: ["Lightning Fast", "Ultra Secure", "Decentralized", "Carbon Neutral", "Open Source", "Developer First"], variant: "Masonry Column", bgColor: "#09090b", textColor: "#ffffff", accentColor: "#3b82f6" } },
            { type: "Text", props: { heading: "Scale globally, instantly.", description: "Deploy your smart contracts to a network designed for planetary scale.", variant: "Centered Standard", bgColor: "#111115", textColor: "#ffffff", accentColor: "#3b82f6" } },
            { type: "CTA", props: { heading: "Start building on Vortex", subheading: "Read our technical whitepaper or jump straight into the docs.", ctaText: "View Documentation", variant: "Split Screen CTA", bgColor: "#09090b", textColor: "#ffffff", accentColor: "#3b82f6" } },
            { type: "Footer", props: { text: "© 2026 Vortex Network.", variant: "Multi-Column Mock", bgColor: "#050505", textColor: "#52525b", accentColor: "#3b82f6" } }
        ]
    },
    {
        id: "elegant-corporate",
        name: "Elegant Corporate",
        description: "Trustworthy, structured, and highly professional layout. Perfect for agencies and firms.",
        themeSelected: "Light",
        sections: [
            { type: "Navbar", props: { brand: "NexusFirm", links: ["Corporate", "Services", "Insights", "Contact"], variant: "Full Width Solid", bgColor: "#ffffff", textColor: "#1f2937", accentColor: "#0f766e" } },
            { type: "Hero", props: { heading: "Strategic Excellence.", subheading: "Delivering world-class financial and legal advisory to Fortune 500 enterprises.", ctaText: "Our Services", variant: "Split Text Left", bgColor: "#f3f4f6", textColor: "#111827", accentColor: "#0f766e", backgroundImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=80" } },
            { type: "Text", props: { heading: "Decades of Experience", description: "Our partners bring unparalleled expertise to navigate complex global markets.", variant: "Card Based", bgColor: "#ffffff", textColor: "#111827", accentColor: "#0f766e" } },
            { type: "Gallery", props: { heading: "Practice Areas", items: ["Mergers & Acquisitions", "Corporate Restructuring", "Private Equity", "Risk Management"], variant: "Bento Grid", bgColor: "#f9fafb", textColor: "#111827", accentColor: "#0f766e" } },
            { type: "ContactForm", props: { heading: "Request a Consultation", variant: "Left Text Right Form", bgColor: "#ffffff", textColor: "#111827", accentColor: "#0f766e" } },
            { type: "Footer", props: { text: "© 2026 Nexus Advisory Firm LLC.", variant: "Multi-Column Mock", bgColor: "#111827", textColor: "#9ca3af", accentColor: "#0f766e" } }
        ]
    }
];
