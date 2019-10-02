var url = window.location.pathname;
var filename = url.substring(url.lastIndexOf('/') + 1);
$(document).ready(function () {
    if (filename.indexOf('gallery') >= 0) {
        filename = "gallery.html";
    }
    $('.menu_nav li a[href$="' + filename + '"]').parent().addClass("active");
});