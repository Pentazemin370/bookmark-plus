import React, { useEffect, useState } from 'react';
import './App.scss';
import Folder from './components/NodeEntity/Folder/Folder';
import 'bootstrap/dist/js/bootstrap.min';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { SearchMenu } from './components/SearchMenu/SearchMenu';
import { Tab, Tabs } from 'react-bootstrap';
import { CreateModal } from './components/CreateModal/CreateModal';
import { History } from './components/History/History';
import { Settings } from './components/Settings/Settings';
import { AppState, RootState } from './store';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { BOOKMARKS_BAR_ID, OTHER_BOOKMARKS_ID } from './constants/app-constants';

export const App = () => {
  const [activeTab, setActiveTab] = useState('folders');
  const [showModal, setShowModal] = useState(false);
  const [historyList, setHistoryList] = useState<Set<string>>(new Set());
  const [bookmarkBarNode, setBookmarkBarNode] = useState<chrome.bookmarks.BookmarkTreeNode[]>();
  const [otherBookmarksNode, setOtherBookmarksNode] = useState<chrome.bookmarks.BookmarkTreeNode[]>();
  const [canDrop, setCanDrop] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ open: boolean, y: number, menuOptions: JSX.Element[] }>({ open: false, y: 0, menuOptions: [] });

  const setModalOpen = (showModal: boolean) => setShowModal(showModal);

  const addHistory = (url: string) => {
    const tempList = historyList;
    tempList.add(url);
    setHistoryList(tempList);
  }
  const removeHistory = (url: string) => {
    const tempList = historyList;
    tempList.delete(url);
    setHistoryList(tempList);
  }

  const setBookmarkState = () => {
    chrome.bookmarks.getSubTree(BOOKMARKS_BAR_ID, (node) => {
      setBookmarkBarNode(node);
    });
    chrome.bookmarks.getSubTree(OTHER_BOOKMARKS_ID, (node) => {
      setOtherBookmarksNode(node);
    });
  }

  useEffect(() => {
    window.addEventListener('message', (e: any) => {
      if (e.data && ['history', 'folders', 'search', 'settings'].includes(e.data)) {
        setActiveTab(e.data);
      }
    });
    setBookmarkState();
  }, []);

  const updateBookmarkBarTree = (currentList: any, indices: number[]) => {
    if (bookmarkBarNode) {
      let temp = [...bookmarkBarNode];
      const _indices = [...indices];
      const firstIndex = _indices.pop();
      if (firstIndex !== undefined) {
        const arr = _indices.reduce((a, i) => a[i].children as any, temp);
        if (arr[firstIndex]) {
          arr[firstIndex].children = currentList;
        }
        setBookmarkBarNode(temp);
      }
    }
  }

  const updateOtherBookmarksTree = (currentList: any, indices: number[]) => {
    if (otherBookmarksNode) {
      let temp = [...otherBookmarksNode];
      const _indices = [...indices];
      const firstIndex = _indices.pop();
      if (firstIndex !== undefined) {
        const arr = _indices.reduce((a, i) => a[i].children as any, temp);
        if (arr[firstIndex]) {
          arr[firstIndex].children = currentList;
        }
        setOtherBookmarksNode(temp);
      }
    }
  }
  //inform the app that a drag is happening from within the bookmark bar, so no duplicate links are created on drop
  const updateCanDrop = (value: boolean) => {
    setCanDrop(value);
  }

  const updateContextMenu = (open: boolean, y?: number, menuOptions?: JSX.Element[]) => {
    setContextMenu({ open: open, y: y ? y : 0, menuOptions: menuOptions ? menuOptions : contextMenu.menuOptions });
  };

  const folderView = () => {
    if (bookmarkBarNode && otherBookmarksNode) {
      return [
        <Folder
          index={[0]}
          forceUpdateCallback={setBookmarkState}
          updateTree={updateBookmarkBarTree}
          setCanDrop={updateCanDrop}
          setContextMenu={updateContextMenu}
          setModalOpen={setModalOpen}
          addHistory={addHistory}
          removeHistory={removeHistory}
          canDrop={canDrop}
          rootId={BOOKMARKS_BAR_ID}
          treeNode={bookmarkBarNode[0]} />
        ,
        <Folder
          index={[0]}
          forceUpdateCallback={setBookmarkState}
          updateTree={updateOtherBookmarksTree}
          setCanDrop={updateCanDrop}
          setContextMenu={updateContextMenu}
          setModalOpen={setModalOpen}
          addHistory={addHistory}
          removeHistory={removeHistory}
          canDrop={canDrop}
          rootId={OTHER_BOOKMARKS_ID}
          treeNode={otherBookmarksNode[0]} />
      ];
    }
    return null;
  }

  return (
    <div className="App">
      <CreateModal show={showModal}
        forceUpdateCallback={setBookmarkState}
        setModalOpen={setModalOpen} />
      <ContextMenu menuOpen={contextMenu.open}
        y={contextMenu.y}
        setContextMenu={updateContextMenu}>
        {contextMenu.menuOptions}
      </ContextMenu>
      <Tabs defaultActiveKey="folders" activeKey={activeTab} onSelect={(key: string) => setActiveTab(key)} id="main-tabs">
        <Tab eventKey="folders" title={'Folders'}>
          {folderView()}
        </Tab>
        <Tab eventKey="search" title={'Search'}>
          <SearchMenu
            forceUpdateCallback={setBookmarkState}
            setContextMenu={updateContextMenu} />

        </Tab>
        <Tab eventKey="history" title={'History'}>
          <History savedList={historyList} removeHistory={removeHistory} updateCallback={setBookmarkState} />
        </Tab>
        <Tab eventKey="settings" title={'Settings'}>
          <Settings />
        </Tab>
      </Tabs>
    </div>
  );

}

export default App;
