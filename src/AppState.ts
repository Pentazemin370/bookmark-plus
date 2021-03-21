

export interface AppState {
  bookmarkBarNode? : chrome.bookmarks.BookmarkTreeNode[];
  otherBookmarksNode? : chrome.bookmarks.BookmarkTreeNode[];
  internalDrag : boolean;
}