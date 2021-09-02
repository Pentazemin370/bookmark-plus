export interface NodeEntityProps {
    treeNode: chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem;
    canDrop: boolean;
    forceUpdateCallback: (...args: any) => void;
    setContextMenu?: (menuOpen: boolean, y?: number, menuOptions?: JSX.Element[]) => void;
    addHistory?: (url: string) => void;
    removeHistory?: (url: string) => void;
}