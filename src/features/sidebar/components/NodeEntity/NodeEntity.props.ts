export interface NodeEntityProps {
    treeNode: chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem;
    forceUpdateCallback: (...args: any) => void;
    addHistory?: (url: string) => void;
    removeHistory?: (url: string) => void;
}