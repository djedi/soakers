/* Soakers site interactions — dependency-free (no jQuery/Bootstrap JS) */
(function () {
    'use strict';

    // --- Sticky nav shadow ---
    var siteNav = document.querySelector('.site-nav');
    if (siteNav) {
        var onScroll = function () {
            siteNav.classList.toggle('is-stuck', window.scrollY > 120);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // --- Mobile nav collapse (hamburger) ---
    var toggler = document.querySelector('.navbar-toggler');
    var navCollapse = document.getElementById('siteNav');
    if (toggler && navCollapse) {
        toggler.addEventListener('click', function () {
            var expanded = toggler.getAttribute('aria-expanded') === 'true';
            toggler.setAttribute('aria-expanded', String(!expanded));
            navCollapse.classList.toggle('show');
        });
    }

    // --- Dropdown menus (click toggle on mobile; hover handled in CSS) ---
    document.querySelectorAll('.dropdown > .dropdown-toggle').forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            var dropdown = toggle.parentElement;
            var menu = dropdown.querySelector('.dropdown-menu');
            if (!menu) return;
            // Only toggle via click when the CSS hover-open can't apply (touch/small screens)
            var hoverAvailable = window.matchMedia('(hover: hover) and (min-width: 992px)').matches;
            if (hoverAvailable) {
                // Let the link navigate normally on desktop
                return;
            }
            e.preventDefault();
            var open = dropdown.classList.contains('show');
            document.querySelectorAll('.dropdown.show').forEach(function (d) {
                d.classList.remove('show');
                var t = d.querySelector('.dropdown-toggle');
                if (t) t.setAttribute('aria-expanded', 'false');
            });
            if (!open) {
                dropdown.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- Accordions (FAQ) ---
    document.querySelectorAll('.accordion-title').forEach(function (title) {
        title.addEventListener('click', function () {
            var content = title.nextElementSibling;
            var isOpen = title.classList.contains('active');
            document.querySelectorAll('.accordion-title').forEach(function (other) {
                other.classList.remove('active');
                var c = other.nextElementSibling;
                if (c && c.classList.contains('accordion-content')) {
                    c.style.display = 'none';
                }
            });
            if (!isOpen && content && content.classList.contains('accordion-content')) {
                title.classList.add('active');
                content.style.display = 'block';
            }
        });
    });

    // --- Gallery lightbox ---
    var galleryLinks = Array.prototype.slice.call(document.querySelectorAll('.gallery-view a[href$=".jpg"], .gallery-view a[href$=".jpeg"], .gallery-view a[href$=".png"], .gallery-view a[href$=".webp"]'));
    if (galleryLinks.length) {
        var lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image preview');
        lightbox.innerHTML = '<button class="lightbox__close" aria-label="Close preview">&times;</button><img class="lightbox__img" alt="" />';
        document.body.appendChild(lightbox);

        var lbImg = lightbox.querySelector('.lightbox__img');
        var closeLb = function () {
            lightbox.classList.remove('lightbox--open');
            document.body.classList.remove('no-scroll');
            lbImg.removeAttribute('src');
        };

        galleryLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                lbImg.src = link.href;
                lbImg.alt = link.querySelector('img') ? link.querySelector('img').alt : '';
                lightbox.classList.add('lightbox--open');
                document.body.classList.add('no-scroll');
            });
        });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target === lbImg) closeLb();
        });
        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLb);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) closeLb();
        });
    }

    // --- Back to top ---
    var toTop = document.createElement('div');
    toTop.className = 'to-top';
    toTop.setAttribute('role', 'button');
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.setAttribute('tabindex', '0');
    toTop.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i>';
    document.body.appendChild(toTop);

    toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Click-to-load Google Map ---
    document.querySelectorAll('.map-facade').forEach(function (facade) {
        facade.addEventListener('click', function (e) {
            if (!e.target.closest('.map-facade__load')) return;
            var src = facade.getAttribute('data-map-src');
            if (!src) return;
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.title = 'Map to Soakers hot tub store in Midvale, Utah';
            iframe.width = '100%';
            iframe.height = '450';
            iframe.loading = 'lazy';
            iframe.style.border = '0';
            iframe.style.display = 'block';
            facade.innerHTML = '';
            facade.classList.add('map-facade--loaded');
            facade.appendChild(iframe);
        });
    });
})();
