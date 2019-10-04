function fillGallery() {
    $.getJSON("config/image.json", function (data) {
        $.each(data.images, function (i) {
            var elem = data.images[i];
            $('.imageGallery1').append("<div class='col-lg-3 col-md-4 col-sm-6 " + elem.tags.join(" ") + "'>" +
                "                <div class='h_gallery_item'>" +
                "                    <img src='" + elem.url + "' alt=''>" +
                "                    <div class='hover'>" +
                "                        <a href='#'><h4>" + elem.title + "</h4></a>" +
                "                        <a class='light' href='" + elem.url + "'><i class='fa fa-expand'></i></a>" +
                "                    </div>" +
                "                </div>" +
                "            </div>")
        })
    });
}

var checkExist = setInterval(function () {
    if ($('.imageGallery1').length) {
        clearInterval(checkExist);
        fillGallery();
    }
}, 100); // check every 100ms