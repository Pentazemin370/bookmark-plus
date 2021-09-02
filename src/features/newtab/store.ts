import { combineReducers, createStore } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
    showModal: boolean;
    history: chrome.history.HistoryItem[];
    bookmarks: chrome.bookmarks.BookmarkTreeNode[];
    bookmarkBarNode: any;
    contentWindow: any;
}
export interface ClockState {
    date: Date;
}

export interface AppSettingsState {
    enableOverride: boolean;
    hour12: boolean;
    displayTime: boolean;
    displaySeconds: boolean;
    displayDate: boolean;
    showClock: boolean;
    bgFile: string | ArrayBuffer;
}

export const initialAppSettings: AppSettingsState =
{
    enableOverride: true,
    hour12: true,
    displayTime: true,
    displaySeconds: true,
    displayDate: true,
    showClock: true,
    bgFile: ''
}

export const initialState = {
    enableOverride: true,
    bgImage: null,
    showClock: true,
    showModal: false,
    history: [],
    bookmarks: [],
    bookmarkBarNode: null,
    contentWindow: null
} as AppState;

export const clockInitialState = {
    date: new Date()
} as ClockState;

export const clockSlice = createSlice({
    name: "clock",
    initialState: clockInitialState,
    reducers: {
        refreshDate: (state) => {
            state.date.setSeconds(state.date.getSeconds() + 1);
        }
    }
});

export const appSettingsSlice = createSlice({
    name: 'appSettings',
    initialState: initialAppSettings,
    reducers: {
        updateSettings: (state, action: PayloadAction<AppSettingsState>) => {
            Object.assign(state, action.payload);
        }
    }
});

export const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setShowModal: (state, action) => {
            state.showModal = action.payload;
        },
        setBookmarks: (state, action) => {
            state.bookmarks = action.payload;
        },
        setHistory: (state, action) => {
            state.history = action.payload;
        },
        getBookmarkBar: (state, action) => {
            if (action.payload) {
                state.bookmarkBarNode = action.payload;
                state.contentWindow = state.bookmarkBarNode.shadowRoot?.querySelector('iframe')?.contentWindow;
            }
        }
    }
});

export const reducers = combineReducers({ clockReducer: clockSlice.reducer, appReducer: appSlice.reducer, appSettingsReducer: appSettingsSlice.reducer });
export const store = createStore(reducers);
export const { setShowModal, setBookmarks, setHistory, getBookmarkBar } = appSlice.actions;
export const { refreshDate } = clockSlice.actions;
export const { updateSettings } = appSettingsSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export default store;