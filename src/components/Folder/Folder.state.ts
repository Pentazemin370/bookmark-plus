export interface FolderState {
    expanded : boolean;
    refresh : boolean;
    newNode : string | null;
    newIndex : number | null;
    list : chrome.bookmarks.BookmarkTreeNode[] | undefined;
}