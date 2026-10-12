(function ($) {
    "use strict";

    // 1. Spinner Hide
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 100);
    };
    spinner();

    // 2. Initiate WOW.js for animations
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }

    // 3. Scroll Progress & Sticky Navbar & Back to Top Toggle
    $(window).scroll(function () {
        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        $('#scroll-progress').css('width', scrolled + '%');

        // Sticky Navbar
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-lg');
        } else {
            $('.navbar').removeClass('sticky-top shadow-lg');
        }

        // Back to top button
        if ($(this).scrollTop() > 150) {
            $('.back-to-top').css('display', 'flex').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    // 4. Smooth scroll to top
    $('.back-to-top').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 800, 'easeInOutExpo');
        return false;
    });

    // 5. Dropdown on mouse hover (Desktop only)
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";

    $(window).on("load resize", function () {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
                function () {
                    const $this = $(this);
                    $this.addClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "true");
                    $this.find($dropdownMenu).addClass(showClass);
                },
                function () {
                    const $this = $(this);
                    $this.removeClass(showClass);
                    $this.find($dropdownToggle).attr("aria-expanded", "false");
                    $this.find($dropdownMenu).removeClass(showClass);
                }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });

    // 6. Dynamic Spotlight Hover Effect for Glass Cards
    const initSpotlightHover = function () {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });
    };
    initSpotlightHover();

    // 7. Counter Animation
    if ($('[data-toggle="counter-up"]').length > 0 && $.fn.counterUp) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 1500
        });
    }

    // 8. Testimonials carousel (Owl Carousel)
    if ($(".testimonial-carousel").length > 0 && $.fn.owlCarousel) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            dots: true,
            loop: true,
            center: true,
            margin: 20,
            responsive: {
                0: {
                    items: 1
                },
                768: {
                    items: 2
                },
                992: {
                    items: 3
                }
            }
        });
    }

    // 9. Vendor/Client carousel
    if ($('.vendor-carousel').length > 0 && $.fn.owlCarousel) {
        $('.vendor-carousel').owlCarousel({
            loop: true,
            margin: 45,
            dots: false,
            autoplay: true,
            smartSpeed: 800,
            responsive: {
                0: {
                    items: 2
                },
                576: {
                    items: 3
                },
                768: {
                    items: 5
                },
                992: {
                    items: 6
                }
            }
        });
    }

    // 10. Form validation & Interactive Submit Banners
    $('form').on('submit', function (e) {
        const $form = $(this);
        // Exclude search forms
        if ($form.attr('id') === 'searchForm' || $form.attr('role') === 'search') {
            return;
        }

        e.preventDefault();

        let isValid = true;
        $form.find('input[required], textarea[required], select[required]').each(function () {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (!isValid) {
            alert('Please fill out all required fields.');
            return;
        }

        // Standard dynamic feedback logic
        const submitBtn = $form.find('button[type="submit"]');
        const originalText = submitBtn.html();

        submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...');

        // Mock API call delay
        setTimeout(function () {
            submitBtn.prop('disabled', false).html(originalText);

            // Create glassmorphic alert banner
            const alertHtml = `
                <div class="alert alert-premium alert-premium-success alert-dismissible fade show mt-3" role="alert">
                    <strong>Success!</strong> Your message has been sent successfully. We will get back to you within 24 hours.
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;

            // Display alert and reset form
            $form.append(alertHtml);
            $form[0].reset();

            // Auto hide alert after 5s
            setTimeout(function () {
                $form.find('.alert').alert('close');
            }, 5000);
        }, 1500);
    });

    // 11. Custom Portfolio Filters + Load More
// 11. Custom Portfolio Filters + Load More
$(document).on('click', '.portfolio-filter-btn', function () {

    const filterValue = $(this).attr('data-filter');

    $('.portfolio-filter-btn').removeClass('active');
    $(this).addClass('active');

    // Reset pagination
    currentPage = 1;

    const $items = $('.portfolio-item-wrapper');

    // Apply filter without showing all cards first
    $items.each(function () {

        const $item = $(this);
        const category = $item.attr('data-category');

        if (filterValue === 'all' || category === filterValue) {
            $item.removeClass('filter-hidden');
        } else {
            $item.addClass('filter-hidden hidden');
        }
    });

    // Show only first 6 matching cards
    updatePortfolioItems();

    // Update Load More
    updateLoadMoreButton();
});


// Handle URL parameter for portfolio filter
$(window).on('load', function () {

    // Initialize Load More first
    initLoadMore();

    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');

    if (filterParam) {

        const $filterBtn =
            $('.portfolio-filter-btn[data-filter="' + filterParam + '"]');

        if ($filterBtn.length > 0) {
            $filterBtn.trigger('click');
        }
    } else {

        // Initial state
        updatePortfolioItems();
        updateLoadMoreButton();
    }
});

// Handle Navbar Dropdown Product Filters when already on portfolio page
$(document).on('click', '.navbar .dropdown-item[data-filter]', function (e) {
    if (window.location.pathname.endsWith('portfolio.html') || window.location.pathname.includes('/portfolio')) {
        e.preventDefault();
        const targetFilter = $(this).attr('data-filter');

        // Close detail view if open
        if (typeof closeProjectDetail === 'function') {
            closeProjectDetail();
        }

        // Close dropdown
        $('.dropdown-menu').removeClass('show');
        $('.dropdown-toggle').removeClass('show').attr('aria-expanded', 'false');

        // Close mobile navbar if open
        $('#navbarCollapse').collapse('hide');

        // Trigger portfolio filter button
        const $filterBtn = $('.portfolio-filter-btn[data-filter="' + targetFilter + '"]');
        if ($filterBtn.length > 0) {
            $filterBtn.trigger('click');
        }

        // Smooth scroll to portfolio header
        const $section = $('#portfolioSectionHeader, #portfolioListingView');
        if ($section.length > 0) {
            $('html, body').animate({
                scrollTop: $section.first().offset().top - 90
            }, 350);
        }

        // Update URL query parameter without full reload
        const newUrl = window.location.pathname + (targetFilter === 'all' ? '' : '?filter=' + encodeURIComponent(targetFilter));
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
});


// ================================
// Load More Functionality
// ================================

let currentPage = 1;
const itemsPerPage = 8;


function initLoadMore() {

    const $loadMoreBtn = $('#loadMoreBtn');

    // Remove previous click handler
    $loadMoreBtn.off('click.loadMore');

    // Load More click
    $loadMoreBtn.on('click.loadMore', function () {

        currentPage++;

        updatePortfolioItems();
        updateLoadMoreButton();

    });

    // Initial state
    updatePortfolioItems();
    updateLoadMoreButton();
}


// ================================
// Update Portfolio Items
// ================================

function updatePortfolioItems() {

    const $items = $('.portfolio-item-wrapper');
    let visibleCount = 0;

    $items.each(function () {

        const $item = $(this);

        // Filtered-out cards stay hidden
        if ($item.hasClass('filter-hidden')) {
            $item.addClass('hidden');
            return;
        }

        if (visibleCount < currentPage * itemsPerPage) {

            $item.removeClass('hidden');
            visibleCount++;

        } else {

            $item.addClass('hidden');
        }
    });
}


// ================================
// Update Load More Button
// ================================

function updateLoadMoreButton() {

    const $items = $('.portfolio-item-wrapper');
    const $loadMoreBtn = $('#loadMoreBtn');

    // Count ONLY cards belonging to current filter
    const totalFilteredItems =
        $items.not('.filter-hidden').length;

    // Count cards currently displayed
    const visibleFilteredItems =
        $items.not('.filter-hidden').not('.hidden').length;


    // --------------------------------
    // 6 or fewer cards
    // --------------------------------

    if (totalFilteredItems <= itemsPerPage) {

        $loadMoreBtn.addClass('hidden');

        return;
    }


    // --------------------------------
    // More cards available
    // --------------------------------

    if (visibleFilteredItems < totalFilteredItems) {

        $loadMoreBtn.removeClass('hidden');

    } else {

        // All filtered cards already visible
        $loadMoreBtn.addClass('hidden');

    }
}

// ==========================================
// In-Depth Project Detail View (Flipkart Style)
// ==========================================
const portfolioProjectsData = {
    1: {
        title: "Custom Enterprise Software",
        category: "Enterprise Solutions",
        poster: "img/products/enterprise-software.webp",
        rating: "4.9",
        ratingsCount: "148 Ratings & 42 Enterprise Deployments",
        timeline: "10 – 20 Business Days",
        deployment: "AWS EC2 / Docker / On-Premise",
        badge: "Enterprise Tier",
        tags: ["Java 21", "Spring Boot 3", "PostgreSQL", "React.js", "Docker", "Redis"],
        desc: "Custom enterprise software built around your exact business requirements to streamline operations, automate workflows, manage massive datasets, and improve executive decision-making. Engineered with multi-tenant architecture, sub-second query latency, and high-security role-based access control.",
        primaryCta: "REQUEST ARCHITECTURE PROPOSAL",
        specs: {
            solutionType: "Modular Enterprise ERP & Automation Suite",
            suitableFor: "Large Scale Operations, Corporate Teams & Campuses",
            ownership: "100% Full Source Code & IP Handover",
            delivery: "10 – 20 Business Days",
            frontend: "React.js, Next.js, Redux Toolkit, Modern UI",
            backend: "Spring Boot 3.2, Java 21, Hibernate ORM, REST APIs",
            database: "PostgreSQL 16 (Relational) + Redis (In-Memory Cache)",
            cloud: "AWS ECS, Docker Compose, Nginx Reverse Proxy",
            auth: "Spring Security 6, JWT, Role-Based Access (RBAC)",
            encryption: "AES-256 Database Encryption & TLS 1.3 In-Flight",
            latency: "Sub-120ms API Latency, 99.99% Availability SLA"
        },
        featuresTitle: "Enterprise Modules & Solutions",
        features: [
            { title: "CRM & Pipeline Automation", desc: "Customers, leads pipeline, deal management, automated follow-up reminders, and sales performance tracking.", icon: "fas fa-users" },
            { title: "Inventory & Warehousing", desc: "Real-time stock tracking across multiple warehouses, purchase order workflows, barcode management, and low-stock alerts.", icon: "fas fa-boxes-stacked" },
            { title: "College & Campus ERP", desc: "Student life-cycle management, fee billing, automated receipt generation, biometric attendance, and grade management.", icon: "fas fa-graduation-cap" },
            { title: "HRMS & Automated Payroll", desc: "Employee records, automated biometric attendance sync, leaves approval workflow, and one-click salary slip generation.", icon: "fas fa-user-tie" }
        ],
        deliverables: [
            "Complete Private Git Repository with Full Source Code",
            "Normalized Database Schemas, Triggers & Migration Scripts",
            "OpenAPI / Swagger 3.0 Interactive Documentation",
            "Docker Compose & Production Deployment Configurations",
            "Comprehensive Administrator Manual & Training Video",
            "12 Months Free Priority SLA & Security Patch Support"
        ]
    },
    2: {
        title: "E-Commerce Shop",
        category: "E-Commerce Platform",
        poster: "img/products/e-commerce.webp",
        rating: "4.9",
        ratingsCount: "185 Ratings & 56 Store Launches",
        timeline: "7 – 14 Business Days",
        deployment: "Cloud VPS / Docker / AWS Lightsail",
        badge: "High Conversion",
        tags: ["Spring Boot", "React.js", "PostgreSQL", "Razorpay / Stripe", "Redis", "Elasticsearch"],
        desc: "A modern, high-converting e-commerce platform designed to help businesses showcase catalogs, manage orders, process secure digital payments, and deliver an ultra-fast shopping experience across all mobile and desktop devices.",
        primaryCta: "LAUNCH YOUR ONLINE STORE",
        specs: {
            solutionType: "Headless Omnichannel E-Commerce Store",
            suitableFor: "Direct-to-Consumer (D2C) Brands & Multi-Vendor Retail",
            ownership: "100% Full Source Code & Zero Revenue Commission",
            delivery: "7 – 14 Business Days",
            frontend: "React.js, Next.js 14 (SSR), Tailwind CSS",
            backend: "Spring Boot / Node.js Express, Razorpay/Stripe SDK",
            database: "PostgreSQL, Elasticsearch (Instant Search), Redis",
            cloud: "AWS Lightsail / DigitalOcean, Cloudflare CDN",
            auth: "JWT Authentication, OAuth2 (Google/Apple Login), Mobile OTP",
            encryption: "PCI-DSS Compliant Payment Gateways & TLS 1.3",
            latency: "Sub-80ms Page Delivery, 99.9% High Availability"
        },
        featuresTitle: "Store Capabilities & Features",
        features: [
            { title: "Dynamic Product Catalog", desc: "Multi-category products, variants (size/color), image galleries, custom attributes, and instant client-side search.", icon: "fas fa-boxes-stacked" },
            { title: "Frictionless Cart & Checkout", desc: "High-conversion 1-page checkout flow with automatic coupon calculations, tax estimations, and multiple payment gateways.", icon: "fas fa-cart-shopping" },
            { title: "Live Order Tracking", desc: "Real-time order statuses, shipment tracking numbers, and automated customer SMS/WhatsApp status updates.", icon: "fas fa-truck" },
            { title: "Admin Analytics Hub", desc: "Daily sales revenue, top performing products, customer retention metrics, and real-time inventory valuation.", icon: "fas fa-chart-line" }
        ],
        deliverables: [
            "Complete Source Code for Web Storefront & Admin Portal",
            "Payment Gateway Integrations (UPI, Razorpay, Stripe, COD)",
            "Automated Invoicing & WhatsApp Order Notification Engine",
            "Production Docker Deployment & Cloudflare SSL Setup",
            "Inventory & Bulk CSV Product Upload Utility",
            "12 Months Complimentary Security & Maintenance SLA"
        ]
    },
    3: {
        title: "Advertising Website",
        category: "Business Website",
        poster: "img/products/advertising.webp",
        rating: "4.8",
        ratingsCount: "96 Ratings & 30+ Campaigns",
        timeline: "5 – 8 Business Days",
        deployment: "Vercel / AWS Amplify / Cloudflare Pages",
        badge: "Ultra Fast LCP",
        tags: ["Next.js 14", "Vue.js", "GSAP Animations", "Tailwind CSS", "HTML5"],
        desc: "High-converting advertising and brand showcase website designed to launch campaigns, highlight service portfolios, capture high-intent inquiries, and maximize ROI on marketing campaigns.",
        primaryCta: "START CAMPAIGN WEBSITE",
        specs: {
            solutionType: "Conversion-Focused High-Performance Landing Hub",
            suitableFor: "Ad Agencies, Product Launches & Growth Marketers",
            ownership: "100% Full Source Code Handover",
            delivery: "5 – 8 Business Days",
            frontend: "Next.js 14, Vue.js, GSAP Animations, Tailwind CSS",
            backend: "Serverless Edge Functions, Webhooks CRM Routing",
            database: "Supabase / Firebase Realtime Leads Database",
            cloud: "Vercel Edge Network, Cloudflare Global CDN",
            auth: "Admin Portal Secure Token Access",
            encryption: "Strict Content-Security-Policy & HTTPS Enforced",
            latency: "99+ Google PageSpeed Score, Sub-0.6s LCP"
        },
        featuresTitle: "Campaign & Promotion Capabilities",
        features: [
            { title: "Campaign Landing Pages", desc: "Engaging multimedia hero banners and conversion-driven layouts tailored for high CTR marketing campaigns.", icon: "fas fa-bullhorn" },
            { title: "Instant Lead Capture", desc: "Interactive inquiry forms routed directly to CRM, email, and WhatsApp for instant response turnaround.", icon: "fas fa-envelope-open-text" },
            { title: "Lightning Fast Speed", desc: "Optimized Core Web Vitals with sub-second page loads to maximize ad conversion rates and minimize bounce.", icon: "fas fa-bolt" },
            { title: "SEO & Social OpenGraph", desc: "Full structured schema, rich social preview cards, and metadata crawl optimization for organic search dominance.", icon: "fas fa-magnifying-glass" }
        ],
        deliverables: [
            "Pixel-Perfect Responsive Source Code with Clean Componentry",
            "Interactive Contact & Lead Generation Form System",
            "Google Analytics 4 & Meta Pixel Conversion Integration",
            "Automated Email & Telegram/WhatsApp Lead Webhook",
            "100% Optimized Assets & Sub-Second LCP Performance",
            "1-Year Domain Linkage & Technical Maintenance"
        ]
    },
    4: {
        title: "Resume Portfolio Website",
        category: "Personal Branding",
        poster: "img/products/portfolio.webp",
        rating: "4.9",
        ratingsCount: "112 Ratings & 90+ Professional Profiles",
        timeline: "3 – 5 Business Days",
        deployment: "GitHub Pages / Netlify / Vercel",
        badge: "Luxury Showcase",
        tags: ["HTML5", "CSS3", "Modern JavaScript", "Bootstrap 5", "FontAwesome"],
        desc: "An interactive professional portfolio website designed for developers, creators, and executives to showcase projects, skills, career milestones, and client recommendations in an elegant, luxury format.",
        primaryCta: "BUILD YOUR PORTFOLIO",
        specs: {
            solutionType: "Interactive Executive & Developer Portfolio",
            suitableFor: "Software Engineers, Designers, Consultants & Executives",
            ownership: "100% Full Source Code & Custom Domain Setup",
            delivery: "3 – 5 Business Days",
            frontend: "HTML5, CSS3, Modern JavaScript, Bootstrap 5",
            backend: "Static Generation / Serverless Form Handlers",
            database: "Static JSON Data / Local Storage Sync",
            cloud: "GitHub Pages, Cloudflare CDN, Custom Domain SSL",
            auth: "N/A (Public Identity Showcase) + Encrypted Form API",
            encryption: "HTTPS Enforced with Automated Let's Encrypt SSL",
            latency: "Instantaneous Sub-50ms Global Loading"
        },
        featuresTitle: "Key Portfolio Sections",
        features: [
            { title: "Interactive Bio & Skills", desc: "Animated skill proficiency bars, tech stack badges, and achievements highlighting your professional edge.", icon: "fas fa-id-card" },
            { title: "Career Timeline", desc: "Chronological employment history, education, and certified milestones with interactive expandable achievements.", icon: "fas fa-clock-rotate-left" },
            { title: "Categorized Project Showcase", desc: "Filterable work portfolio with live demo links, repository badges, and high-definition screenshots.", icon: "fas fa-laptop-code" },
            { title: "Direct Contact Form", desc: "One-click resume download and contact messaging widget connecting visitors directly to your inbox.", icon: "fas fa-paper-plane" }
        ],
        deliverables: [
            "Complete Clean Frontend Codebase with Minimalist Typography",
            "Custom Domain Configuration (e.g. yourname.com)",
            "One-Click PDF Resume Download Link Integration",
            "Spam-Protected Contact Form Routing to Personal Email",
            "Mobile-Optimized Touch Gestures & Light/Dark Balance",
            "Lifetime Deployment on Free Hosting Tier with Zero Fees"
        ]
    },
    5: {
        title: "Corporate Business Website",
        category: "Corporate Solutions",
        poster: "img/products/corporate-website.webp",
        rating: "4.9",
        ratingsCount: "128 Ratings & 44 Corporate Clients",
        timeline: "7 – 12 Business Days",
        deployment: "AWS EC2 / DigitalOcean / Nginx",
        badge: "Enterprise Authority",
        tags: ["React.js", "Next.js", "Bootstrap 5", "Node.js", "Figma"],
        desc: "A premium corporate website engineered to establish digital brand authority, articulate enterprise offerings, build credibility with institutional clients, and capture qualified consultation inquiries.",
        primaryCta: "REQUEST CORPORATE PORTAL",
        specs: {
            solutionType: "Institutional Multi-Page Corporate Portal",
            suitableFor: "Established Enterprises, Law Firms, Consulting & Tech",
            ownership: "100% Full Source Code & Brand Assets Handover",
            delivery: "7 – 12 Business Days",
            frontend: "React.js, Next.js, Bootstrap 5, Figma Pixel-Perfect",
            backend: "Node.js Express / NestJS Headless API",
            database: "PostgreSQL / MongoDB Headless CMS",
            cloud: "AWS Elastic Beanstalk, Docker, Cloudflare DNS",
            auth: "Role-Based CMS Access (Admin, Editor, Reviewer)",
            encryption: "TLS 1.3, Enterprise WAF & DDoS Shielding",
            latency: "Sub-150ms TTFB, 99.95% Availability Guarantee"
        },
        featuresTitle: "Corporate Modules",
        features: [
            { title: "Enterprise Brand Identity", desc: "Sleek, minimalist aesthetic conveying institutional authority, reliability, and technical sophistication.", icon: "fas fa-building" },
            { title: "Services & Capabilities", desc: "Deep-dive sections detailing practice areas, methodologies, case studies, and corporate deliverables.", icon: "fas fa-briefcase" },
            { title: "Lead Ingestion System", desc: "Consultation request routing, automatic email alerts, and integration with customer relationship management tools.", icon: "fas fa-bullseye" },
            { title: "Interactive Branch Locations", desc: "Global and regional branch office listings with interactive maps, direct contacts, and local business hours.", icon: "fas fa-map-location-dot" }
        ],
        deliverables: [
            "Complete Multi-Page Enterprise Responsive Portal",
            "Headless CMS for One-Click Blog & Case Study Management",
            "Interactive Contact & RFP / Quote Submission System",
            "Professional Corporate Email Domain Setup & DNS Routing",
            "Structured SEO Schema & Sitemap Configuration",
            "12 Months Comprehensive Maintenance & SLA Uptime Support"
        ]
    },
    6: {
        title: "Premium Black Theme Shop",
        category: "Luxury E-Commerce",
        poster: "img/products/black-ecommerce.webp",
        rating: "5.0",
        ratingsCount: "82 Ratings & 26 Luxury Deployments",
        timeline: "10 – 16 Business Days",
        deployment: "AWS / Docker Container / CDN",
        badge: "Obsidian Edition",
        tags: ["Node.js", "React.js", "Tailwind CSS", "Framer Motion", "Stripe"],
        desc: "A luxury dark-themed online storefront tailored for high-end fashion, tech gadgets, and lifestyle brands seeking an immersive, cinematic shopping atmosphere.",
        primaryCta: "BUILD LUXURY STOREFRONT",
        specs: {
            solutionType: "High-End Dark Aesthetic E-Commerce Experience",
            suitableFor: "Luxury Brands, Fashion Boutiques, Watches & High-Tech",
            ownership: "100% Exclusive Codebase & Custom Theme Rights",
            delivery: "10 – 16 Business Days",
            frontend: "React.js, Tailwind CSS, Framer Motion, HTML5 Canvas",
            backend: "Node.js Microservices, Stripe & International Gateways",
            database: "PostgreSQL (ACID Compliant) + Redis Cache",
            cloud: "AWS ECS Containers, CloudFront Edge Delivery",
            auth: "Biometric WebAuthn, JWT Session Tokens, OAuth2",
            encryption: "End-to-End Encrypted Cart, PCI-DSS Level 1 Ready",
            latency: "60 FPS Silky Smooth Animations, Sub-100ms TTFB"
        },
        featuresTitle: "Luxury Store Highlights",
        features: [
            { title: "Obsidian Luxury Aesthetics", desc: "Deep black glassmorphism with subtle frost accents, smooth micro-animations, and Apple-grade smoothness.", icon: "fas fa-gem" },
            { title: "High-Res Visual Gallery", desc: "Immersive product photography showcase with quick-zoom, thumbnail carousels, and video integration.", icon: "fas fa-bag-shopping" },
            { title: "Instant Search & Filtering", desc: "Real-time client-side filter by price, rating, collection, and tags for instantaneous browsing.", icon: "fas fa-sliders" },
            { title: "Mobile-First Fluid Flow", desc: "Silky smooth mobile bottom drawer cart and one-thumb checkout navigation designed for maximum conversion.", icon: "fas fa-credit-card" }
        ],
        deliverables: [
            "Bespoke Ultra-Luxury Dark Theme Front & Back-end Code",
            "Global Currency & Stripe / PayPal International Checkout",
            "Curated High-Definition Media Gallery & Zoom Viewers",
            "Real-time Inventory Sync & Low-Stock Alerts",
            "Automated Branded PDF Receipts & Dispatch Notes",
            "1-Year Priority SLA & Security Infrastructure Support"
        ]
    },
    7: {
        title: "Car Wash System Pro",
        category: "Business Software",
        poster: "img/products/carwash.webp",
        rating: "4.8",
        ratingsCount: "74 Ratings & 35 Auto Centers",
        timeline: "5 – 10 Business Days",
        deployment: "Local On-Prem Server / Cloud VPS / XAMPP",
        badge: "Turnkey System",
        tags: ["PHP 8.2", "MySQL 8", "JavaScript", "Bootstrap 5", "XAMPP"],
        desc: "A complete car detailing and wash management platform automating booking schedules, service bay allocations, cashier billing, staff commissions, and business performance tracking.",
        primaryCta: "DEPLOY CAR WASH SYSTEM",
        specs: {
            solutionType: "Automated Bay & POS Management Platform",
            suitableFor: "Auto Detailing Studios, Car Wash Chains & Service Bays",
            ownership: "100% Full Source Code, Lifetime Local/Cloud Setup",
            delivery: "5 – 10 Business Days",
            frontend: "Bootstrap 5, Responsive Tablet/Touch POS, jQuery",
            backend: "PHP 8.2 (MVC Architecture), RESTful Endpoints",
            database: "MySQL 8.0 / MariaDB with Daily Automated Backups",
            cloud: "Apache/Nginx Web Server, Local LAN + Cloud Hybrid",
            auth: "Cashier, Manager & Owner Multi-Level PIN/Password",
            encryption: "Bcrypt Hash Security, Sanitized SQL Input PDO",
            latency: "Instantaneous Touch Response (< 50ms Local LAN)"
        },
        featuresTitle: "Operational Modules",
        features: [
            { title: "Bay Scheduling & Booking", desc: "Real-time bay capacity planning preventing customer bottlenecks and managing peak-hour drive-ins.", icon: "fas fa-calendar-check" },
            { title: "Tiered Service Packages", desc: "Wash, polish, interior detail, and ceramic coating pricing packages with custom add-on pricing.", icon: "fas fa-spray-can-sparkles" },
            { title: "Technician & Bay Assignment", desc: "Worker productivity logging, job completion times, commission calculators, and quality audit stamps.", icon: "fas fa-user-check" },
            { title: "Automated Invoicing & SMS", desc: "Instant digital receipts sent via SMS and WhatsApp to vehicle owners upon job sign-off.", icon: "fas fa-file-invoice-dollar" }
        ],
        deliverables: [
            "Complete PHP Source Code & Pre-Configured MySQL Database",
            "One-Click Local Offline Desktop Installer (XAMPP/WAMP)",
            "Tablet-Optimized Cashier Touch POS Screen",
            "Thermal Receipt Printer (58mm/80mm) Integration",
            "Automated WhatsApp / SMS Bill Dispatching Module",
            "Lifetime Code Ownership & 1-Year Free Technical Support"
        ]
    },
    8: {
        title: "The Gym Manager",
        category: "Fitness Tech",
        poster: "img/products/gym.webp",
        rating: "4.8",
        ratingsCount: "89 Ratings & 48 Fitness Studios",
        timeline: "6 – 12 Business Days",
        deployment: "Cloud VPS / Local Desktop Web Server",
        badge: "Biometric Sync",
        tags: ["PHP 8.2", "PostgreSQL / MySQL", "JavaScript", "QR Code SDK"],
        desc: "All-in-one health club and fitness center software handling member registrations, recurring subscriptions, trainer scheduling, biometric check-ins, and daily revenue reporting.",
        primaryCta: "DEPLOY GYM SYSTEM",
        specs: {
            solutionType: "Health Club & Membership ERP Software",
            suitableFor: "Gyms, Crossfit Boxes, MMA Gyms & Wellness Centers",
            ownership: "100% Full Source Code Handover",
            delivery: "6 – 12 Business Days",
            frontend: "Responsive Web Dashboard, QR Member Check-in Portal",
            backend: "PHP 8.2 / Node.js, Biometric Hardware Sync SDK",
            database: "PostgreSQL / MySQL with Subscription Auditing",
            cloud: "DigitalOcean / Hostinger VPS, Automated Daily DB Dump",
            auth: "Staff Role Isolation, Member QR Passcode System",
            encryption: "HTTPS Enforced, Encrypted Contact & Billing Records",
            latency: "< 1s Biometric Scan to Gate Access Turnaround"
        },
        featuresTitle: "Management Features",
        features: [
            { title: "Member Digital Profiles", desc: "Fitness goals, medical notes, membership plans, emergency contacts, and workout attendance records.", icon: "fas fa-address-card" },
            { title: "Membership Expiry Tracking", desc: "Automated renewal alerts, grace periods, payment receipts, and locker fee additions.", icon: "fas fa-repeat" },
            { title: "Fast Biometric / QR Access", desc: "High-speed front-desk check-in validation preventing unauthorized entries and tracking facility occupancy.", icon: "fas fa-qrcode" },
            { title: "Trainer & Session Booking", desc: "Personal training appointment slots, trainer commission splits, and workout regimen tracking.", icon: "fas fa-dumbbell" }
        ],
        deliverables: [
            "Complete Gym Management Source Code & Database Architecture",
            "Member Mobile Web Check-in & Digital ID Card Generator",
            "Automated Membership Renewal Reminders via WhatsApp",
            "Daily Financial Cash & Online Collection Summary Reports",
            "Multi-Branch Support Ready Architecture",
            "12 Months Direct Technical Support & Server Maintenance"
        ]
    },
    9: {
        title: "Customize Mobile Apps",
        category: "Mobile Applications",
        poster: "img/products/mobile-app.webp",
        rating: "4.9",
        ratingsCount: "134 Ratings & 40+ App Store Publishes",
        timeline: "12 – 24 Business Days",
        deployment: "Google Play Store & Apple App Store",
        badge: "Native 60FPS",
        tags: ["Flutter 3", "Kotlin", "Swift", "Firebase", "REST APIs", "SQLite"],
        desc: "End-to-end bespoke mobile applications designed for enterprises and startups, ensuring 60fps native performance, biometric authentication, offline synchronization, and cloud scalability.",
        primaryCta: "DISCUSS MOBILE APP IDEA",
        specs: {
            solutionType: "Cross-Platform iOS & Android Native Applications",
            suitableFor: "Consumer Apps, On-Demand Delivery, Healthcare & FinTech",
            ownership: "100% Full Flutter/Kotlin Code & App Store Accounts",
            delivery: "12 – 24 Business Days",
            frontend: "Flutter 3.x / Kotlin (Android) / Swift (iOS)",
            backend: "Firebase Cloud Functions & Node.js REST API",
            database: "Cloud Firestore / SQLite Offline Database",
            cloud: "Google Cloud Platform, Firebase FCM Push Engine",
            auth: "Biometric FaceID / Fingerprint, Firebase Auth, OAuth2",
            encryption: "Android Keystore & iOS Keychain Secure Storage",
            latency: "60 FPS Fluid UI Transitions, Offline-First Sync"
        },
        featuresTitle: "Native Capabilities",
        features: [
            { title: "Cross-Platform Codebase", desc: "Single performant codebase delivering native iOS and Android apps with shared business logic.", icon: "fas fa-mobile-screen-button" },
            { title: "Targeted Push Notifications", desc: "Segmented messaging campaigns with deep linking directly into app views, boosting retention.", icon: "fas fa-bell" },
            { title: "Offline Data Persistence", desc: "SQLite/Room local database syncing effortlessly once network connectivity returns.", icon: "fas fa-cloud-arrow-up" },
            { title: "Secure Biometric Auth", desc: "FaceID and fingerprint integration protecting sensitive customer information and transactions.", icon: "fas fa-shield-halved" }
        ],
        deliverables: [
            "Production-Ready Flutter / Native Codebase (iOS & Android)",
            "Google Play Store & Apple App Store Release Assets & Signing",
            "Admin Web Dashboard for App Management & Content Moderation",
            "FCM Push Notification Campaign Center Setup",
            "Third-Party SDKs (Maps, Analytics, Payment Gateway) Configured",
            "1-Year App Maintenance & Operating System Compatibility Updates"
        ]
    },
    10: {
        title: "Tourism Booking System",
        category: "Travel & Tourism",
        poster: "img/products/tourism.webp",
        rating: "4.8",
        ratingsCount: "67 Ratings & 22 Agency Portals",
        timeline: "8 – 15 Business Days",
        deployment: "Cloud VPS / AWS Elastic Beanstalk",
        badge: "Multi-Currency Ready",
        tags: ["Java 21", "Node.js", "React.js", "MySQL 8", "Leaflet Maps"],
        desc: "An end-to-end travel and tour operator portal simplifying holiday package discovery, seasonal seat allocations, traveler itinerary downloads, and multi-currency payments.",
        primaryCta: "BUILD TOURISM PORTAL",
        specs: {
            solutionType: "Travel Agency Booking & Itinerary Engine",
            suitableFor: "Tour Operators, Destination DMC & Travel Consolidators",
            ownership: "100% Full Source Code & Database Architecture",
            delivery: "8 – 15 Business Days",
            frontend: "React.js, Interactive Maps (Leaflet/Mapbox), Bootstrap",
            backend: "Java 21 / Node.js Express, PDF Generation Engine",
            database: "MySQL 8.0 Relational with Room/Seat Inventory Locks",
            cloud: "AWS EC2, S3 (PDF Vouchers), Cloudflare CDN",
            auth: "Customer Portal & Agent Commission Sub-accounts",
            encryption: "PCI-DSS Payment Gateway Integration, TLS 1.3",
            latency: "Instant Itinerary PDF Compilation (< 400ms)"
        },
        featuresTitle: "Travel System Features",
        features: [
            { title: "Interactive Tour Itineraries", desc: "Day-by-day sightseeing agendas, hotel inclusions, photo galleries, and printable customer itineraries.", icon: "fas fa-map-pin" },
            { title: "Smart Seat & Room Allocations", desc: "Live availability calendar preventing overbooking across flight seats, vehicles, and hotel blocks.", icon: "fas fa-plane-departure" },
            { title: "Digital Traveler Vouchers", desc: "Printable PDF and digital boarding passes generated immediately upon payment confirmation.", icon: "fas fa-passport" },
            { title: "Multi-Currency Payment Gateway", desc: "Seamless checkout supporting major debit/credit cards, UPI, and international wallets.", icon: "fas fa-money-bill-transfer" }
        ],
        deliverables: [
            "Complete Tour Booking Platform Source Code & Database",
            "Dynamic Holiday Package Builder with Image Carousels",
            "Automated PDF Voucher & Ticket Generator",
            "Multi-Currency Payment Gateway (Razorpay/Stripe)",
            "Agent Commission Tracking & Sub-Agent Portal",
            "12 Months Server Maintenance & SLA Support"
        ]
    },
    11: {
        title: "Advance Billing SaaS Application",
        category: "SaaS Product",
        poster: "img/products/billing-saas.webp",
        rating: "5.0",
        ratingsCount: "52 Pilot Deployments & Early Access",
        timeline: "Upcoming Release / Early Enterprise Access",
        deployment: "Kubernetes / Multi-Region AWS Cloud",
        badge: "Multi-Tenant SaaS",
        tags: ["Spring Boot", "Next.js 14", "PostgreSQL", "Docker", "Kafka", "Redis"],
        desc: "Enterprise cloud billing and business operating platform consolidating multi-entity invoicing, automated recurring subscriptions, inventory tracking, and tax compliance.",
        primaryCta: "REQUEST EARLY SAAS ACCESS",
        specs: {
            solutionType: "Multi-Entity Cloud Invoicing & Financial Operations SaaS",
            suitableFor: "SaaS Founders, Wholesale Distributors & Multi-Branch Hubs",
            ownership: "Enterprise License / Dedicated Private SaaS Cluster",
            delivery: "Immediate Pilot Access / Custom Instance 10 Days",
            frontend: "Next.js 14 App Router, TypeScript, Tailwind, Tremor Charts",
            backend: "Spring Boot / Node.js Microservices, Kafka Message Broker",
            database: "PostgreSQL (Schema-per-Tenant) + Redis Sentinel",
            cloud: "AWS EKS (Kubernetes), Docker Containers, Terraform IaC",
            auth: "SAML 2.0, SSO, OAuth2, Granular Multi-Tenant RBAC",
            encryption: "AES-256 Tenant Data Isolation, Automated Audit Logs",
            latency: "< 50ms Cache Hit, 99.99% High Availability SLA"
        },
        featuresTitle: "SaaS Platform Features",
        features: [
            { title: "Automated GST Compliance", desc: "Instant e-way bill generation, recurring subscription billing, and multi-currency tax compliance.", icon: "fas fa-receipt" },
            { title: "Multi-Branch Consolidation", desc: "Unified financial dashboard rolling up numbers across multiple subsidiaries and retail branches.", icon: "fas fa-network-wired" },
            { title: "Live Inventory Deductions", desc: "Automatic stock reduction upon billing with real-time supplier replenishment alerts.", icon: "fas fa-boxes-stacked" },
            { title: "Predictive Cash Flow Analytics", desc: "Real-time receivables aging, P&L reporting, and AI-assisted expense forecasting.", icon: "fas fa-chart-pie" }
        ],
        deliverables: [
            "Dedicated SaaS Tenant Instance or Private Multi-Tenant Setup",
            "Multi-GST & Multi-Currency Automated Billing Modules",
            "Automated PDF Invoicing & WhatsApp Delivery System",
            "Bank Account Reconciliation & Payment Gateway Webhooks",
            "Granular Role Permissions (Cashier, Accountant, Admin)",
            "Enterprise 99.99% Uptime SLA & 24/7 Priority Support"
        ]
    }
};

let lastOpenedProjectId = null;

window.openProjectDetail = function(projectId) {
    const data = portfolioProjectsData[projectId];
    if (!data) return;

    lastOpenedProjectId = projectId;

    // Breadcrumbs
    $('#detailBreadcrumbCategory').text(data.category);
    $('#detailBreadcrumbTitle').text(data.title);

    // Header & Badges
    $('#detailCategoryBadge').text(data.category.toUpperCase());
    $('#detailTitle').text(data.title);
    $('#detailRatingBadge').html((data.rating || '4.9') + ' <i class="fas fa-star ms-1"></i>');
    $('#detailRatingsCount').text(data.ratingsCount || '140+ Deployments & Reviews');
    $('#detailBadgeType').html('<i class="fas fa-bolt text-warning me-1"></i> ' + (data.badge || 'Enterprise Grade'));
    $('#detailPosterImg').attr('src', data.poster).attr('alt', data.title);

    // Delivery & Deployment
    $('#detailTimeline').text(data.timeline || '7 – 14 Business Days');
    $('#detailDeploymentMode').text(data.deployment || 'Cloud / Docker / On-Prem');

    // CTAs
    $('#detailPrimaryCtaText').text(data.primaryCta || 'REQUEST CUSTOM PROPOSAL');
    const waMsg = encodeURIComponent("Hello GlobalX Team, I am interested in your project: " + data.title + " (" + data.category + "). Please share technical specifications, deployment timelines, and pricing quote.");
    $('#detailWhatsappCta').attr('href', 'https://wa.me/919272399002?text=' + waMsg);

    // Overview & Tags
    $('#detailDesc').text(data.desc);
    const $techTags = $('#detailTechTags');
    $techTags.empty();
    if (data.tags) {
        data.tags.forEach(function(tag) {
            $techTags.append('<span class="tag-badge">' + tag + '</span>');
        });
    }

    // Specifications Table (Flipkart Style)
    const specs = data.specs || {};
    $('#specSolutionType').text(specs.solutionType || 'Custom Enterprise Software');
    $('#specSuitableFor').text(specs.suitableFor || 'Startups, SMEs & Enterprise Operations');
    $('#specOwnership').text(specs.ownership || '100% Full Source Code & IP Handover');
    $('#specDelivery').text(specs.delivery || data.timeline || '7 – 14 Business Days');
    $('#specFrontend').text(specs.frontend || 'React.js, Next.js, Modern CSS');
    $('#specBackend').text(specs.backend || 'Spring Boot, Java 21, REST APIs');
    $('#specDatabase').text(specs.database || 'PostgreSQL, MySQL, Redis Cache');
    $('#specCloud').text(specs.cloud || 'AWS Cloud, Docker, Nginx, CI/CD');
    $('#specAuth').text(specs.auth || 'JWT, OAuth2, Role-Based Access Control');
    $('#specEncryption').text(specs.encryption || 'AES-256 Storage & TLS 1.3 Encryption');
    $('#specLatency').text(specs.latency || 'Sub-150ms Response Time, 99.9% Uptime');

    // Features Grid
    $('#detailFeaturesTitle').html('<i class="fas fa-layer-group text-primary me-2"></i> ' + (data.featuresTitle || 'Core System Modules'));
    const $featuresGrid = $('#detailFeaturesGrid');
    $featuresGrid.empty();
    if (data.features) {
        data.features.forEach(function(f) {
            $featuresGrid.append(`
                <div class="col-md-6">
                    <div class="detail-feature-card">
                        <i class="${f.icon || 'fas fa-check-circle'} detail-feature-icon"></i>
                        <div>
                            <strong class="text-white d-block mb-1">${f.title}</strong>
                            <small class="text-muted d-block">${f.desc}</small>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    // Deliverables List ("In The Box")
    const $delivList = $('#detailDeliverablesList');
    $delivList.empty();
    const deliverables = data.deliverables || [
        "Complete Private Git Repository with Full Source Code",
        "Clean Database Schemas & Production Migration Scripts",
        "OpenAPI / Swagger Interactive Documentation",
        "Docker Containerization & Server Setup Script",
        "12 Months Free Priority SLA & Bug-Fix Maintenance"
    ];
    deliverables.forEach(function(item) {
        $delivList.append(`
            <div class="col-md-6">
                <div class="d-flex align-items-center gap-2 py-1 text-light">
                    <i class="fas fa-check-circle text-primary flex-shrink-0"></i>
                    <span style="font-size: 13.5px;">${item}</span>
                </div>
            </div>
        `);
    });

    // Smooth instant transition to Flipkart product view
    $('#portfolioSectionHeader').slideUp(180);
    $('#portfolioListingView').hide();
    $('#portfolioDetailView').fadeIn(200);

    // Scroll immediately to top of detail view
    setTimeout(function() {
        if ($('#portfolioDetailView').length) {
            const targetOffset = $('#portfolioDetailView').offset().top - 80;
            window.scrollTo({ top: targetOffset, behavior: 'smooth' });
        }
    }, 50);

    // Update URL hash without reload
    try {
        history.pushState({ projectId: projectId }, "", "#project-" + projectId);
    } catch(e) {
        window.location.hash = "project-" + projectId;
    }
};

window.closeProjectDetail = function() {
    $('#portfolioDetailView').hide();
    $('#portfolioSectionHeader').slideDown(180);
    $('#portfolioListingView').fadeIn(200, function() {
        if (lastOpenedProjectId) {
            const $targetCard = $('.portfolio-item-wrapper[data-project-id="' + lastOpenedProjectId + '"]');
            if ($targetCard.length) {
                const cardTop = $targetCard.offset().top - 120;
                window.scrollTo({ top: cardTop, behavior: 'smooth' });
            }
        }
    });

    try {
        history.pushState(null, "", window.location.pathname + window.location.search);
    } catch(e) {
        window.location.hash = "";
    }
};

// Global click delegation for all portfolio cards
$(document).on('click', '.portfolio-item-wrapper, .xai-project-card', function (e) {
    if ($(this).closest('#portfolioDetailView').length) return;
    const pId = $(this).attr('data-project-id') || $(this).closest('.portfolio-item-wrapper').attr('data-project-id');
    if (pId && portfolioProjectsData[pId]) {
        e.preventDefault();
        window.openProjectDetail(parseInt(pId, 10));
    }
});

// Handle browser Back button (popstate / hashchange)
window.addEventListener('popstate', function(e) {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
        const pId = parseInt(hash.replace('#project-', ''));
        if (pId && portfolioProjectsData[pId]) {
            window.openProjectDetail(pId);
        }
    } else {
        if ($('#portfolioDetailView').is(':visible')) {
            window.closeProjectDetail();
        }
    }
});

// Check URL hash on page load (e.g. direct link portfolio.html#project-2)
$(window).on('load', function() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project-')) {
        const pId = parseInt(hash.replace('#project-', ''));
        if (pId && portfolioProjectsData[pId]) {
            window.openProjectDetail(pId);
        }
    }
});

// Allow Escape key to close detail view
$(document).on('keydown', function(e) {
    if (e.key === 'Escape' && $('#portfolioDetailView').is(':visible')) {
        window.closeProjectDetail();
    }
});

})(jQuery);


