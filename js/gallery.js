function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results == null ? null : results[1];
}


function fillGallery() {
    $.getJSON("config/image.json", function (data) {
        var prefectureParam = urlParam("p");
        if (prefectureParam != null) {
            $('#content').prepend('<h1>Préfecture de ' + definition_of_english_name[prefectureParam]);
            $('.isotope_fillter').remove()
        }
        $.each(data.images, function (i) {
            var elem = data.images[i];
            if (elem.tags.includes(prefectureParam) || prefectureParam == null) {
                $('.imageGallery1').append("<div class='col-lg-3 col-md-4 col-sm-6 " + elem.tags.join(" ") + "'>" +
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
            $(".imageGallery1").replaceWith("<p>Il n'y a pas encore de photos sur cette préfecture :(</p>" +
                "<p>Retourner à la <a href='map.html'>carte</a> ou à la <a href='gallery.html'>gallerie</a>.</p>")
        }
    });
}

var definition_of_english_name = {
    1: "Hokkaido", 2: "Aomori", 3: "Iwate", 4: "Miyagi", 5: "Akita",
    6: "Yamagata", 7: "Fukushima", 8: "Ibaraki", 9: "Tochigi", 10: "Gunma",
    11: "Saitama", 12: "Chiba", 13: "Tokyo", 14: "Kanagawa", 15: "Niigata",
    16: "Toyama", 17: "Ishikawa", 18: "Fukui", 19: "Yamanashi", 20: "Nagano",
    21: "Gifu", 22: "Shizuoka", 23: "Aichi", 24: "Mie", 25: "Shiga",
    26: "Kyoto", 27: "Osaka", 28: "Hyogo", 29: "Nara", 30: "Wakayama",
    31: "Tottori", 32: "Shimane", 33: "Okayama", 34: "Hiroshima", 35: "Yamaguchi",
    36: "Tokushima", 37: "Kagawa", 38: "Ehime", 39: "Kochi", 40: "Fukuoka",
    41: "Saga", 42: "Nagasaki", 43: "Kumamoto", 44: "Oita", 45: "Miyazaki",
    46: "Kagoshima", 47: "Okinawa"
};

var checkExist = setInterval(function () {
    if ($('.imageGallery1').length) {
        clearInterval(checkExist);
        fillGallery();
    }
}, 100); // check every 100ms