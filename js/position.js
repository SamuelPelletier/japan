var date = new Date();
var month = (date.getMonth() + 1);
month = pad(month, 2, "0");
var day = date.getDate();
day = pad(day, 2, "0");
$('#' + month + '-' + day).css('border', "solid #ff0000b8")

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}