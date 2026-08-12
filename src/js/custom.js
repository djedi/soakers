(function ($) {
    'use strict';

    jQuery('.mean-menu').meanmenu({
        meanScreenWidth: "991"
    });
    var $meanToggle = $('.meanmenu-reveal');
    $meanToggle.attr({ 'role': 'button', 'aria-label': 'Toggle navigation', 'aria-expanded': 'false' });
    $meanToggle.on('click', function () {
        var expanded = $(this).attr('aria-expanded') === 'true';
        $(this).attr('aria-expanded', String(!expanded));
    });

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 150) {
            $('.navbar-area').addClass("sticky-nav");
        } else {
            $('.navbar-area').removeClass("sticky-nav");
        }
    });

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

    $('body').append('<div id="toTop" class="top-btn" role="button" aria-label="Back to top" tabindex="0"><i class="fas fa-chevron-up" aria-hidden="true"></i></div>');
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
