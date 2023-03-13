
export function monthFormatted(month) {
    return month + 1 < 10 ? '0' + (month + 1) : month + 1;
}

export function dayFormatted(day) {
    return day < 10 ? '0' + day : day;
}
export function padFormatted(value) {
    return value.toString().padStart(2, '0');

}
