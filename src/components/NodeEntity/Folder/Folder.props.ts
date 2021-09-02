import { NodeEntityProps } from "../NodeEntity.props";

export interface FolderProps extends NodeEntityProps {
    updateTree: (...args: any) => void;
    setCanDrop: (value: boolean) => void;
    setModalOpen: (value: boolean) => void;
    treeNode: chrome.bookmarks.BookmarkTreeNode;
    index: number[];
}