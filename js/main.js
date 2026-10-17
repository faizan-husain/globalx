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

    // 1b. Automatic Dynamic Year Update (Updates 'Effective: YYYY', '.current-year', footer copyright, etc.)
    const updateDynamicYear = function () {
        const currentYear = new Date().getFullYear();
        $('.current-year, [data-dynamic-year]').text(currentYear);

        $('*').filter(function () {
            return $(this).children().length === 0 && /Effective:\s*\d{4}/i.test($(this).text());
        }).each(function () {
            $(this).text($(this).text().replace(/Effective:\s*\d{4}/i, 'Effective: ' + currentYear));
        });
    };
    updateDynamicYear();
    $(document).ready(updateDynamicYear);

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

    // Sync active state across desktop tabs and mobile vertical list
    $('.portfolio-filter-btn').removeClass('active');
    $('.portfolio-filter-btn[data-filter="' + filterValue + '"]').addClass('active');

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

    // Show only first matching cards
    updatePortfolioItems(true);

    // Update Load More
    updateLoadMoreButton();
});


// Handle URL parameter for portfolio filter and initial load
$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);

    // Pre-fill contact form if project parameter is provided
    const projectParam = urlParams.get('project');
    if (projectParam && $('#contact-message').length) {
        if (!$('#contact-message').val()) {
            $('#contact-message').val('Hello GlobalX Team,\n\nI am interested in discussing a project similar to "' + projectParam + '". Please share information on technical scope, architecture, and collaboration options.');
        }
    }

    if ($('#loadMoreBtn').length > 0 || $('.portfolio-item-wrapper').length > 0) {
        initLoadMore();

        const filterParam = urlParams.get('filter');
        if (filterParam) {
            const $filterBtn = $('.portfolio-filter-btn[data-filter="' + filterParam + '"]');
            if ($filterBtn.length > 0) {
                $filterBtn.trigger('click');
            }
        }
    }
});

