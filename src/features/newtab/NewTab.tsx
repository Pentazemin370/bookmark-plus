import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faCogs, faEllipsisH, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Clock } from "./Clock/Clock";
import './NewTab.scss';
import { SettingsModal } from "./SettingsModal/SettingsModal";
import { AppSettingsState, AppState, getBookmarkBar, RootState, setBookmarks, setHistory, setShowModal, updateSettings } from "./store";
export function NewTab() {

    const dispatch = useDispatch();
    const { history, bookmarks, bookmarkBarNode, contentWindow } = useSelector<RootState, AppState>(state => state.appReducer, shallowEqual);
    const appSettings = useSelector<RootState, AppSettingsState>(state => state.appSettingsReducer, shallowEqual);
    let url = "https://konachan.com/sample/d146fd276bdce6530fc947b5f521a34a/Konachan.com%20-%20305283%20sample.jpg";
    const isImage = (url: string) => (url.match(/\.(jpe?g|gif|png|bmp)$/) != null);



    //component did mount
    useEffect(() => {
        chrome.storage.local.get(appSettings, (res) => {
            dispatch(updateSettings(res as AppSettingsState));
        });
        chrome.history.search({ text: '', maxResults: 20 }, (history) => {
            dispatch(setHistory(history));
        });
        chrome.bookmarks.getSubTree('1', (tree) => {
            if (tree[0] && tree[0].children) {
                dispatch(setBookmarks(tree[0].children));
            }
        });
        dispatch(getBookmarkBar(document.getElementById('bookmark-container')));
    }, []);

    let toggleMenu = (activeTab?: string) => {
        if (bookmarkBarNode) {
            bookmarkBarNode.style.left = '0px';
        }
        if (contentWindow) {
            contentWindow.postMessage(activeTab, "*");
        }
    }

    const bookmarkItems = () => {
        if (bookmarks) {
            return bookmarks.map(item => item.url ?
                <a className="dashboard-link justify-content-between text-white fg-filter d-flex flex-column p-3 rounded" href={item.url}>
                    <img className="mx-auto mb-1" src={`https://www.google.com/s2/favicons?domain=${item.url}`} />
                    <span className="trim-text">{item.title}</span>
                </a> : null);
        }
        return <div></div>;
    }

    const historyItems = () => {
        if (history) {
            return history.map(item =>
                <a className="dashboard-link justify-content-between text-white fg-filter d-flex flex-column p-3 rounded" href={item.url}>
                    <img className="mx-auto mb-1" src={`https://www.google.com/s2/favicons?domain=${item.url}`} />
                    <span className="trim-text">{item.title}</span>
                </a>);
        }
    }

    return (<main className="d-flex w-100 h-100 text-center">
        <SettingsModal></SettingsModal>
        <div className="bg-image position-absolute w-100 h-100"
            style={{ backgroundImage: `url("${appSettings.bgFile ? appSettings.bgFile : url}")` }}></div>
        <button onClick={() => dispatch(setShowModal(true))} className="border-0 right-0 m-3 bg-transparent fa-2x text-white position-absolute">
            <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
        </button>
        <section className="m-auto mt-5 d-flex flex-column justify-content-center p-5 text-white">
            {appSettings.showClock ? <Clock /> : null}
            <div className="pt-5 col-10 m-auto">
                <span className="content-row rounded d-flex align-items-stretch justify-content-between bg-transparent-black">
                    <div className="d-flex">
                        <span className="dashboard-icon d-flex">
                            <FontAwesomeIcon className="m-auto fa-2x" icon={faBookmark} ></FontAwesomeIcon>
                        </span>
                        <div className="d-flex flex-wrap">
                            {bookmarkItems()}
                        </div>
                    </div>
                    <button onClick={() => toggleMenu('folders')}
                        className="d-flex justify-content-center text-white flex-column btn bg-transparent">
                        <FontAwesomeIcon className="mx-auto fa-2x" icon={faEllipsisH}></FontAwesomeIcon>
                        <span className="mx-auto">More</span>
                    </button>
                </span>
                <span className="content-row rounded d-flex align-items-stretch justify-content-between bg-transparent-black">
                    <div className="d-flex">
                        <span className="dashboard-icon d-flex">
                            <FontAwesomeIcon className="m-auto fa-2x" icon={faHistory} ></FontAwesomeIcon>
                        </span>
                        <div className="d-flex flex-wrap">
                            {historyItems()}
                        </div>
                    </div>
                    <button onClick={() => toggleMenu('history')}
                        className="d-flex justify-content-center text-white flex-column btn bg-transparent">
                        <FontAwesomeIcon className="mx-auto fa-2x" icon={faEllipsisH}></FontAwesomeIcon>
                        <span className="mx-auto">More</span>
                    </button>
                </span>
            </div>
        </section>
    </main>);
}

