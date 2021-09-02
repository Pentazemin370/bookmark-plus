import React from "react";
import Dropzone from "../../Dropzone/Dropzone";
import NodeEntity from "../NodeEntity";
import { LinkProps } from "./Link.props";
import { LinkState } from "./Link.state";
import './Link.scss';

export class Link extends NodeEntity<LinkProps, LinkState> {

    constructor(props: LinkProps) {
        super(props);
        this.state = {
            editable: false
        }
    }

    anchorRef!: HTMLElement;

    editText = () => {
        this.setState({ editable: true });
        this.anchorRef.focus();
        const range = document.createRange();
        range.selectNodeContents(this.anchorRef);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    deleteLink = () => {
        chrome.bookmarks.remove(this.props.treeNode.id, () => {
            if (this.props.removeHistory && this.props.treeNode.url) {
                this.props.removeHistory(this.props.treeNode.url);
            }
            this.props.forceUpdateCallback();
        });
    };

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
        if (this.state.editable) {
            chrome.bookmarks.update(this.props.treeNode.id, { title: this.anchorRef.innerText });
        }
        this.setState({ editable: false });
    }

    setContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (this.props.setContextMenu) {
            this.props.setContextMenu(true, this.anchorRef.getBoundingClientRect().top + this.anchorRef.scrollHeight, this.linkContextMenu);
        }
    }

    componentDidMount() {
        if (this.props.treeNode.url && this.props.addHistory) {
            this.props.addHistory(this.props.treeNode.url);
        }
    }

    render() {
        return <button
            onClick={() => this.followLink()}
            onContextMenu={this.setContextMenu}
            className="w-100 btn btn-light rounded-0 border-0" data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
            <Dropzone onDropCallback={this.addLink} canDrop={this.props.canDrop}></Dropzone>
            <div className="p-2 d-flex align-items-center" >
                <span className="pr-2 icon-button-container" >
                    <img src={`https://www.google.com/s2/favicons?domain=${this.props.treeNode.url}`} />
                </span>
                <span ref={(ref) => { if (ref) this.anchorRef = ref; }} contentEditable={this.state.editable}
                    tabIndex={0}
                    onKeyPress={(event) => { if (event.key === "Enter") { this.anchorRef.blur(); } }}
                    onBlur={this.handleBlur}
                    className="bookmark-link text-left w-100">
                    {this.props.treeNode.title}
                </span>
            </div>
        </button>
    }

}
export default Link;