$(window).on('load', function () {
    if ($('#loadMoreBtn').length > 0 || $('.portfolio-item-wrapper').length > 0) {
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
    if ($loadMoreBtn.length === 0) return;

    // Remove previous click handler
    $loadMoreBtn.off('click.loadMore');

    // Load More click - Silky smooth reveal with zero flashing
    $loadMoreBtn.on('click.loadMore', function (e) {
        e.preventDefault();

        const $btn = $(this);
        if ($btn.prop('disabled')) return;

        currentPage++;

        // Reveal next batch without touching or repainting already visible cards
        revealNextPortfolioItems();
        updateLoadMoreButton();
    });

    // Initial state
    updatePortfolioItems(false);
    updateLoadMoreButton();
}


// ================================
// Reveal Next Batch of Items (Smooth Silk Glide)
// ================================

function revealNextPortfolioItems() {
    const $items = $('.portfolio-item-wrapper');
    // Find all hidden cards that match current active filter
    const $hiddenFiltered = $items.not('.filter-hidden').filter('.hidden');

    // Take next batch
    const $batch = $hiddenFiltered.slice(0, itemsPerPage);

    $batch.each(function (idx) {
        const $item = $(this);

        // Strip wow.js classes and inline styles to eliminate 1.0s delay and double-trigger
        $item.removeClass('hidden wow fadeInUp');
        $item.css({
            'visibility': 'visible',
            'opacity': '',
            'animation-name': '',
            'animation-delay': (idx * 0.06) + 's'
        });

        // Add smooth silk animation class
        $item.addClass('portfolio-card-revealing');

        // Cleanup after animation finishes so hover effects remain 100% natural
        setTimeout(function () {
            $item.removeClass('portfolio-card-revealing');
            $item.css({
                'animation-delay': '',
                'visibility': 'visible',
                'opacity': '1'
            });
        }, 450 + (idx * 60));
    });
}


// ================================
// Update Portfolio Items (For Filter & Initial Setup)
// ================================

function updatePortfolioItems(isFilterChange) {

    const $items = $('.portfolio-item-wrapper');
    let visibleCount = 0;
    let revealIdx = 0;

    $items.each(function () {

        const $item = $(this);

        // Filtered-out cards stay hidden
        if ($item.hasClass('filter-hidden')) {
            $item.addClass('hidden').removeClass('portfolio-card-revealing');
            return;
        }

        if (visibleCount < currentPage * itemsPerPage) {

            const wasHidden = $item.hasClass('hidden');
            $item.removeClass('hidden');

            if (isFilterChange && wasHidden) {
                // Smooth reveal for newly appearing cards under this filter
                $item.removeClass('wow fadeInUp');
                $item.css({
                    'visibility': 'visible',
                    'opacity': '',
                    'animation-name': '',
                    'animation-delay': (revealIdx * 0.05) + 's'
                });
                $item.addClass('portfolio-card-revealing');

                (function (elem, delay) {
                    setTimeout(function () {
                        elem.removeClass('portfolio-card-revealing');
                        elem.css({
                            'animation-delay': '',
                            'visibility': 'visible',
                            'opacity': '1'
                        });
                    }, 400 + (delay * 50));
                })($item, revealIdx);

                revealIdx++;
            } else {
                // Ensure card is visible without re-triggering animations on already visible cards
                $item.css({
                    'visibility': 'visible',
                    'opacity': '1'
                });
            }

            visibleCount++;

        } else {

            $item.addClass('hidden').removeClass('portfolio-card-revealing');
        }
    });
}


// ================================
// Update Load More Button
// ================================

function updateLoadMoreButton() {

    const $items = $('.portfolio-item-wrapper');
    const $loadMoreBtn = $('#loadMoreBtn');
    const $wrapper = $('#portfolioLoadMoreWrap').length ? $('#portfolioLoadMoreWrap') : $loadMoreBtn.closest('.text-center');

    if ($loadMoreBtn.length === 0) return;

    // Count ONLY cards belonging to current filter
    const totalFilteredItems =
        $items.not('.filter-hidden').length;

    // Count cards currently displayed
    const visibleFilteredItems =
        $items.not('.filter-hidden').not('.hidden').length;

    // If all cards loaded or total items fit in first page, hide button & wrapper completely
    if (totalFilteredItems <= itemsPerPage || visibleFilteredItems >= totalFilteredItems) {
        $loadMoreBtn.addClass('hidden').hide();
        $wrapper.addClass('hidden').hide();
    } else {
        $loadMoreBtn.removeClass('hidden').show();
        $wrapper.removeClass('hidden').show();
    }
}



// ==========================================
// GLOBALX Premium Minimal Project Detail View
// ==========================================
const portfolioProjectsData = {
    1: {
        title: "Custom Enterprise Software",
        category: "Enterprise Solutions",
        poster: "img/products/enterprise-software.webp",
        tags: ["Java 21", "Spring Boot 3", "PostgreSQL", "React.js", "Docker", "Redis"],
        desc: "Custom enterprise software built to streamline operations, automate workflows, manage massive datasets, and improve executive decision-making across teams.",
        specs: {
            solutionType: "Modular Enterprise ERP & Automation Suite",
            suitableFor: "Large Scale Operations, Corporate Teams & Campuses"
        },
        features: [
            { title: "CRM & Pipeline Automation", desc: "Leads pipeline, deal management, automated follow-up reminders, and sales performance tracking.", icon: "fas fa-users" },
            { title: "Inventory & Warehousing", desc: "Real-time stock tracking across multiple warehouses, purchase order workflows, and low-stock alerts.", icon: "fas fa-boxes-stacked" },
            { title: "College & Campus ERP", desc: "Student life-cycle management, fee billing, automated receipt generation, and attendance management.", icon: "fas fa-graduation-cap" },
            { title: "HRMS & Automated Payroll", desc: "Employee records, attendance sync, leaves approval workflow, and one-click salary slip generation.", icon: "fas fa-user-tie" }
        ]
    },
    2: {
        title: "E-Commerce Shop",
        category: "E-Commerce Platform",
        poster: "img/products/e-commerce.webp",
        tags: ["Spring Boot", "React.js", "PostgreSQL", "Razorpay / Stripe", "Redis", "Elasticsearch"],
        desc: "A modern, high-converting e-commerce platform designed to showcase catalogs, manage orders, process secure digital payments, and deliver an ultra-fast shopping experience.",
        specs: {
            solutionType: "Omnichannel Online Storefront & Management",
            suitableFor: "Direct-to-Consumer (D2C) Brands & Multi-Vendor Retail"
        },
        features: [
            { title: "Dynamic Product Catalog", desc: "Multi-category products, variants (size/color), image galleries, custom attributes, and instant search.", icon: "fas fa-boxes-stacked" },
            { title: "Frictionless Cart & Checkout", desc: "High-conversion checkout flow with automated coupon calculations, tax estimations, and payment gateway support.", icon: "fas fa-cart-shopping" },
            { title: "Live Order Tracking", desc: "Real-time order statuses, shipment tracking numbers, and automated customer status notifications.", icon: "fas fa-truck" },
            { title: "Admin Analytics Hub", desc: "Daily sales revenue, top performing products, customer retention metrics, and real-time inventory levels.", icon: "fas fa-chart-line" }
        ]
    },
    3: {
        title: "Advertising Website",
        category: "Business Website",
        poster: "img/products/advertising.webp",
        tags: ["Next.js", "Vue.js", "GSAP Animations", "Tailwind CSS", "HTML5"],
        desc: "High-converting advertising and brand showcase website designed to launch marketing campaigns, highlight service portfolios, and capture high-intent client inquiries.",
        specs: {
            solutionType: "Conversion-Focused High-Performance Landing Hub",
            suitableFor: "Agencies, Product Launches & Growth-Driven Brands"
        },
        features: [
            { title: "Campaign Landing Pages", desc: "Engaging multimedia hero banners and conversion-driven layouts tailored for high CTR marketing campaigns.", icon: "fas fa-bullhorn" },
            { title: "Instant Lead Capture", desc: "Interactive inquiry forms routed directly to CRM, email, and WhatsApp for rapid response turnaround.", icon: "fas fa-envelope-open-text" },
            { title: "Optimized Performance", desc: "Lightweight build and fast loading speeds to maximize ad campaign conversion rates and minimize bounce.", icon: "fas fa-bolt" },
            { title: "SEO & Social Sharing", desc: "Full structured schema, social preview cards, and metadata crawl optimization for search visibility.", icon: "fas fa-magnifying-glass" }
        ]
    },
    4: {
        title: "Resume Portfolio Website",
        category: "Personal Branding",
        poster: "img/products/portfolio.webp",
        tags: ["HTML5", "CSS3", "Modern JavaScript", "Bootstrap 5", "FontAwesome"],
        desc: "An interactive professional portfolio website designed for developers, creators, and executives to present projects, skills, career milestones, and credentials.",
        specs: {
            solutionType: "Interactive Executive & Developer Portfolio",
            suitableFor: "Software Engineers, Designers, Consultants & Executives"
        },
        features: [
            { title: "Interactive Bio & Skills", desc: "Skill proficiency indicators, tech stack badges, and achievements highlighting your professional edge.", icon: "fas fa-id-card" },
            { title: "Career Timeline", desc: "Chronological employment history, education, and certified milestones with expandable details.", icon: "fas fa-clock-rotate-left" },
            { title: "Categorized Project Showcase", desc: "Filterable work portfolio with live demo links, repository badges, and high-definition screenshots.", icon: "fas fa-laptop-code" },
            { title: "Direct Contact Form", desc: "One-click resume download and contact messaging widget connecting visitors directly to your inbox.", icon: "fas fa-paper-plane" }
        ]
    },
    5: {
        title: "Corporate Business Website",
        category: "Corporate Solutions",
        poster: "img/products/corporate-website.webp",
        tags: ["React.js", "Next.js", "Bootstrap 5", "Node.js", "Figma"],
        desc: "A premium corporate website engineered to establish digital brand authority, articulate enterprise offerings, build credibility with clients, and capture consultation inquiries.",
        specs: {
            solutionType: "Institutional Multi-Page Corporate Portal",
            suitableFor: "Established Enterprises, Consulting Firms & Tech Companies"
        },
        features: [
            { title: "Enterprise Brand Identity", desc: "Sleek, minimalist aesthetic conveying institutional authority, reliability, and technical sophistication.", icon: "fas fa-building" },
            { title: "Services & Capabilities", desc: "Deep-dive sections detailing practice areas, methodologies, case studies, and corporate deliverables.", icon: "fas fa-briefcase" },
            { title: "Lead Ingestion System", desc: "Consultation request routing, automatic email alerts, and integration with customer management tools.", icon: "fas fa-bullseye" },
            { title: "Interactive Office Locations", desc: "Regional office listings with interactive maps, direct contacts, and local business hours.", icon: "fas fa-map-location-dot" }
        ]
    },
    6: {
        title: "Premium Black Theme Shop",
        category: "Luxury E-Commerce",
        poster: "img/products/black-ecommerce.webp",
        tags: ["Node.js", "React.js", "Tailwind CSS", "Framer Motion", "Stripe"],
        desc: "A luxury dark-themed online storefront tailored for high-end fashion, tech gadgets, and lifestyle brands seeking an immersive, cinematic shopping atmosphere.",
        specs: {
            solutionType: "High-End Dark Aesthetic E-Commerce Experience",
            suitableFor: "Luxury Brands, Fashion Boutiques, Watches & High-Tech Products"
        },
        features: [
            { title: "Minimal Dark Aesthetics", desc: "Deep obsidian backdrop with subtle frost accents, smooth micro-interactions, and visual polish.", icon: "fas fa-gem" },
            { title: "High-Res Visual Gallery", desc: "Immersive product photography showcase with zoom, thumbnail navigation, and video integration.", icon: "fas fa-bag-shopping" },
            { title: "Instant Search & Filtering", desc: "Real-time client-side filter by price, collection, and tags for instantaneous catalog browsing.", icon: "fas fa-sliders" },
            { title: "Mobile-First Shopping Flow", desc: "Fluid mobile checkout drawer and responsive navigation designed for seamless customer purchases.", icon: "fas fa-credit-card" }
        ]
    },
    7: {
        title: "Car Wash System Pro",
        category: "Business Software",
        poster: "img/products/carwash.webp",
        tags: ["PHP 8.2", "MySQL 8", "JavaScript", "Bootstrap 5", "XAMPP"],
        desc: "A complete car detailing and wash management platform automating booking schedules, service bay allocations, cashier billing, staff tracking, and business metrics.",
        specs: {
            solutionType: "Automated Bay & POS Management Platform",
            suitableFor: "Auto Detailing Studios, Car Wash Chains & Service Bays"
        },
        features: [
            { title: "Bay Scheduling & Booking", desc: "Real-time bay capacity planning preventing customer bottlenecks and managing peak-hour drive-ins.", icon: "fas fa-calendar-check" },
            { title: "Tiered Service Packages", desc: "Wash, polish, interior detail, and ceramic coating pricing packages with custom add-on pricing.", icon: "fas fa-spray-can-sparkles" },
            { title: "Technician & Bay Assignment", desc: "Staff productivity logging, job completion times, commission calculators, and quality audit stamps.", icon: "fas fa-user-check" },
            { title: "Automated Invoicing & SMS", desc: "Instant digital receipts sent via SMS and WhatsApp to vehicle owners upon job completion.", icon: "fas fa-file-invoice-dollar" }
        ]
    },
    8: {
        title: "The Gym Manager",
        category: "Fitness Tech",
        poster: "img/products/gym.webp",
        tags: ["PHP 8.2", "PostgreSQL / MySQL", "JavaScript", "QR Code SDK"],
        desc: "All-in-one health club and fitness center software handling member registrations, recurring subscriptions, trainer scheduling, check-ins, and daily revenue reporting.",
        specs: {
            solutionType: "Health Club & Membership Management Software",
            suitableFor: "Gyms, Fitness Studios, MMA Centers & Wellness Clubs"
        },
        features: [
            { title: "Member Digital Profiles", desc: "Fitness goals, medical notes, membership plans, emergency contacts, and attendance history.", icon: "fas fa-address-card" },
            { title: "Membership Expiry Tracking", desc: "Automated renewal alerts, grace periods, payment receipts, and locker fee tracking.", icon: "fas fa-repeat" },
            { title: "Fast Biometric / QR Access", desc: "Front-desk check-in validation preventing unauthorized entries and monitoring facility occupancy.", icon: "fas fa-qrcode" },
            { title: "Trainer & Session Booking", desc: "Personal training appointment slots, trainer commission splits, and workout regimen tracking.", icon: "fas fa-dumbbell" }
        ]
    },
    9: {
        title: "Customize Mobile Apps",
        category: "Mobile Applications",
        poster: "img/products/mobile-app.webp",
        tags: ["Flutter 3", "Kotlin", "Swift", "Firebase", "REST APIs", "SQLite"],
        desc: "End-to-end bespoke mobile applications designed for enterprises and startups, ensuring smooth native performance, biometric authentication, offline sync, and cloud scalability.",
        specs: {
            solutionType: "Cross-Platform iOS & Android Native Applications",
            suitableFor: "Consumer Apps, On-Demand Delivery, Healthcare & FinTech"
        },
        features: [
            { title: "Cross-Platform Codebase", desc: "Single performant codebase delivering native iOS and Android apps with shared business logic.", icon: "fas fa-mobile-screen-button" },
            { title: "Targeted Push Notifications", desc: "Segmented messaging campaigns with deep linking directly into app views, boosting retention.", icon: "fas fa-bell" },
            { title: "Offline Data Persistence", desc: "Local database caching syncing effortlessly once network connectivity is re-established.", icon: "fas fa-cloud-arrow-up" },
            { title: "Secure Biometric Auth", desc: "FaceID and fingerprint integration protecting sensitive customer credentials and transactions.", icon: "fas fa-shield-halved" }
        ]
    },
    10: {
        title: "Tourism Booking System",
        category: "Travel & Tourism",
        poster: "img/products/tourism.webp",
        tags: ["Java 21", "Node.js", "React.js", "MySQL 8", "Leaflet Maps"],
        desc: "An end-to-end travel and tour operator portal simplifying holiday package discovery, seasonal seat allocations, traveler itinerary downloads, and multi-currency payments.",
        specs: {
            solutionType: "Travel Agency Booking & Itinerary Engine",
            suitableFor: "Tour Operators, Destination DMCs & Travel Consolidators"
        },
        features: [
            { title: "Interactive Tour Itineraries", desc: "Day-by-day sightseeing agendas, hotel inclusions, photo galleries, and printable customer itineraries.", icon: "fas fa-map-pin" },
            { title: "Smart Seat & Room Allocations", desc: "Live availability calendar preventing overbooking across flight seats, vehicles, and hotel blocks.", icon: "fas fa-plane-departure" },
            { title: "Digital Traveler Vouchers", desc: "Printable PDF and digital boarding passes generated immediately upon booking confirmation.", icon: "fas fa-passport" },
            { title: "Multi-Currency Payment Gateway", desc: "Seamless checkout supporting major debit/credit cards, UPI, and international payment gateways.", icon: "fas fa-money-bill-transfer" }
        ]
    },
    11: {
        title: "Advance Billing SaaS Application",
        category: "SaaS Product",
        poster: "img/products/billing-saas.webp",
        tags: ["Spring Boot", "Next.js 14", "PostgreSQL", "Docker", "Kafka", "Redis"],
        desc: "Enterprise cloud billing and business operating platform consolidating multi-entity invoicing, automated recurring subscriptions, inventory tracking, and tax compliance.",
        specs: {
            solutionType: "Multi-Entity Cloud Invoicing & Financial Operations SaaS",
            suitableFor: "SaaS Founders, Wholesale Distributors & Multi-Branch Hubs"
        },
        features: [
            { title: "Automated GST Compliance", desc: "Instant e-way bill generation, recurring subscription billing, and multi-currency tax compliance.", icon: "fas fa-receipt" },
            { title: "Multi-Branch Consolidation", desc: "Unified financial dashboard rolling up numbers across multiple subsidiaries and retail branches.", icon: "fas fa-network-wired" },
            { title: "Live Inventory Deductions", desc: "Automatic stock reduction upon billing with real-time supplier replenishment alerts.", icon: "fas fa-boxes-stacked" },
            { title: "Predictive Cash Flow Analytics", desc: "Real-time receivables aging, P&L reporting, and expense forecasting.", icon: "fas fa-chart-pie" }
        ]
    }
};

let lastOpenedProjectId = null;

window.openProjectDetail = function(projectId) {
    const data = portfolioProjectsData[projectId];
    if (!data) return;

    lastOpenedProjectId = projectId;

    // A. Minimal Navigation
    $('#detailNavCategory').text(data.category);

    // B. Hero Section
    $('#detailHeroCategory').text(data.category.toUpperCase());
    $('#detailHeroId').text('GLOBALX PRODUCT #' + String(projectId).padStart(2, '0'));
    $('#detailHeroTitle').text(data.title);
    $('#detailHeroSubtitle').text(data.desc);
    $('#detailHeroPoster').attr('src', data.poster).attr('alt', data.title);

    // CTAs (Primary & WhatsApp)
    const encodedTitle = encodeURIComponent(data.title);
    const contactUrl = 'contact.html?project=' + encodedTitle;
    $('#detailPrimaryCta').attr('href', contactUrl);
    $('#detailBottomContactCta').attr('href', contactUrl);

    const waMsg = encodeURIComponent("Hello GlobalX Team, I would like to inquire about: " + data.title + " (" + data.category + ").");
    const waUrl = 'https://wa.me/919272399002?text=' + waMsg;
    $('#detailWhatsappCta').attr('href', waUrl);
    $('#detailBottomWhatsappCta').attr('href', waUrl);

    // C. Project Overview
    $('#detailOverviewDesc').text(data.desc);
    const specs = data.specs || {};
    $('#detailSpecPurpose').text(specs.solutionType || data.category);
    $('#detailSpecTarget').text(specs.suitableFor || 'Modern businesses & high-growth operations');

    // D. Key Features (3–6 clean minimal cards)
    const $featuresContainer = $('#detailFeaturesContainer');
    $featuresContainer.empty();
    if (data.features && data.features.length) {
        data.features.forEach(function(f) {
            $featuresContainer.append(`
                <div class="col-md-6 col-lg-3">
                    <div class="gx-feature-card">
                        <div class="gx-feature-icon-wrap">
                            <i class="${f.icon || 'fas fa-layer-group'}"></i>
                        </div>
                        <h4 class="gx-feature-title">${f.title}</h4>
                        <p class="gx-feature-desc">${f.desc}</p>
                    </div>
                </div>
            `);
        });
    }

    // E. Technology Stack (understated labels)
    const $techBadges = $('#detailTechBadges');
    $techBadges.empty();
    if (data.tags && data.tags.length) {
        data.tags.forEach(function(tag) {
            $techBadges.append('<span class="gx-tech-pill">' + tag + '</span>');
        });
    }

    // Smooth transition
    $('#portfolioSectionHeader').slideUp(180);
    $('#portfolioListingView').hide();
    $('#portfolioDetailView').fadeIn(200);

    // Smooth scroll to top of detail view
    setTimeout(function() {
        if ($('#portfolioDetailView').length) {
            const targetOffset = $('#portfolioDetailView').offset().top - 80;
            window.scrollTo({ top: targetOffset, behavior: 'smooth' });
        }
    }, 50);

    // Update URL hash without page reload
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
