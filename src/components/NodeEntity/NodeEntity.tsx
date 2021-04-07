import React from "react";
import { Sortable } from "react-sortablejs";
import { NodeEntityProps } from "./NodeEntity.props";
import { NodeEntityState } from "./NodeEntity.state";

export class NodeEntity<P extends NodeEntityProps,S extends NodeEntityState> extends React.Component<P,S> {

    protected addLink = (event : React.DragEvent) =>{
        event.preventDefault();
        event.stopPropagation();
        const url = event.dataTransfer.getData('URL');
        if (url) {
          chrome.bookmarks.create({
            url: url,
            title: url,
            parentId: this.props.treeNode.parentId,
            index: this.props.treeNode.index
          }, (node) => { this.props.forceUpdateCallback(node) });
        }
        event.dataTransfer.clearData();
      }
    
}
export default NodeEntity;