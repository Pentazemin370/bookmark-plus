import React, { createRef } from 'react';
import './Folder.scss';
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderProps } from './Folder.props';
import { FolderState } from './Folder.state';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { ReactSortable, Sortable } from 'react-sortablejs';
import { Link } from '../Link/Link';
import NodeEntity from '../NodeEntity';
import { CreateService } from '../../../services/CreateService';
import Dropzone from '../../Dropzone/Dropzone';



class Folder extends NodeEntity<FolderProps, FolderState> {

  constructor(props: FolderProps) {
    super(props);
    this.state = {
      expanded: false,
      editable: false
    }
  }

  isRootFolder = this.props.treeNode.id === "1" || this.props.treeNode.id === "2";

  contentRef!: HTMLElement;

  addChildLink = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const url = event.dataTransfer.getData('URL');
    if (url) {
      chrome.bookmarks.create({
        url: url,
        title: url,
        parentId: this.props.treeNode.id,
        index: 0
      }, (node) => { this.props.forceUpdateCallback(node) });
    }
    event.dataTransfer.clearData();
  }

  editText = () => {
    this.setState({ editable: true });
    this.contentRef.focus();
    const range = document.createRange();
    range.selectNodeContents(this.contentRef);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  deleteFolder = () => { chrome.bookmarks.removeTree(this.props.treeNode.id, () => { this.props.forceUpdateCallback() }); };

  handleBlur = () => {
    if (this.state.editable) {
      chrome.bookmarks.update(this.props.treeNode.id, { title: this.contentRef.innerText });
    }
    this.setState({ editable: false });
  }

  sortFolderByTitle = () => {
    this.props.treeNode.children?.sort((a, b) => {
      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();
      if (titleA > titleB) {
        return -1;
      } else if (titleA < titleB) {
        return 1;
      }
      return 0;
    }).forEach((child) => {
      chrome.bookmarks.move(child.id, { parentId: child.parentId, index: 0 });
    });
    this.props.forceUpdateCallback();
  }

  sortFolderByUrl = () => {
    this.props.treeNode.children?.sort((a, b) => {
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
    this.props.treeNode.children?.forEach((child) => {
      chrome.bookmarks.move(child.id, { parentId: child.parentId, index: 0 });
    });
    this.props.forceUpdateCallback();
  }

  showCreateModal = () => {
    CreateService.parentId = this.props.treeNode.id;
    this.props.setModalOpen(true);
  }

  contextMenu = [
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={this.showCreateModal}>Create New ...</button>,
    <button className={`btn ${this.isRootFolder ? 'btn-outline-secondary' : 'btn-outline-primary'} p-0 border-0 rounded-0  text-left w-100`}
      disabled={this.isRootFolder} onClick={this.editText}>Rename</button>,
    <button className={`btn ${this.isRootFolder ? 'btn-outline-secondary' : 'btn-outline-primary'} p-0 border-0 rounded-0  text-left w-100`}
      disabled={this.isRootFolder} onClick={this.deleteFolder}>Delete</button>,
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={this.sortFolderByTitle}>Sort by Title</button>,
    <button className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100" onClick={this.sortFolderByUrl}>Sort by Url</button>
  ];
  handleContextMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (this.props.setContextMenu) {
      this.props.setContextMenu(true, this.contentRef.getBoundingClientRect().top + this.contentRef.scrollHeight, this.contextMenu);
    }
  }
  render() {
    return (
      <Accordion
        data-nodeId={this.props.treeNode.id}
        onContextMenu={this.handleContextMenu}
        key={this.props.treeNode.id}>
        <div className="bookmark-link-container">
          <div className="p-0 bg-light">
            <Accordion.Toggle onClick={() => { this.setState({ expanded: !this.state.expanded }) }} className="w-100 rounded-0 bg-dark text-white" as={Button} variant="link" eventKey="0">
              <Dropzone onDropCallback={this.addLink} canDrop={!this.isRootFolder && this.props.canDrop} ></Dropzone>
              <div className="p-2 w-100 d-flex align-items-center" >
                <FontAwesomeIcon className="mr-3" icon={this.state.expanded ? faFolderOpen : faFolder}></FontAwesomeIcon>
                <div
                  ref={(ref) => { if (ref) this.contentRef = ref; }} contentEditable={this.state.editable}
                  tabIndex={0}
                  onKeyPress={(event) => { if (event.key === "Enter") { this.contentRef.blur(); } }}
                  onBlur={this.handleBlur}
                >{this.props.treeNode.title}
                </div>
              </div>
            </Accordion.Toggle>
          </div>
          <Accordion.Collapse eventKey="0">
            <div className="pl-1">
              {this.generateChildren()}
            </div>
          </Accordion.Collapse>
        </div>
      </Accordion>
    );
  }

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
  //         this.multiSwap(event, index + 1);
  //       } else {
  //         this.props.setCanDrop(true);
  //       }
  //     });
  //   }
  // }


  moveLink(event: Sortable.SortableEvent) {
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
    this.props.setCanDrop(true);
  }

  //recursively will generate levels of the tree, the base case being when the child is a LINK and thus has no children of its own.
  generateChildren(): JSX.Element {
    if (this.props.treeNode.children && this.props.treeNode.children.length) {
      return (<ReactSortable
        key={this.props.treeNode.id}
        animation={150}
        list={this.props.treeNode.children}
        setList={(newState) => {
          this.props.updateTree(newState, this.props.index);
        }}
        group="links"
        dragClass="drag"
        id={this.props.treeNode.id}
        onStart={() => { this.props.setCanDrop(false); }}
        onEnd={(evt) => { this.moveLink(evt); }}
      // multiDrag={true}
      // selectedClass="chosen"
      >
        {this.props.treeNode.children.map((item, i) => {
          if (item.children) {
            return <Folder
              forceUpdateCallback={this.props.forceUpdateCallback}
              setCanDrop={this.props.setCanDrop}
              setContextMenu={this.props.setContextMenu}
              setModalOpen={this.props.setModalOpen}
              addHistory={this.props.addHistory}
              removeHistory={this.props.removeHistory}
              updateTree={this.props.updateTree}
              index={[...this.props.index, i]}
              key={item.id}
              canDrop={this.props.canDrop}
              treeNode={item}>
            </Folder>
          } else {
            return <Link
              forceUpdateCallback={this.props.forceUpdateCallback}
              setContextMenu={this.props.setContextMenu}
              addHistory={this.props.addHistory}
              removeHistory={this.props.removeHistory}
              key={item.id}
              canDrop={this.props.canDrop}
              treeNode={item}>
            </Link>
          }
        })}
      </ReactSortable>);
    }
    return (
      <div className="p-2">
        <ReactSortable
          key={this.props.treeNode.id}
          animation={150}
          list={[]}
          setList={(newState) => {
            this.props.updateTree(newState, this.props.index);
          }}
          group="links"
          dragClass="drag"
          id={this.props.treeNode.id}
          onStart={() => { this.props.setCanDrop(false); }}
          onEnd={(evt) => { this.moveLink(evt); }}
        // multiDrag={true}
        // selectedClass="chosen"
        >
        </ReactSortable>
        <Dropzone onDropCallback={this.addChildLink} canDrop={this.props.canDrop} ></Dropzone>
        <div className="text-center">- Empty -</div>
      </div>
    );
  }

}
export default Folder;
