// returns a string that should be usable as an HTML id (work in progress)
function htmlEscape (str) {
    return str.replace(/\||\.|\(|\)|'|"| /g, '_');
}
