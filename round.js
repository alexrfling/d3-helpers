// rounds 'number' to 'decimals' decimal places
function round (number, decimals) {
    return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals);
}
