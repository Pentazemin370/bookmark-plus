import React from 'react';
import './App.scss';
import Folder from './components/Folder/Folder';
import { AppState } from './AppState';
import 'bootstrap/dist/js/bootstrap.min';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { SearchMenu } from './components/SearchMenu/SearchMenu';

const BOOKMARKS_BAR_ID = "1";
const OTHER_BOOKMARKS_ID = "2";
class App extends React.Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      canDrop: false,
      contextMenu: { open: false, menuOptions: [] }
    };
    this.setBookmarkState();
    this.rerenderParentCallback = this.rerenderParentCallback.bind(this);
    this.setCanDrop = this.setCanDrop.bind(this);
  }

  rerenderParentCallback() {
    this.setBookmarkState();
  }

  render() {
    if (this.state.bookmarkBarNode && this.state.otherBookmarksNode) {
      return (
        <div className="App">
          <ContextMenu menuOpen={this.state.contextMenu.open}
            setContextMenu={this.setContextMenu}>
            {this.state.contextMenu.menuOptions}
          </ContextMenu>
          <Folder
            index={[0]}
            forceUpdateCallback={this.rerenderParentCallback}
            updateTree={this.updateBookmarkBarTree}
            setCanDrop={this.setCanDrop}
            setContextMenu={this.setContextMenu}
            canDrop={this.state.canDrop}
            treeNode={this.state.bookmarkBarNode[0]}>
          </Folder>
          <Folder
            index={[0]}
            forceUpdateCallback={this.rerenderParentCallback}
            updateTree={this.updateOtherBookmarksTree}
            setCanDrop={this.setCanDrop}
            setContextMenu={this.setContextMenu}
            canDrop={this.state.canDrop}
            treeNode={this.state.otherBookmarksNode[0]}>
          </Folder>
          <SearchMenu
            forceUpdateCallback={this.rerenderParentCallback}
            setContextMenu={this.setContextMenu}
            canDrop={true}>
          </SearchMenu>
        </div>
      );
    }
    return null;
  }

  updateBookmarkBarTree = (currentList: any, indices: number[]) => {
    if (this.state.bookmarkBarNode) {
      let temp = [...this.state.bookmarkBarNode];
      const _indices = [...indices];
      const firstIndex = _indices.pop();
      if (firstIndex !== undefined) {
        const arr = _indices.reduce((a, i) => a[i].children as any, temp);
        if (arr[firstIndex]) {
          arr[firstIndex].children = currentList;
        }
        this.setState({ bookmarkBarNode: temp });
      }
    }
  }

  updateOtherBookmarksTree = (currentList: any, indices: number[]) => {
    if (this.state.otherBookmarksNode) {
      let temp = [...this.state.otherBookmarksNode];
      const _indices = [...indices];
      const firstIndex = _indices.pop();
      if (firstIndex !== undefined) {
        const arr = _indices.reduce((a, i) => a[i].children as any, temp);
        if (arr[firstIndex]) {
          arr[firstIndex].children = currentList;
        }
        this.setState({ otherBookmarksNode: temp });
      }
    }
  }
  //inform the app that a drag is happening from within the bookmark bar, so no duplicate links are created on drop
  setCanDrop(value: boolean) {
    this.setState({ canDrop: value });
  }

  setBookmarkState() {
    chrome.bookmarks.getSubTree(BOOKMARKS_BAR_ID, (node) => {
      this.setState({ bookmarkBarNode: node });
    });
    chrome.bookmarks.getSubTree(OTHER_BOOKMARKS_ID, (node) => {
      this.setState({ otherBookmarksNode: node });
    });
  }

  setContextMenu = (open: boolean, menuOptions?: JSX.Element[]) => {
    this.setState({
      contextMenu: { open: open, menuOptions: menuOptions ? menuOptions : this.state.contextMenu.menuOptions }
    });
  };

}

export default App;
