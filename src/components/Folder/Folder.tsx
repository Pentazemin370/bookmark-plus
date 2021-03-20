import React from 'react';
import './Folder.scss';
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faTrash, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderProps } from './Folder.props';
import { FolderState } from './Folder.state';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ReactSortable, Sortable } from 'react-sortablejs';

class Folder extends React.Component<FolderProps, FolderState> {

  constructor(props: FolderProps) {
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
    return (
      <>
        { this.createFolder()}
      </>
    );
  }

  createFolder() {
    if (this.props.treeNode.children)
      return (
        <Accordion data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id} >
          <Card>
            <Card.Header className="p-0 bg-light">
              {this.createHeader(true)}
            </Card.Header>
            <Accordion.Collapse eventKey="0">
              <Card.Body >
                {this.generateSubfolders()}
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      );
    return [ 
      <Card data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
        <div 
      onDragOver={(evt)=>{evt.preventDefault();}}
      onDragEnter={(evt) => { evt.preventDefault(); evt.stopPropagation(); this.setState({ refresh: true })}}
      onDrop={(ev)=>{
        ev.preventDefault();
        this.addLink(ev,this.props.treeNode.parentId,this.props.treeNode.index); this.setState({ refresh: false });}}
      onDragLeave={(evt) => {
      evt.stopPropagation();
      this.setState({ refresh: false });}}
      className={`placeholder ${this.state.refresh ? 'active' :''}`}
      ></div>
        <Card.Header className="p-0 bg-light">
          {this.createHeader(false)}
        </Card.Header>
      </Card>
    ]; 
  }

  createHeader(isFolder: boolean) {

    if (isFolder) {
      return (
        <Accordion.Toggle onClick={() => { this.setState({ expanded: !this.state.expanded }) }} className="w-100 bg-dark text-white" as={Button} variant="link" eventKey="0">
          <div className="p-3 w-100 d-flex align-items-center" >
            <FontAwesomeIcon className="mr-3" icon={this.state.expanded ? faFolderOpen : faFolder}></FontAwesomeIcon>
            {this.props.treeNode.title} {this.props.treeNode.id}
          </div>
        </Accordion.Toggle>
      );
    }
    return (
      <div className="p-3 w-100 d-flex bg-white align-items-center justify-content-between">
        <a href="#" onClick={() => { this.followLink(); }}>
          {this.props.treeNode.title} {this.props.treeNode.id}
        </a>
        <div className="px-2 icon-button-container">
          <FontAwesomeIcon className="text-secondary" icon={faTrash}></FontAwesomeIcon>
        </div>
      </div>
    );
  }

  followLink() {
    if (this.props.treeNode.url) {
      window.top.location.href = this.props.treeNode.url;
    }
  }

  moveLink(event: Sortable.SortableEvent) {
    let id = event.item.getAttribute('data-nodeId');
    let prevParentId = event.from.id;
    let parentId = event.to.id;
    let oldIndex = event.oldIndex;
    let newIndex = event.newIndex;
    if (oldIndex !== undefined && newIndex !== undefined && prevParentId && parentId && prevParentId === parentId) {
      newIndex = newIndex <= oldIndex ? newIndex : newIndex + 1;
      console.log('same origin');
    }
    if (id && parentId) {
      console.log('triggered a move', id, parentId, newIndex);
      chrome.bookmarks.move(id, { parentId: parentId, index: newIndex });
    }
  }

  addLink(event : React.DragEvent,_parentId : string | undefined, _index : number | undefined) {
    console.log(event);
    const url = event.dataTransfer.getData('URL');
    if(url){
      chrome.bookmarks.create({
        url:url,
        title:url,
        parentId:_parentId,
        index:_index
      },(node)=>{this.props.forceUpdateCallback(node)});
    }
  }
  generateSubfolders(): JSX.Element {
    if (this.props.treeNode.children) {
      return (<ReactSortable
        key={this.props.treeNode.id}
        animation={150}
        list={this.props.treeNode.children}
        setList={(newState) => {
          this.props.updateTree(newState, this.props.index);
        }}
        group="links"
        id={this.props.treeNode.id}
        onEnd={(evt) => { this.moveLink(evt); }}
      >
        {this.props.treeNode.children && this.props.treeNode.children.map((item, i) => <Folder forceUpdateCallback={this.props.forceUpdateCallback} updateTree={this.props.updateTree} index={[...this.props.index, i]} key={item.id} treeNode={item}></Folder>)}
      </ReactSortable>);
    }
    return <div>null</div>;
  }

}
export default Folder;
