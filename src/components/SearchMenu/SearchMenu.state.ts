export interface SearchMenuState {
    value: string;
    includeHistory: boolean;
    page: number;
    resultList: (chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem)[];
}