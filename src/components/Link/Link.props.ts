export interface LinkProps {
    treeNode : chrome.bookmarks.BookmarkTreeNode;
    internalDrag : boolean;
    updateTree : (...args : any) => void;
    forceUpdateCallback : (...args : any) => void;
    index : number[];
}