import React from "react";
import { Card } from "react-bootstrap";
import Dropzone from "../Dropzone/Dropzone";
import NodeEntity from "../NodeEntity/NodeEntity";
import { LinkProps } from "./Link.props";
import { LinkState } from "./Link.state";
import './Link.scss';

export class Link extends NodeEntity<LinkProps, LinkState> {

    constructor(props: LinkProps) {
        super(props);
        this.state = {
            list: this.props.treeNode.children
        }
    }

    deleteLink = () => { chrome.bookmarks.remove(this.props.treeNode.id,()=>{this.props.forceUpdateCallback()}); };

    linkContextMenu = [
        <div>Edit</div>,
        <div onClick={this.deleteLink}>Delete</div>
    ];
    render() {
        return <div
            onContextMenu={() => { this.props.setContextMenu(true, this.linkContextMenu); }}
            className="bookmark-link-container" data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
            <Dropzone onDropCallback={this.addLink} canDrop={this.props.canDrop}></Dropzone>
 
                <div className="p-2 w-100 d-flex bg-white align-items-center" >
                    <div className="px-2 icon-button-container" >
                        <img src={`chrome://favicon/${this.props.treeNode.url}`} />
                    </div>
                    <a contentEditable="true" className="bookmark-link" onClick={() => this.followLink()}>
                        {this.props.treeNode.title} {this.props.treeNode.id}
                    </a>
                </div>
        </div>
    }

}
export default Link;