function interpolateColors (low, mid, high, length) {
    var lowToMidF = d3.interpolateLab(low, mid);
    var lowToMid = d3.range(Math.floor(length / 2)).map(function (j) {
        return lowToMidF(j / Math.floor(length / 2));
    });
    var midToHighF = d3.interpolateLab(mid, high);
    var midToHigh = d3.range(Math.ceil(length / 2)).map(function (j) {
        return midToHighF(j / Math.ceil(length / 2));
    });

    return lowToMid.concat(midToHigh);
}
