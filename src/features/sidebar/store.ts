import { createSlice, createStore } from "@reduxjs/toolkit";

//Proposal: unify and lift state management to app level using Redux; 
export interface BookmarkTreeState {
    bookmarkBar: chrome.bookmarks.BookmarkTreeNode[] | undefined;
    otherBookmarks: chrome.bookmarks.BookmarkTreeNode[] | undefined;
}

export interface AppState {
    canDrop: boolean;
    contextMenu: { open: boolean, y?: number, menuOptions?: JSX.Element[] };
}

const appInitialState = {
    canDrop: true,
    contextMenu: { open: false }
}

export const appSlice = createSlice({
    name: "app",
    initialState: appInitialState,
    reducers: {
        setCanDrop: (state, action) => { state.canDrop = action.payload; },
        setContextMenu: (state, action) => { Object.assign(state.contextMenu, action.payload); }
    }
})

export const store = createStore(appSlice.reducer);
export type RootState = ReturnType<typeof store.getState>;
export const { setCanDrop, setContextMenu } = appSlice.actions;
export default store;