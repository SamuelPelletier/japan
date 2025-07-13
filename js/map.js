$(function () {
    const GALLERY_BASE_URL = 'https://image.japantrip.world/japan/';
    var yearParam = '2020'; // ou récupère dynamiquement si besoin
    $.getJSON(GALLERY_BASE_URL + yearParam + "/image.json", function (photos) {
        var areas = [
            {"code": 1, "name": "Hokkaidō", "color": "#ca93ea", "hoverColor": "#e0b1fb", "prefectures": [1]},
            {"code": 2, "name": "Tōhoku", "color": "#a7a5ea", "hoverColor": "#d6d4fd", "prefectures": [2, 3, 4, 5, 6, 7]},
            {"code": 3, "name": "Kantō", "color": "#84b0f6", "hoverColor": "#c1d8fd", "prefectures": [8, 9, 10, 11, 12, 13, 14]},
            {"code": 4, "name": "Koshinetsu", "color": "#52d49c", "hoverColor": "#93ecc5", "prefectures": [15, 16, 17, 18, 19, 20]},
            {"code": 5, "name": "Tōkai", "color": "#77e18e", "hoverColor": "#aff9bf", "prefectures": [21, 22, 23, 24]},
            {"code": 6, "name": "Kansai", "color": "#f2db7b", "hoverColor": "#f6e8ac", "prefectures": [25, 26, 27, 28, 29, 30]},
            {"code": 7, "name": "Chūgoku", "color": "#f9ca6c", "hoverColor": "#ffe5b0", "prefectures": [31, 32, 33, 34, 35]},
            {"code": 8, "name": "Shikoku", "color": "#fbad8b", "hoverColor": "#ffd7c5", "prefectures": [36, 37, 38, 39]},
            {"code": 9, "name": "Kyūshū", "color": "#f7a6a6", "hoverColor": "#ffcece", "prefectures": [40, 41, 42, 43, 44, 45, 46]},
            {"code": 10, "name": "Okinawa", "color": "#ea89c4", "hoverColor": "#fdcae9", "prefectures": [47]}
        ];

        $("#map").japanMap(
            {
                areas: areas,
                selection: "area",
                borderLineWidth: 0.25,
                drawsBoxLine: false,
                showsAreaName: true,
                width: 800,
                fontSize: 15,
                fontColor: "black",
                onSelect: function (region) {
                    var fullRegion = areas.find(function(a) { return a.code === region.code && a.name === region.name; });
                    if (!fullRegion) {
                        console.error('Région non trouvée dans areas:', region);
                        return;
                    }
                    var numberPhotos = getNumberPhotosByRegion(fullRegion);
                    if (numberPhotos === 0) {
                        $('#exampleModal .modal-body').html("<p>Il n'y a malheureusement pas encore de photos pour cette région :(");
                        $('#exampleModal .btn-primary').hide()
                    } else {
                        $('#exampleModal .modal-body').html('<p>Souhaitez-vous accéder aux photos de la région de ' + fullRegion.name + ' ? <br>Il y a ' + numberPhotos + ' photo' + (numberPhotos > 1 ? 's' : '') + ' :)</p>');
                        $('#exampleModal .btn-primary').show()
                    }
                    $('#exampleModal').modal();
                    console.log('region:', fullRegion, 'region.code:', fullRegion.code);
                    $('#exampleModal .btn-primary').off('click').on('click', function () {
                        window.location.href = "gallery.html?p=" + fullRegion.code;
                    })
                }
            }
        );

        function getNumberPhotosByRegion(region) {
            var counter = 0;
            $.each(photos.images, function (i) {
                var elem = photos.images[i];
                if (region.prefectures.includes(Number(elem.region)) || Number(elem.region) === Number(region.code)) {
                    counter++;
                }
            });
            console.log('Région:', region.name, 'Préfectures:', region.prefectures, 'Nombre trouvé:', counter);
            return counter;
        }
    });
});
