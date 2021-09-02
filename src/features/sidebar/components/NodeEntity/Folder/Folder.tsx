import React, { useEffect, useState } from 'react';
import './Folder.scss';
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderProps } from './Folder.props';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { ReactSortable, Sortable } from 'react-sortablejs';
import { Link } from '../Link/Link';
import { CreateService } from '../../../../../services/CreateService';
import Dropzone from '../../Dropzone/Dropzone';
import { sortByProperty } from '../../../../../util/common-util';
import { setCanDrop, setContextMenu } from '../../../store';
import { useDispatch } from 'react-redux';
import { BOOKMARKS_BAR_ID, OTHER_BOOKMARKS_ID } from '../../../constants/app-constants';



const Folder = (props: FolderProps) => {
  const dispatch = useDispatch();
  const [editable, setEditable] = useState(false);
  const [expanded, setExpanded] = useState(false);

  let isRootFolder = (props.treeNode.id === BOOKMARKS_BAR_ID || props.treeNode.id === OTHER_BOOKMARKS_ID);

  let contentRef!: HTMLElement;

  const addChildLink = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = event.dataTransfer.getData('URL');
    if (url) {
      chrome.bookmarks.create({
        url: url,
        title: url,
        parentId: props.treeNode.id,
        index: 0
      }, (node) => { props.forceUpdateCallback(node) });
    }
    event.dataTransfer.clearData();
  }

  const editText = () => {
    setEditable(true);
    contentRef.focus();
    const range = document.createRange();
    range.selectNodeContents(contentRef);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  const deleteFolder = () => { chrome.bookmarks.removeTree(props.treeNode.id, () => { props.forceUpdateCallback() }); };

  const handleBlur = () => {
    if (editable) {
      chrome.bookmarks.update(props.treeNode.id, { title: contentRef.innerText });
    }
    setEditable(false);
  }

  const sortFolderByTitle = () => {
    if (props.treeNode.children) {
      sortByProperty<chrome.bookmarks.BookmarkTreeNode>(props.treeNode.children, 'title', false).forEach((child) => {
        chrome.bookmarks.move(child.id, { parentId: child.parentId, index: 0 });
      });
    }
    props.forceUpdateCallback();
  }

  const sortFolderByUrl = () => {
    props.treeNode.children?.sort((a, b) => {
      const titleA = a.url?.toLowerCase();
      const titleB = b.url?.toLowerCase();
      if (titleA && titleB) {
        if (titleA > titleB) {
          return -1;
        } else if (titleA < titleB) {
          return 1;
        }
        return 0;
      }
      return titleA ? -1 : titleB ? 1 : 0;
    });
    props.treeNode.children?.forEach((child) => {
      chrome.bookmarks.move(child.id, { parentId: child.parentId, index: 0 });
    });
    props.forceUpdateCallback();
  }

  const showCreateModal = () => {
    CreateService.parentId = props.treeNode.id;
    props.setModalOpen(true);
  }

  const contextMenu = [
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={showCreateModal}>Create New ...</button>,
    <button className={`btn ${isRootFolder ? 'btn-outline-secondary' : 'btn-outline-primary'} p-0 border-0 rounded-0  text-left w-100`}
      disabled={isRootFolder} onClick={editText}>Rename</button>,
    <button className={`btn ${isRootFolder ? 'btn-outline-secondary' : 'btn-outline-primary'} p-0 border-0 rounded-0  text-left w-100`}
      disabled={isRootFolder} onClick={deleteFolder}>Delete</button>,
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={sortFolderByTitle}>Sort by Title</button>,
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={sortFolderByUrl}>Sort by Url</button>
  ];

  const handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(setContextMenu({ open: true, y: contentRef.getBoundingClientRect().top + contentRef.scrollHeight, menuOptions: contextMenu }));
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

  const moveLink = (event: Sortable.SortableEvent) => {
    let id = event.item.getAttribute('data-nodeId');
    let prevParentId = event.from.id;
    let parentId = event.to.id;
    let oldIndex = event.oldIndex;
    let newIndex = event.newIndex;
    if (oldIndex !== undefined && newIndex !== undefined && prevParentId && parentId && prevParentId === parentId) {
      newIndex = newIndex <= oldIndex ? newIndex : newIndex + 1;
    }
    if (id && parentId) {
      chrome.bookmarks.move(id, { parentId: parentId, index: newIndex });
    }
    dispatch(setCanDrop(true));
  }
  //recursively will generate levels of the tree, the base case being when the child is a LINK and thus has no children of its own.
  const generateChildren = () => {
    if (props.treeNode.children && props.treeNode.children.length) {
      return (<ReactSortable
        key={props.treeNode.id}
        animation={150}
        list={props.treeNode.children}
        setList={(newState) => {
          props.updateTree(newState, props.index);
        }}
        group="links"
        dragClass="drag"
        id={props.treeNode.id}
        onStart={() => { dispatch(setCanDrop(false)); }}
        onEnd={(evt) => { moveLink(evt); }}
      // multiDrag={true}
      // selectedClass="chosen"
      >
        {props.treeNode.children.map((item, i) => {
          if (item.children) {
            return <Folder
              forceUpdateCallback={props.forceUpdateCallback}
              setModalOpen={props.setModalOpen}
              addHistory={props.addHistory}
              removeHistory={props.removeHistory}
              index={[...props.index, i]}
              key={item.id}
              updateTree={props.updateTree}
              treeNode={item} />
          } else {
            return <Link
              forceUpdateCallback={props.forceUpdateCallback}
              addHistory={props.addHistory}
              removeHistory={props.removeHistory}
              key={item.id}
              isBookmark={true}
              treeNode={item} />
          }
        })}
      </ReactSortable>);
    }
    return (
      <div className="p-2">
        <ReactSortable
          key={props.treeNode.id}
          animation={150}
          list={[]}
          setList={(newState) => {
            props.updateTree(newState, props.index);
          }}
          group="links"
          dragClass="drag"
          id={props.treeNode.id}
          onStart={() => { dispatch(setCanDrop(false)); }}
          onEnd={(evt) => { moveLink(evt); }}
        // multiDrag={true}
        // selectedClass="chosen"
        >
        </ReactSortable>
        <Dropzone onDropCallback={addChildLink} />
        <div className="text-center">- Empty -</div>
      </div>
    );
  }

  return (
    <Accordion
      data-nodeId={props.treeNode.id}
      onContextMenu={handleContextMenu}
      key={props.treeNode.id}>
      <div className="bookmark-link-container">
        <div className="p-0 bg-light">
          <Accordion.Toggle onClick={() => setExpanded(!expanded)} className="w-100 rounded-0 bg-dark text-white" as={Button} variant="link" eventKey="0">
            <Dropzone onDropCallback={addLink} disabled={isRootFolder} ></Dropzone>
            <div className="p-2 w-100 d-flex align-items-center" >
              <FontAwesomeIcon className="mr-3" icon={expanded ? faFolderOpen : faFolder}></FontAwesomeIcon>
              <div
                ref={(ref) => { if (ref) contentRef = ref; }} contentEditable={editable}
                tabIndex={0}
                onKeyPress={(event) => { if (event.key === "Enter") { contentRef.blur(); } }}
                onBlur={handleBlur}
              >{props.treeNode.title}
              </div>
            </div>
          </Accordion.Toggle>
        </div>
        <Accordion.Collapse eventKey="0">
          <div className="pl-1">
            {generateChildren()}
          </div>
        </Accordion.Collapse>
      </div>
    </Accordion>
  );

  //React Sortable multi-nested sorts not yet supported :(

  // multiSwap(event: any, index = 0) {
  //   let prevParentId = event.from.id;
  //   let parentId = event.to.id;
  //   let oldIndex = event.oldIndex;
  //   let newIndex = event.newIndex;
  //   let id = event.items[index].getAttribute('data-nodeId');
  //   if (oldIndex !== undefined && newIndex !== undefined && prevParentId && parentId) {
  //     if(prevParentId === parentId){
  //       newIndex = newIndex > oldIndex ? newIndex + event.items.length : newIndex + index;
  //     } 
  //   } 
  //   if (id && parentId) {
  //     chrome.bookmarks.move(id, { parentId: parentId, index: newIndex }, () => {
  //       if (index + 1 < event.items.length) {
  //         multiSwap(event, index + 1);
  //       } else {
  //         props.setCanDrop(true);
  //       }
  //     });
  //   }
  // }

}
export default Folder;
