export function sortByProperty<T>(ref: any[], property?: string, ascending = true): T[] {
    const mod = ascending ? 1 : -1;
    return ref.sort((a, b) => {
        let s = a;
        let t = b;
        if (property && a[property] && b[property]) {
            s = a[property]
            t = b[property]
            if (s instanceof String || typeof s === 'string') {
                s = s.toLowerCase();
            }
            if (t instanceof String || typeof t === 'string') {
                t = t.toLowerCase();
            }
        }

        if (s && t) {
            return (s > t ? 1 : s < t ? -1 : 0) * mod;
        }
        return (s ? 1 : t ? -1 : 0) * mod;
    }) as T[];
}


