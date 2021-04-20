import React from "react";
import { NodeEntityProps } from "./NodeEntity.props";
import { NodeEntityState } from "./NodeEntity.state";

export class NodeEntity<P extends NodeEntityProps, S extends NodeEntityState> extends React.Component<P, S> {

  protected addLink = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = event.dataTransfer.getData('URL');
    const treeNode = this.props.treeNode as chrome.bookmarks.BookmarkTreeNode;
    if (url && treeNode.parentId && treeNode.index) {
      chrome.bookmarks.create({
        url: url,
        title: url,
        parentId: treeNode.parentId,
        index: treeNode.index
      }, (node) => { this.props.forceUpdateCallback(node) });
    }
    event.dataTransfer.clearData();
  }

}
export default NodeEntity;