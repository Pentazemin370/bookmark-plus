export interface NodeEntityProps {
    treeNode : chrome.bookmarks.BookmarkTreeNode;
    canDrop : boolean;
    forceUpdateCallback : (...args : any) => void;
    setContextMenu : (menuOpen : boolean, y? : number, menuOptions?: JSX.Element[]) => void;

}