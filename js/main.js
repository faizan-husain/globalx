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


// ================================
// Load More Functionality
// ================================

let currentPage = 1;
const itemsPerPage = 6;


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

    document.getElementById("consultationPopup").style.display = "block";
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
// No Thanks
// =========================

document.getElementById("dismissPopup").addEventListener("click", function (e) {

    e.preventDefault();

    document.getElementById("consultationPopup").style.display = "none";

    // Save current time
    localStorage.setItem("consultationDismissed", Date.now());

});


// =========================
// Get Started
// =========================

document.getElementById("startProjectBtn").addEventListener("click", function () {

    // Never show popup again
    localStorage.setItem("consultationStarted", "true");

});