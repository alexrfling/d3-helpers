// returns the given string with all period characters replaced with underscores
function dotsToUnders (str) {
    return str.replace(/\./g, '_');
}

// returns the given string will all underscore characters replaced with spaces (necessary???)
function undersToSpaces (str) {
    return str.replace(/_/g, ' ');
}

// returns the given string with all paren characters replaced with underscores
function parensToUnders (str) {
    return str.replace(/\(|\)/g, '_');
}