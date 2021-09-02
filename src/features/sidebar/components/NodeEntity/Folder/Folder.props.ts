import { NodeEntityProps } from "../NodeEntity.props";

export interface FolderProps extends NodeEntityProps {
    updateTree: (...args: any) => void;
    setModalOpen: (value: boolean) => void;
    treeNode: chrome.bookmarks.BookmarkTreeNode;
    index: number[];
}