

export interface AppState {
  bookmarkBarNode? : chrome.bookmarks.BookmarkTreeNode[];
  otherBookmarksNode? : chrome.bookmarks.BookmarkTreeNode[];
  canDrop : boolean;
  contextMenu :  { open : boolean, menuOptions : JSX.Element[] }
}