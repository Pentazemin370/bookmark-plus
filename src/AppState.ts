

export interface AppState {
  bookmarkBarNode? : chrome.bookmarks.BookmarkTreeNode[];
  otherBookmarksNode? : chrome.bookmarks.BookmarkTreeNode[];
  canDrop : boolean;
  contextMenu :  { open : boolean, y : number, menuOptions : JSX.Element[] }
}