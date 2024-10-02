export function formatDate(date: Date, format: string): string {
    const formatMap: { [key: string]: string } = {
        'yyyy': date.getFullYear().toString(),
        'yy': date.getFullYear().toString().slice(-2),
        'mm': (date.getMonth() + 1).toString().padStart(2, '0'),
        'm': (date.getMonth() + 1).toString(),
        'dd': date.getDate().toString().padStart(2, '0'),
        'd': date.getDate().toString(),
        'hh': date.getHours().toString().padStart(2, '0'),
        'h': date.getHours().toString(),
        'ii': date.getMinutes().toString().padStart(2, '0'),
        'i': date.getMinutes().toString(),
        'ss': date.getSeconds().toString().padStart(2, '0'),
        's': date.getSeconds().toString(),
        'www': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
    };

    return format.replace(/[ymdhistw]+/gi, (match) => {
        const key = match.toLowerCase();
        return formatMap[key] || match;
    });
}
