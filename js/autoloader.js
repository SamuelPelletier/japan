function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        elmnt.innerHTML = this.responseText;
                    }
                    if (this.status == 404) {
                        elmnt.innerHTML = "Page not found.";
                    }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

includeHTML();


$.getScript("js/popper.js");
$.getScript("js/bootstrap.min.js");
$.getScript("js/stellar.js");
$.getScript("vendors/lightbox/simpleLightbox.min.js");
$.getScript("vendors/nice-select/js/jquery.nice-select.min.js");
$.getScript("vendors/isotope/imagesloaded.pkgd.min.js");
$.getScript("vendors/isotope/isotope-min.js");
$.getScript("vendors/owl-carousel/owl.carousel.min.js");
$.getScript("vendors/japan-map/jquery.japan-map.js");
$.getScript("js/jquery.ajaxchimp.min.js");
$.getScript("js/mail-script.js");
$.getScript("js/theme.js");
$.getScript("js/gallery.js");
$.getScript("js/main.js");
$.getScript("js/map.js");