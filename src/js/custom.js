(function ($) {
    'use strict';

    // Sticky nav shadow once the topbar scrolls away
    var $siteNav = $('.site-nav');
    if ($siteNav.length) {
        var onScroll = function () {
            $siteNav.toggleClass('is-stuck', window.scrollY > 120);
        };
        $(window).on('scroll', onScroll);
        onScroll();
    }

    if ($.fn.magnificPopup && $('.gallery-view').length) {
        $('.gallery-view').magnificPopup({
            delegate: 'a',
            type: 'image',
            tLoading: 'Loading image #%curr%...',
            mainClass: 'mfp-img-mobile',
            gallery: {
                enabled: true,
                navigateByImgClick: true,
                preload: [0, 1]
            }
        });
        $('.gallery-view a').attr('aria-haspopup', 'dialog');
    }

    $('.accordion').find('.accordion-title').on('click', function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle('fast');
        $('.accordion-content').not($(this).next()).slideUp('fast');
        $('.accordion-title').not($(this)).removeClass('active');
    });

    $('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
    $('.tab ul.tabs li a').on('click', function (g) {
        var tab = $(this).closest('.tab'),
            index = $(this).closest('li').index();
        tab.find('ul.tabs > li').removeClass('current');
        $(this).closest('li').addClass('current');
        tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
        tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
        g.preventDefault();
    });

    $('body').append('<div id="toTop" class="to-top" role="button" aria-label="Back to top" tabindex="0"><i class="fas fa-chevron-up" aria-hidden="true"></i></div>');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() !== 0) {
            $('#toTop').fadeIn();
        } else {
            $('#toTop').fadeOut();
        }
    });
    $('#toTop').on('click', function () {
        $("html, body").animate({ scrollTop: 0 }, 400);
        return false;
    });

    $('.map-facade').each(function () {
        var $facade = $(this);
        $facade.on('click', '.map-facade__load', function () {
            var src = $facade.attr('data-map-src');
            if (!src) {
                return;
            }
            var iframe = document.createElement('iframe');
            iframe.src = src;
            iframe.title = 'Map to Soakers hot tub store in Midvale, Utah';
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '450');
            iframe.setAttribute('loading', 'lazy');
            iframe.style.border = '0';
            iframe.style.display = 'block';
            $facade.empty().append(iframe).addClass('map-facade--loaded');
        });
    });

})(jQuery);
