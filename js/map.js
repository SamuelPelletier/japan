$(function () {
    var yearParam = '2020'; // ou récupère dynamiquement si besoin
    $.getJSON(GALLERY_BASE_URL + yearParam + "/image.json", function (photos) {
        // Utiliser AREAS pour la carte
        var areas = AREAS;

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
                    var fullRegion = AREAS.find(function(a) { return a.code === region.code && a.name === region.name; });
                    if (!fullRegion) {
                        console.error('Région non trouvée dans AREAS:', region);
                        return;
                    }
                    var params = new URLSearchParams(window.location.search);
                    var year = params.get('year') || '2020';
                    window.location.href = "gallery.html?p=" + fullRegion.code + "&year=" + year;
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

    // Gérer le clic sur le bandeau d'années : mettre à jour l'URL
    $(document).on('click', '.year_filter li', function(e) {
        e.preventDefault();
        var year = $(this).data('year');
        var params = new URLSearchParams(window.location.search);
        params.set('year', year);
        window.location.search = params.toString();
    });
});
