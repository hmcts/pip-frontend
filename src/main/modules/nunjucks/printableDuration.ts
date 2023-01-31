export function printableDuration(val, unit, language) {
    if (language == 'cy') {
        unit = new Map([
            ['hour', 'awr'],
            ['min', 'munud'],
        ]).get(unit);
    }
    switch (val) {
        case 0:
            return '';
        case 1:
            return `1 ${unit}`;
        default:
            if (language == 'en') {
                return `${val} ${unit}s`;
            } else {
                return `${val} ${unit}`;
            }
    }
}
