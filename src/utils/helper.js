
function convertToJSON(str) {
    var str1 = str.replace(/[{}]/g, '');
    var properties = str1.split(',');
    var obj = {};
    properties.forEach(function (property) {
        var tup = property.split(':');
        obj[tup[0]] = tup[1];
    });
    return obj;
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode.toUpperCase().split('').map(char => 
        0x1F1E6 - 65 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

module.exports = {
    convertToJSON,
    getFlagEmoji
}