/* ==========================
   Consultation Popup
========================== */
const POPUP_DELAY = 20000; // 20 seconds
const DISMISS_DAYS = 7;

// Check if popup should be shown
function shouldShowPopup() {

    // User already clicked Get Started
    if (localStorage.getItem("consultationStarted")) {
        return false;
    }

    // User clicked No Thanks
    const dismissedTime = localStorage.getItem("consultationDismissed");

    if (!dismissedTime) {
        return true;
    }

    const daysPassed =
        (Date.now() - Number(dismissedTime)) / (1000 * 60 * 60 * 24);

    return daysPassed >= DISMISS_DAYS;
}

// Show popup
function showConsultationPopup() {
    if (!shouldShowPopup()) return;
    var popup = document.getElementById("consultationPopup");
    if (popup) popup.style.display = "block";
}

// Timer
const popupTimer = setTimeout(showConsultationPopup, POPUP_DELAY);

// Scroll trigger
window.addEventListener("scroll", function () {
    if (!shouldShowPopup()) return;
    const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent >= 50) {
        clearTimeout(popupTimer);
        showConsultationPopup();
    }
}, { once: true });


// =========================
// No Thanks & Get Started
// =========================
var dismissBtn = document.getElementById("dismissPopup");
if (dismissBtn) {
    dismissBtn.addEventListener("click", function (e) {
        e.preventDefault();
        var popup = document.getElementById("consultationPopup");
        if (popup) popup.style.display = "none";
        localStorage.setItem("consultationDismissed", Date.now());
    });
}

