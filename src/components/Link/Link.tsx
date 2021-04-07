import React from "react";
import Dropzone from "../Dropzone/Dropzone";
import NodeEntity from "../NodeEntity/NodeEntity";
import { LinkProps } from "./Link.props";
import { LinkState } from "./Link.state";
import './Link.scss';

export class Link extends NodeEntity<LinkProps, LinkState> {

    constructor(props: LinkProps) {
        super(props);
        this.state = {
            list: this.props.treeNode.children,
            editable: false
        }
    }

    anchorRef!: HTMLAnchorElement;

    editText = () => {
        this.setState({ editable: true });
        this.anchorRef.focus();
        const range = document.createRange();
        range.selectNodeContents(this.anchorRef);
        const sel = window.getSelection();
        if(sel){
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    deleteLink = () => { chrome.bookmarks.remove(this.props.treeNode.id, () => { this.props.forceUpdateCallback() }); };

    followLink() {
        if (this.props.treeNode.url && !this.state.editable) {
            window.top.location.href = this.props.treeNode.url;
        }
    }

    linkContextMenu = [
        <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={this.editText}>Edit</button>,
        <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={this.deleteLink}>Delete</button>
    ];

    handleBlur = () => {
        if(this.state.editable){
            chrome.bookmarks.update(this.props.treeNode.id,{title:this.anchorRef.innerText});
        }
        this.setState({ editable: false });
    }

    render() {
        return <div
            onContextMenu={(e) => { e.stopPropagation(); this.props.setContextMenu(true,this.anchorRef.getBoundingClientRect().top+this.anchorRef.scrollHeight, this.linkContextMenu); }}
            className="bookmark-link-container" data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
            <Dropzone onDropCallback={this.addLink} canDrop={this.props.canDrop}></Dropzone>

            <div className="p-2 w-100 d-flex align-items-center" >
                <div className="px-2 icon-button-container" >
                    <img src={`chrome://favicon/${this.props.treeNode.url}`} />
                </div>
                <a ref={(ref) => { if (ref) this.anchorRef = ref; }} contentEditable={this.state.editable}
                    tabIndex={0}
                    onKeyPress={(event) => { if (event.key === "Enter") { this.anchorRef.blur();} }}
                    onBlur={this.handleBlur}
                    className="bookmark-link" onClick={() => this.followLink()}>
                    {this.props.treeNode.title}
                </a>
            </div>
        </div>
    }

}
export default Link;