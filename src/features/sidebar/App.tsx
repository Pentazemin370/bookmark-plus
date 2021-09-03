import React, { useEffect, useReducer, useState } from 'react';
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

// export const OtherBookmarksDispatch = React.createContext(null);
// const reducer = (state, action) => {
//   if (action.currentList && action.indices) {
//     if (state) {
//       let temp = [...state];
//       const _indices = [...action.indices];
//       const firstIndex = _indices.pop();
//       if (firstIndex !== undefined) {
//         const arr = _indices.reduce((a, i) => a[i].children as any, temp);
//         if (arr[firstIndex]) {
//           arr[firstIndex].children = action.currentList;
//         }
//         return temp;
//       }
//     } else {
//       return action;
//     }
//   }
// }

export const App = () => {
  const [activeTab, setActiveTab] = useState('folders');
  const [showModal, setShowModal] = useState(false);
  const [historyList, setHistoryList] = useState<Set<string>>(new Set());
  const [bookmarkBarNode, setBookmarkBarNode] = useState<chrome.bookmarks.BookmarkTreeNode[]>();
  const [otherBookmarksNode, setOtherBookmarksNode] = useState<chrome.bookmarks.BookmarkTreeNode[]>();
  const setModalOpen = (showModal: boolean) => setShowModal(showModal);

  const { contextMenu } = useSelector<RootState, AppState>(state => state, shallowEqual);

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
    console.log('i actually run more than once');
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

  const folderView = () => {
    if (bookmarkBarNode && otherBookmarksNode) {
      return [
        <Folder
          index={[0]}
          forceUpdateCallback={setBookmarkState}
          updateTree={updateBookmarkBarTree}
          setModalOpen={setModalOpen}
          addHistory={addHistory}
          removeHistory={removeHistory}
          treeNode={bookmarkBarNode[0]} />
        ,
        <Folder
          index={[0]}
          forceUpdateCallback={setBookmarkState}
          updateTree={updateOtherBookmarksTree}
          setModalOpen={setModalOpen}
          addHistory={addHistory}
          removeHistory={removeHistory}
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
        y={contextMenu.y}>
        {contextMenu.menuOptions}
      </ContextMenu>
      <Tabs defaultActiveKey="folders" activeKey={activeTab} onSelect={(key: string) => setActiveTab(key)} id="main-tabs">
        <Tab eventKey="folders" title={'Folders'}>
          {folderView()}
        </Tab>
        <Tab eventKey="search" title={'Search'}>
          <SearchMenu forceUpdateCallback={setBookmarkState} />
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
