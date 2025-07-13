function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results == null ? null : results[1];
}

var IMAGES_PER_PAGE = 12;
var galleryData = [];
var currentPage = 1;
var totalPages = 1;

var areaToPrefectures = {
    1: [1],
    2: [2, 3, 4, 5, 6, 7],
    3: [8, 9, 10, 11, 12, 13, 14],
    4: [15, 16, 17, 18, 19, 20], // Koshinetsu
    5: [21, 22, 23, 24],         // Tokai
    6: [25, 26, 27, 28, 29, 30],
    7: [31, 32, 33, 34, 35],
    8: [36, 37, 38, 39],
    9: [40, 41, 42, 43, 44, 45, 46],
    10: [47]
};

const GALLERY_BASE_URL = 'https://image.japantrip.world/japan/';

function renderGalleryPage(page) {
    var regionParam = urlParam("p");
    var yearParam = urlParam("year") || '2020';
    var filteredImages;
    if (regionParam && areaToPrefectures[regionParam]) {
        filteredImages = galleryData.filter(function(elem) {
            var matchRegion = areaToPrefectures[regionParam].includes(Number(elem.region)) || Number(elem.region) === Number(regionParam);
            var matchYear = !elem.year || elem.year == yearParam;
            return matchRegion && matchYear;
        });
    } else {
        filteredImages = galleryData.filter(function(elem) {
            var matchRegion = (elem.region == regionParam || regionParam == null);
            var matchYear = !elem.year || elem.year == yearParam;
            return matchRegion && matchYear;
        });
    }
    totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
    var start = (page - 1) * IMAGES_PER_PAGE;
    var end = start + IMAGES_PER_PAGE;
    var imagesToShow = filteredImages.slice(start, end);
    var $gallery = $('.imageGallery1');
    $gallery.empty();
    imagesToShow.forEach(function(elem) {
        var safeTitle = escapeHtml(elem.title);
        var yearFolder = elem.year || '2020';
        var imagePath = yearFolder + '/' + elem.url;
        $gallery.append(
            "<div class='col-lg-3 col-md-4 col-sm-6 mb-4'>" +
                "<div class='gallery-card'>" +
                    "<a href='" + GALLERY_BASE_URL + imagePath + "' class='h_gallery_item' data-sub-html='<h4>" + safeTitle + "</h4>'>" +
                        "<img src='" + GALLERY_BASE_URL + imagePath + "' alt=''>" +
                    "</a>" +
                    "<div class='gallery-desc'>" + safeTitle + "</div>" +
                "</div>" +
            "</div>"
        );
    });
    if ($gallery.data('lightGallery')) {
        $gallery.data('lightGallery').destroy(true);
    }
    $gallery.lightGallery({ selector: '.h_gallery_item' });
    if (imagesToShow.length === 0) {
        $gallery.html("<p>Il n'y a pas encore de photos pour cette région :(</p>" +
            "<p>Retourner à la <a href='map.html'>carte</a> ou à la <a href='gallery.html'>galerie</a>.</p>");
    }
    renderPagination(page, totalPages);
}

function renderPagination(page, totalPages) {
    var $pagination = $('#pagination');
    $pagination.empty();
    if (totalPages <= 1) return;
    var prevDisabled = (page === 1) ? 'disabled' : '';
    var nextDisabled = (page === totalPages) ? 'disabled' : '';
    $pagination.append('<button class="btn btn-sm btn-primary" id="prevPage" ' + prevDisabled + '>Précédent</button>');
    for (var i = 1; i <= totalPages; i++) {
        var active = (i === page) ? 'active' : '';
        $pagination.append('<button class="btn btn-sm btn-secondary mx-1 pageBtn ' + active + '" data-page="' + i + '">' + i + '</button>');
    }
    $pagination.append('<button class="btn btn-sm btn-primary" id="nextPage" ' + nextDisabled + '>Suivant</button>');
    $pagination.off('click').on('click', '.pageBtn', function() {
        var p = parseInt($(this).data('page'));
        if (p !== page) {
            currentPage = p;
            renderGalleryPage(currentPage);
        }
    });
    $pagination.on('click', '#prevPage', function() {
        if (currentPage > 1) {
            currentPage--;
            renderGalleryPage(currentPage);
        }
    });
    $pagination.on('click', '#nextPage', function() {
        if (currentPage < totalPages) {
            currentPage++;
            renderGalleryPage(currentPage);
        }
    });
}

function fillGallery() {
    $.getJSON("img/gallery/image.json", function (data) {
        galleryData = data.images.slice().reverse();
        currentPage = 1;
        renderGalleryPage(currentPage);
        var regionParam = urlParam("p");
        if (regionParam != null) {
            // $('#content').prepend('<h1>Région du ' + definition_of_english_name[regionParam]);
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
}, 100);

$(document).on('click', '.gallery_filter li', function(e) {
    e.preventDefault();
    $('.gallery_filter li').removeClass('active');
    $(this).addClass('active');
    var filter = $(this).data('filter');
    if (filter === '*') {
        history.replaceState(null, '', 'gallery.html');
        currentPage = 1;
        renderGalleryPage(currentPage);
    } else {
        // Le filtre est du type .3, .6, etc. On enlève le point pour obtenir le numéro de région
        var region = filter.replace('.', '');
        history.replaceState(null, '', 'gallery.html?p=' + region);
        currentPage = 1;
        renderGalleryPage(currentPage);
    }
});

$(document).on('click', '.year_filter li', function(e) {
    e.preventDefault();
    var year = $(this).data('year');
    $('.year_filter li').removeClass('active');
    $(this).addClass('active');
    var params = new URLSearchParams(window.location.search);
    params.set('year', year);
    window.location.search = params.toString();
});

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

$(function() {
    var regionParam = urlParam("p");
    if (regionParam) {
        $('.gallery_filter li').removeClass('active');
        var $li = $('.gallery_filter li[data-filter=".' + regionParam + '"]');
        if ($li.length) {
            $li.addClass('active');
        }
    }
    var yearParam = urlParam("year") || '2020';
    $('.year_filter li').removeClass('active');
    var $yearLi = $('.year_filter li[data-year="' + yearParam + '"]');
    if ($yearLi.length) {
        $yearLi.addClass('active');
    }
});