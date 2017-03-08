function sample (array, max) {
    if (array.length <= max) {
        return array;
    } else {
        var sampler = d3.scaleLinear()
            .domain([0, max - 1])
            .range([0, array.length - 1]);
        var sampledIndices = d3.range(max).map(function (i) {
            return Math.floor(sampler(i));
        });

        return sampledIndices.map(function (i) {
            return array[i];
        });
    }
}
