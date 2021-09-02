

export interface AppState {
  bookmarkBarNode?: chrome.bookmarks.BookmarkTreeNode[];
  otherBookmarksNode?: chrome.bookmarks.BookmarkTreeNode[];
  historyList: Set<string>
  canDrop: boolean;
  contextMenu: { open: boolean, y: number, menuOptions: JSX.Element[] }
  showModal: boolean;
}