export class HistoryService {
    private constructor() {
        console.log('i was born!');
    }
    private static _history: Set<string> = new Set();
    public static addHistory(key: string) {
        HistoryService._history.add(key);
    }
    public static get history() {
        return HistoryService._history;
    }
    public static set history(_history: Set<string>) {
        HistoryService._history = _history;
    }
}