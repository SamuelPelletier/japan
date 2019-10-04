var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);
$(document).ready(function () {
    if (filename.indexOf('gallery') >= 0) {
        filename = "gallery.html";
    } else if (filename.indexOf('about-us') >= 0) {
        var checkExist = setInterval(function () {
            if ($('.banner_content .theme_btn').length) {
                clearInterval(checkExist);
                $('.banner_content .theme_btn').remove();
            }
        }, 100); // check every 100ms
    }
    $('.menu_nav li a[href$="' + filename + '"]').parent().addClass("active");
});