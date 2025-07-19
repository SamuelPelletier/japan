function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results == null ? null : results[1];
}

var IMAGES_PER_PAGE = 12;
var galleryData = [];
var currentPage = 1;
var totalPages = 1;

function renderGalleryPage(page) {
    var regionParam = urlParam("p");
    var yearParam = urlParam("year") || '2020';
    regionParam = regionParam ? Number(regionParam) : null;
    var filteredImages;
    if (regionParam) {
        const area = AREAS.find(a => a.code === regionParam);
        filteredImages = galleryData.filter(function(elem) {
            return Number(elem.region) === regionParam;
        });
    } else {
        filteredImages = galleryData.filter(function(elem) {
            return (Number(elem.region) === regionParam || regionParam == null);
        });
    }
    totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);
    var start = (page - 1) * IMAGES_PER_PAGE;
    var end = start + IMAGES_PER_PAGE;
    var imagesToShow = filteredImages.slice(start, end);
    var $gallery = $('.imageGallery1');
    $gallery.empty();
    imagesToShow.forEach(function(elem) {
        var safeTitle = escapeHtml(elem.title || '');
        var imagePath = yearParam + '/' + elem.url;
        $gallery.append(
            "<div class='col-lg-3 col-md-4 col-sm-6 mb-4'>" +
                "<div class='gallery-card'>" +
                    "<a href='" + GALLERY_BASE_URL + imagePath + "' class='h_gallery_item' data-sub-html='<h4>" + safeTitle + "</h4>'>" +
                        "<img src='" + GALLERY_BASE_URL + imagePath + "' alt=''>" +
                    "</a>" +
                    (safeTitle ? ("<div class='gallery-desc'>" + safeTitle + "</div>") : "") +
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
    var yearParam = urlParam("year") || '2020';
    $.getJSON(GALLERY_BASE_URL + yearParam + "/image.json", function (data) {
        galleryData = data.images.slice().reverse();
        currentPage = 1;
        renderGalleryPage(currentPage);
        var regionParam = urlParam("p");
        if (regionParam != null) {
            // $('#content').prepend('<h1>Région du ' + definition_of_english_name[regionParam]);
        }
    });
}

function getRegionNameByCode(code) {
    const area = AREAS.find(a => a.code === Number(code));
    return area ? area.name : '';
}

$(document).on('click', '.gallery_filter li', function(e) {
    e.preventDefault();
    $('.gallery_filter li').removeClass('active');
    $(this).addClass('active');
    var filter = $(this).data('filter');
    var params = new URLSearchParams(window.location.search);
    if (filter === '*') {
        params.delete('p');
    } else {
        var region = filter.replace('.', '');
        params.set('p', region);
    }
    // Conserver le paramètre year si présent
    window.location.search = params.toString();
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
    fillGallery();
    // Met à jour le filtre actif selon l'URL
    var regionParam = urlParam("p");
    $('.gallery_filter li').removeClass('active');
    if (regionParam) {
        var $li = $('.gallery_filter li[data-filter=".' + regionParam + '"]');
        if ($li.length) {
            $li.addClass('active');
        } else {
            $('.gallery_filter li[data-filter="*"]').addClass('active');
        }
    } else {
        $('.gallery_filter li[data-filter="*"]').addClass('active');
    }

    var yearParam = urlParam("year") || '2020';
    $('.year_filter li').removeClass('active');
    var $yearLi = $('.year_filter li[data-year="' + yearParam + '"]');
    if ($yearLi.length) {
        $yearLi.addClass('active');
    }
});