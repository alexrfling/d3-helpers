function setDefaultPropertiesUndefined (object, options, defaults) {
    var properties = Object.keys(defaults);

    for (var j = 0; j < properties.length; j++) {
        var property = properties[j];
        var value = options[property];

        object[property] = (value === undefined ? defaults[property] : value);
    }
}
