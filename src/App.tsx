import React from 'react';
import './App.scss';
import Folder from './components/NodeEntity/Folder/Folder';
import { AppState } from './AppState';
import 'bootstrap/dist/js/bootstrap.min';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { SearchMenu } from './components/SearchMenu/SearchMenu';
import { Tab, Tabs } from 'react-bootstrap';
import { CreateModal } from './components/CreateModal/CreateModal';
import { History } from './components/History/History';

const BOOKMARKS_BAR_ID = "1";
const OTHER_BOOKMARKS_ID = "2";
class App extends React.Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      canDrop: true,
      contextMenu: { open: false, y: 0, menuOptions: [] },
      showModal: false,
      historyList: new Set()
    };
    this.setBookmarkState();
  }

  setModalOpen = (showModal: boolean) => { this.setState({ showModal: showModal }); };
  addHistory = (url: string) => {
    this.setState(
      { historyList: this.state.historyList.add(url) }
    );
  }

  removeHistory = (url: string) => {
    this.state.historyList.delete(url);
    this.setState(
      { historyList: this.state.historyList }
    );
  }

  render() {
    return (
      <div className="App">
        <CreateModal show={this.state.showModal}
          forceUpdateCallback={this.setBookmarkState}
          setModalOpen={this.setModalOpen}>
        </CreateModal>
        <ContextMenu menuOpen={this.state.contextMenu.open}
          y={this.state.contextMenu.y}
          setContextMenu={this.setContextMenu}>
          {this.state.contextMenu.menuOptions}
        </ContextMenu>
        <Tabs defaultActiveKey="folders" id="main-tabs">
          <Tab eventKey="folders" title={'Folders'}>
            {this.folderView()}
          </Tab>
          <Tab eventKey="search" title={'Search'}>
            <SearchMenu
              forceUpdateCallback={this.setBookmarkState}
              setContextMenu={this.setContextMenu}>
            </SearchMenu>
          </Tab>
          <Tab eventKey="history" title={'History'}>
            <History savedList={this.state.historyList} removeHistory={this.removeHistory} updateCallback={this.setBookmarkState} />
          </Tab>
        </Tabs>
      </div>
    );
  }

  folderView = () => {
    if (this.state.bookmarkBarNode && this.state.otherBookmarksNode) {
      return [
        <Folder
          index={[0]}
          forceUpdateCallback={this.setBookmarkState}
          updateTree={this.updateBookmarkBarTree}
          setCanDrop={this.setCanDrop}
          setContextMenu={this.setContextMenu}
          setModalOpen={this.setModalOpen}
          addHistory={this.addHistory}
          removeHistory={this.removeHistory}
          canDrop={this.state.canDrop}
          treeNode={this.state.bookmarkBarNode[0]}>
        </Folder>,
        <Folder
          index={[0]}
          forceUpdateCallback={this.setBookmarkState}
          updateTree={this.updateOtherBookmarksTree}
          setCanDrop={this.setCanDrop}
          setContextMenu={this.setContextMenu}
          setModalOpen={this.setModalOpen}
          addHistory={this.addHistory}
          removeHistory={this.removeHistory}
          canDrop={this.state.canDrop}
          treeNode={this.state.otherBookmarksNode[0]}>
        </Folder>
      ];
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
  setCanDrop = (value: boolean) => {
    this.setState({ canDrop: value });
  }

  setBookmarkState = () => {
    chrome.bookmarks.getSubTree(BOOKMARKS_BAR_ID, (node) => {
      this.setState({ bookmarkBarNode: node });
    });
    chrome.bookmarks.getSubTree(OTHER_BOOKMARKS_ID, (node) => {
      this.setState({ otherBookmarksNode: node });
    });
  }

  setContextMenu = (open: boolean, y?: number, menuOptions?: JSX.Element[]) => {
    this.setState({
      contextMenu: { open: open, y: y ? y : 0, menuOptions: menuOptions ? menuOptions : this.state.contextMenu.menuOptions }
    });
  };

}

export default App;
