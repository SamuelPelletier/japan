function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results == null ? null : results[1];
}


function fillGallery() {
    $.getJSON("config/image.json", function (data) {
        var regionParam = urlParam("p");
        if (regionParam != null) {
            $('#content').prepend('<h1>Région du ' + definition_of_english_name[regionParam]);
            $('.isotope_fillter').remove()
        }
        $.each(data.images, function (i) {
            var elem = data.images[i];
            if (elem.region == regionParam || regionParam == null) {
                $('.imageGallery1').append("<div class='col-lg-3 col-md-4 col-sm-6 " + elem.region + "'>" +
                    "                <div class='h_gallery_item'>" +
                    "                    <img src='" + elem.url + "' alt=''>" +
                    "                    <div class='hover'>" +
                    "                        <a href='#'><h4>" + elem.title + "</h4></a>" +
                    "                        <a class='light' href='" + elem.url + "'><i class='fa fa-expand'></i></a>" +
                    "                    </div>" +
                    "                </div>" +
                    "            </div>")
            }
        });
        if ($(".h_gallery_item img").length === 0) {
            $(".imageGallery1").replaceWith("<p>Il n'y a pas encore de photos pour cette région :(</p>" +
                "<p>Retourner à la <a href='map.html'>carte</a> ou à la <a href='gallery.html'>galerie</a>.</p>")
        }
    });
}

var definition_of_english_name = {
    1: "Hokkaido", 3: "Kanto", 4: "Koshinetsu",
    6: "Kansai", 7: "Chūgoku", 8: "Shikoku", 9: "Kyūshū", 10: "Okinawa"
};

var checkExist = setInterval(function () {
    if ($('.imageGallery1').length) {
        clearInterval(checkExist);
        fillGallery();
    }
}, 100); // check every 100ms