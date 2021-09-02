import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setContextMenu } from "../../../store";
import Dropzone from "../../Dropzone/Dropzone";
import { LinkProps } from "./Link.props";
import './Link.scss';

export const Link = (props: LinkProps) => {

    let anchorRef!: HTMLElement;

    const dispatch = useDispatch();
    const [editable, setEditable] = useState(false);

    const editText = () => {
        setEditable(true);
        anchorRef.focus();
        const range = document.createRange();
        range.selectNodeContents(anchorRef);
        const sel = window.getSelection();
        if (sel) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }

    const deleteLink = () => {
        chrome.bookmarks.remove(props.treeNode.id, () => {
            if (props.removeHistory && props.treeNode.url) {
                props.removeHistory(props.treeNode.url);
            }
            props.forceUpdateCallback();
        });
    };

    const followLink = () => {
        if (props.treeNode.url && !editable) {
            window.top.location.href = props.treeNode.url;
        }
    }

    const addLink = (event: React.DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const url = event.dataTransfer.getData('URL');
        const treeNode = props.treeNode as chrome.bookmarks.BookmarkTreeNode;
        if (url && treeNode.parentId && treeNode.index != null) {
            chrome.bookmarks.create({
                url: url,
                title: url,
                parentId: treeNode.parentId,
                index: treeNode.index
            }, (node) => { props.forceUpdateCallback(node) });
        }
        event.dataTransfer.clearData();
    }

    const linkContextMenu = [
        <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={editText}>Edit</button>,
        <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={deleteLink}>Delete</button>
    ];

    const handleBlur = () => {
        if (editable) {
            chrome.bookmarks.update(props.treeNode.id, { title: anchorRef.innerText });
        }
        setEditable(false);
    }

    const handleContextMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setContextMenu({ open: true, y: anchorRef.getBoundingClientRect().top + anchorRef.scrollHeight, menuOptions: linkContextMenu }));
    }

    useEffect(() => {
        if (props.treeNode.url && props.addHistory) {
            props.addHistory(props.treeNode.url);
        }
    }, []);



    return <button
        onClick={() => followLink()}
        onContextMenu={handleContextMenu}
        className="w-100 btn btn-light rounded-0 border-0" data-nodeId={props.treeNode.id} key={props.treeNode.id}>
        <Dropzone onDropCallback={addLink} />
        <div className="p-2 d-flex align-items-center" >
            <span className="pr-2 icon-button-container" >
                <img src={`https://www.google.com/s2/favicons?domain=${props.treeNode.url}`} />
            </span>
            <span ref={(ref) => { if (ref) anchorRef = ref; }} contentEditable={editable}
                tabIndex={0}
                onKeyPress={(event) => { if (event.key === "Enter") { anchorRef.blur(); } }}
                onBlur={handleBlur}
                className="bookmark-link text-left w-100">
                {props.treeNode.title}
            </span>
        </div>
    </button>
}

export default Link;