var startProjectBtn = document.getElementById("startProjectBtn");
if (startProjectBtn) {
    startProjectBtn.addEventListener("click", function () {
        localStorage.setItem("consultationStarted", "true");
    });
}
// Ensure dark theme is active and remove any light theme setting
try {
    localStorage.removeItem("globalx-theme");
    document.documentElement.removeAttribute("data-theme");
} catch(e) {}

// ==========================================
// xAI Live Coding Engine Simulation
// ==========================================
function initLiveCodingEngine() {
    var terminal = document.getElementById("xaiTerminal");
    if (!terminal) return;

    var progressFill = document.getElementById("xaiProgressFill");
    var progressText = document.getElementById("xaiProgressText");
    var tasksContainer = document.getElementById("xaiTasksContainer");
    var thoughtText = document.getElementById("xaiThoughtText");
    var filePath = document.getElementById("xaiFilePath");
    var codeEditor = document.getElementById("xaiCodeEditor");
    var promptText = document.getElementById("xaiPromptText");
    var pathEl = document.getElementById("xaiProjectPath");

    var scenarios = [
        {
            prompt: "Build scalable multi-tenant architecture with rate limiting for GlobalX client portal",
            project: "globalx/enterprise-core",
            startPercent: 13.35,
            endPercent: 100.0,
            tasks: [
                { name: "GlobalX multi-tenant routing engine", status: "running" },
                { name: "Enterprise session token verification", status: "pending" }
            ],
            thought: "Thought for 3.4s",
            file: "src/globalx/enterprise/authMiddleware.ts",
            lines: [
                { num: "42", type: "normal", content: '<span class="syn-kw">const</span> session = <span class="syn-kw">await</span> <span class="syn-fn">getGlobalXSession</span>(req);' },
                { num: "43", type: "green", content: '+ <span class="syn-kw">const</span> tenantId = req.headers[<span class="syn-str">"x-globalx-tenant-id"</span>];' },
                { num: "44", type: "green", content: '+ <span class="syn-kw">const</span> rateLimit = <span class="syn-kw">await</span> GlobalXEngine.<span class="syn-fn">checkRateLimit</span>(tenantId, req.ip);' },
                { num: "45", type: "green", content: '+ <span class="syn-kw">if</span> (!rateLimit.allowed) <span class="syn-kw">throw</span> <span class="syn-kw">new</span> <span class="syn-fn">Error</span>(<span class="syn-str">"GlobalX quota exceeded"</span>);' },
                { num: "46", type: "green", content: '+ <span class="syn-kw">const</span> tenantConfig = <span class="syn-kw">await</span> GlobalXTenant.<span class="syn-fn">resolveContext</span>(tenantId);' },
                { num: "47", type: "red", content: '- <span class="syn-kw">return</span> <span class="syn-fn">legacyHandler</span>();' },
                { num: "48", type: "green", content: '+ <span class="syn-kw">const</span> apiGateway = <span class="syn-kw">new</span> <span class="syn-fn">GlobalXGateway</span>({ tenant: tenantConfig });' },
                { num: "49", type: "green", content: '+ <span class="syn-kw">return</span> session ? apiGateway.<span class="syn-fn">dispatch</span>(req) : res.<span class="syn-fn">status</span>(401).<span class="syn-fn">json</span>({ error: <span class="syn-str">"Unauthorized"</span> });' },
                { num: "50", type: "green", content: '+ <span class="syn-kw">await</span> GlobalXMetrics.<span class="syn-fn">recordLatency</span>(tenantId, Date.<span class="syn-fn">now</span>() - startTime);' }
            ]
        },
        {
            prompt: "Deploy GlobalX real-time neural sync and distributed Redis caching",
            project: "globalx/ai-platform",
            startPercent: 18.50,
            endPercent: 100.0,
            tasks: [
                { name: "Synchronize distributed Kafka & Redis partitions", status: "running" },
                { name: "Optimize P99 neural inference latency < 4.2ms", status: "pending" }
            ],
            thought: "Thought for 2.1s",
            file: "src/globalx/ai/neuralStreamPipeline.ts",
            lines: [
                { num: "104", type: "normal", content: '<span class="syn-kw">const</span> cluster = <span class="syn-kw">await</span> GlobalXCluster.<span class="syn-fn">connect</span>({ region: <span class="syn-str">"ap-south-1"</span> });' },
                { num: "105", type: "green", content: '+ <span class="syn-kw">const</span> cacheKey = `<span class="syn-str">globalx:tenant:${tenantId}:neural_cache</span>`;' },
                { num: "106", type: "green", content: '+ <span class="syn-kw">const</span> cachedTensor = <span class="syn-kw">await</span> cluster.<span class="syn-fn">getCache</span>(cacheKey);' },
                { num: "107", type: "green", content: '+ <span class="syn-kw">if</span> (cachedTensor) <span class="syn-kw">return</span> GlobalXSerializer.<span class="syn-fn">hydrate</span>(cachedTensor);' },
                { num: "108", type: "red", content: '- <span class="syn-kw">const</span> rawModel = <span class="syn-kw">await</span> <span class="syn-fn">fetchSlowLegacyData</span>(tenantId);' },
                { num: "109", type: "green", content: '+ <span class="syn-kw">const</span> queryEmbedding = <span class="syn-kw">await</span> GlobalXAI.<span class="syn-fn">embedText</span>(query, { dims: 1536 });' },
                { num: "110", type: "green", content: '+ <span class="syn-kw">const</span> searchResults = <span class="syn-kw">await</span> GlobalXVectorDB.<span class="syn-fn">search</span>(queryEmbedding, { topK: 10 });' },
                { num: "111", type: "green", content: '+ <span class="syn-kw">await</span> cluster.<span class="syn-fn">writeThrough</span>(cacheKey, searchResults, { ttlSeconds: 3600 });' },
                { num: "112", type: "green", content: '+ <span class="syn-kw">return</span> { status: <span class="syn-str">"SUCCESS"</span>, data: searchResults, latencyMs: 3.8 };' }
            ]
        },
        {
            prompt: "Automate zero-downtime Kubernetes deployments with auto-healing SLA 99.99%",
            project: "globalx/cloud-infra",
            startPercent: 22.10,
            endPercent: 100.0,
            tasks: [
                { name: "Deploy multi-region GlobalX Kubernetes cluster", status: "running" },
                { name: "Verify zero-downtime rolling update health", status: "pending" }
            ],
            thought: "Thought for 1.8s",
            file: "deploy/globalx/production-cluster.yaml",
            lines: [
                { num: "28", type: "normal", content: 'apiVersion: <span class="syn-str">apps/v1</span>' },
                { num: "29", type: "normal", content: 'kind: <span class="syn-fn">Deployment</span>' },
                { num: "30", type: "normal", content: 'metadata:' },
                { num: "31", type: "normal", content: '  name: <span class="syn-str">globalx-enterprise-microservice</span>' },
                { num: "32", type: "normal", content: 'spec:' },
                { num: "33", type: "normal", content: '  replicas: <span class="syn-var">18</span>' },
                { num: "34", type: "green", content: '+ strategy: <span class="syn-kw">RollingUpdate</span>' },
                { num: "35", type: "green", content: '+ maxSurge: <span class="syn-var">25%</span>' },
                { num: "36", type: "green", content: '+ maxUnavailable: <span class="syn-var">0</span>' },
                { num: "37", type: "red", content: '- type: <span class="syn-kw">Recreate</span>' },
                { num: "38", type: "green", content: '+ healthCheck:' },
                { num: "39", type: "green", content: '+   readinessProbe: <span class="syn-str">/v1/healthz</span>' },
                { num: "40", type: "green", content: '+   autoHealing: <span class="syn-kw">enabled</span>' }
            ]
        }
    ];

    var currentIdx = 0;
    var isPaused = false;
    var currentPercentVal = 13.35;
    var activeTimer = null;

    terminal.addEventListener("mouseenter", function () { isPaused = true; });
    terminal.addEventListener("mouseleave", function () { isPaused = false; });

    function animatePercentTo(targetVal, duration) {
        var startVal = currentPercentVal;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var elapsed = timestamp - startTime;
            var progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            var ease = 1 - Math.pow(1 - progress, 3);
            currentPercentVal = startVal + (targetVal - startVal) * ease;

            var formatted = currentPercentVal.toFixed(2) + "%";
            if (progressText) progressText.textContent = formatted;
            if (progressFill) progressFill.style.width = formatted;

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    }

    function renderTasks(tasksList) {
        if (!tasksContainer) return;
        tasksContainer.innerHTML = tasksList.map(function (t) {
            var badgeCls = t.status === 'running' ? 'badge-running' : (t.status === 'done' ? 'badge-done' : 'text-muted');
            var statusLabel = t.status === 'running' ? '[running]' : (t.status === 'done' ? '[done]' : '[queued]');
            return '<div class="xai-task-line">' +
                '<span class="xai-pipe">|</span>' +
                '<span class="xai-task-name">' + t.name + '</span>' +
                '<span class="xai-badge ' + badgeCls + '">' + statusLabel + '</span>' +
            '</div>';
        }).join("");
    }

    function typePrompt(text, callback) {
        if (!promptText) {
            if (callback) callback();
            return;
        }
        promptText.textContent = "";
        var i = 0;
        var interval = setInterval(function () {
            if (isPaused) return;
            promptText.textContent = text.slice(0, i + 1);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (callback) setTimeout(callback, 350);
            }
        }, 28);
    }

    function streamScenario(sc) {
        if (pathEl) pathEl.textContent = sc.project;
        if (thoughtText) thoughtText.textContent = sc.thought;
        if (filePath) filePath.textContent = sc.file;

        var tasksState = [
            { name: sc.tasks[0].name, status: "running" },
            { name: sc.tasks[1].name, status: "pending" }
        ];
        renderTasks(tasksState);

        // Reset percentage to scenario start
        currentPercentVal = sc.startPercent;
        if (progressText) progressText.textContent = sc.startPercent.toFixed(2) + "%";
        if (progressFill) progressFill.style.width = sc.startPercent.toFixed(2) + "%";

        if (!codeEditor) return;
        codeEditor.innerHTML = "";

        var totalLines = sc.lines.length;
        var lineIndex = 0;

        function appendNextLine() {
            if (isPaused) {
                setTimeout(appendNextLine, 500);
                return;
            }

            if (lineIndex >= totalLines) {
                // All lines rendered! Mark tasks done and set 100%
                tasksState[0].status = "done";
                tasksState[1].status = "done";
                renderTasks(tasksState);
                animatePercentTo(sc.endPercent, 600);

                // Pause before next scenario
                setTimeout(function () {
                    nextScenario();
                }, 4500);
                return;
            }

            var line = sc.lines[lineIndex];

            // Midpoint task update
            if (lineIndex === Math.floor(totalLines / 2)) {
                tasksState[0].status = "done";
                tasksState[1].status = "running";
                renderTasks(tasksState);
            }

            // Create line element
            var cls = line.type === 'green' ? 'xai-diff-green' : (line.type === 'red' ? 'xai-diff-red' : '');
            var lineEl = document.createElement("div");
            lineEl.className = "xai-code-line " + cls;
            lineEl.style.opacity = "0";
            lineEl.style.transform = "translateY(5px)";
            lineEl.style.transition = "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)";
            lineEl.innerHTML = '<span class="xai-line-num">' + line.num + '</span><span class="xai-line-content">' + line.content + '</span>';

            codeEditor.appendChild(lineEl);

            // Animate appearance
            requestAnimationFrame(function () {
                lineEl.style.opacity = "1";
                lineEl.style.transform = "translateY(0)";
            });

            // Smoothly auto-scroll editor downwards as new code is written
            codeEditor.scrollTo({
                top: codeEditor.scrollHeight,
                behavior: "smooth"
            });

            // Dynamically increment percentage on each line added
            var stepPercent = sc.startPercent + ((sc.endPercent - sc.startPercent) * ((lineIndex + 1) / totalLines));
            animatePercentTo(stepPercent, 350);

            lineIndex++;
            setTimeout(appendNextLine, 380);
        }

        appendNextLine();
    }

    function nextScenario() {
        if (isPaused) {
            setTimeout(nextScenario, 1200);
            return;
        }

        currentIdx = (currentIdx + 1) % scenarios.length;
        var nextSc = scenarios[currentIdx];

        typePrompt(nextSc.prompt, function () {
            streamScenario(nextSc);
        });
    }

    // After 3.5 seconds initial view, smoothly trigger live streaming
    setTimeout(function () {
        nextScenario();
    }, 3500);
}

// Call on DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLiveCodingEngine);
} else {
    initLiveCodingEngine();
}
