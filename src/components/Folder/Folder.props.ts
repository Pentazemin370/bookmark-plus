export interface FolderProps {
    treeNode : chrome.bookmarks.BookmarkTreeNode;
    updateTree : (...args : any) => void;
    forceUpdateCallback : (...args : any) => void;
    index : number[];
}