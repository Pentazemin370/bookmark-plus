import React from 'react';
import './Folder.scss';
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FolderProps } from './Folder.props';
import { FolderState } from './Folder.state';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { ReactSortable, Sortable } from 'react-sortablejs';
import { Link } from '../Link/Link';
import Dropzone from '../Dropzone/Dropzone';
import NodeEntity from '../NodeEntity/NodeEntity';

class Folder extends NodeEntity<FolderProps, FolderState> {

  constructor(props: FolderProps) {
    super(props);
    this.state = {
      expanded: false,
      list: this.props.treeNode.children
    }
  }

  render() {
    return (
      <Accordion data-nodeId={this.props.treeNode.id} key={this.props.treeNode.id}>
        <Card className="bookmark-link-container">
          <Dropzone onDropCallback={this.addLink} canDrop={!this.props.canDrop} ></Dropzone>
          <Card.Header className="p-0 bg-light">
            <Accordion.Toggle onClick={() => { this.setState({ expanded: !this.state.expanded }) }} className="w-100 bg-dark text-white" as={Button} variant="link" eventKey="0">
              <div className="p-3 w-100 d-flex align-items-center" >
                <FontAwesomeIcon className="mr-3" icon={this.state.expanded ? faFolderOpen : faFolder}></FontAwesomeIcon>
                {this.props.treeNode.title} {this.props.treeNode.id}
              </div>
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body className="pl-1">
              {this.generateChildren()}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
  }

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
    if (this.props.treeNode.children) {
      return (<ReactSortable
        key={this.props.treeNode.id}
        animation={150}
        list={this.props.treeNode.children}
        setList={(newState) => {
          this.props.updateTree(newState, this.props.index);
        }}
        group="links"
        chosenClass="chosen"
        dragClass="drag"
        id={this.props.treeNode.id}
        onStart={() => { this.props.setCanDrop(false); }}
        onEnd={(evt) => { this.moveLink(evt); }}
      >
        {this.props.treeNode.children.map((item, i) => {
          if (item.children) {
            return <Folder
              forceUpdateCallback={this.props.forceUpdateCallback}
              setCanDrop={this.props.setCanDrop}
              setContextMenu={this.props.setContextMenu}
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
              key={item.id}
              canDrop={this.props.canDrop}
              treeNode={item}>
            </Link>
          }
        })}
      </ReactSortable>);
    }
    return <div></div>;
  }

}
export default Folder;
