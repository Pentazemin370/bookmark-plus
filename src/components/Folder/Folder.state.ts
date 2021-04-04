import { NodeEntityState } from "../NodeEntity/NodeEntity.state";

export interface FolderState extends NodeEntityState {
    expanded : boolean;
    list : chrome.bookmarks.BookmarkTreeNode[] | undefined;
}