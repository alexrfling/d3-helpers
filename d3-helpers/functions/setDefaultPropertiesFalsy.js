function setDefaultPropertiesFalsy (object, options, defaults) {
    var properties = Object.keys(defaults);

    for (var j = 0; j < properties.length; j++) {
        var property = properties[j];

        object[property] = (options[property] || defaults[property]);
    }
}
