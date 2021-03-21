import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card } from "react-bootstrap";
import { Dropzone } from "../Dropzone/Dropzone";
import { LinkProps } from "./Link.props";
import { LinkState } from "./Link.state";

export class Link extends React.Component<LinkProps, LinkState> {

    constructor(props: LinkProps) {
        super(props);
        this.state = {
            expanded: false,
            refresh: false,
            newNode: null,
            newIndex: null,
            list: this.props.treeNode.children
        }
    }

    render() {
        return <Card data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
            <Dropzone onDropCallback={this.addLink} canDrop={!this.props.internalDrag}></Dropzone>
            <Card.Header className="p-0 bg-light">
                <div className="p-3 w-100 d-flex bg-white align-items-center justify-content-between">
                    <a href="#" onClick={() => { this.followLink(); }}>
                        {this.props.treeNode.title} {this.props.treeNode.id}
                    </a>
                    <div className="px-2 icon-button-container">
                        <FontAwesomeIcon className="text-secondary" icon={faTrash}></FontAwesomeIcon>
                    </div>
                </div>
            </Card.Header>
        </Card>
    }

    followLink() {
        if (this.props.treeNode.url) {
            window.top.location.href = this.props.treeNode.url;
        }
    }

    addLink = (event : React.DragEvent) =>{
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