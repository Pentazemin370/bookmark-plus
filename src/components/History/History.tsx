import { faStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import React, { useEffect, useState } from "react";
import { Link } from "../NodeEntity/Link/Link";

export function History(props: { savedList: Set<string>, removeHistory: (url: string) => void, updateCallback: () => void }) {

    const [historyList, setHistoryList] = useState<chrome.history.HistoryItem[]>([]);

    const getHistoryList = () => {
        chrome.history.search({ maxResults: 20, text: '' }, (res) => {
            setHistoryList(res);
        });
    }

    const saveHistoryItem = (item: chrome.history.HistoryItem) => {
        chrome.bookmarks.create({
            url: item.url,
            title: item.title,
            parentId: "2",
            index: 0
        }, () => { props.updateCallback(); });
    }

    const removeHistoryItem = (item: chrome.history.HistoryItem) => {

        chrome.bookmarks.search({
            url: item.url
        }, (res) => {
            if (res && res[0]) {
                chrome.bookmarks.remove(res[0].id, () => {
                    if (item.url) {
                        props.removeHistory(item.url);
                        props.updateCallback();
                    }
                });
            }
        });



    }

    useEffect(() => {
        getHistoryList();
    }, []);

    const getButton = (item: chrome.history.HistoryItem) => {
        if (item.url && props.savedList.has(item.url)) {
            return <button onClick={() => removeHistoryItem(item)} className="border-0 rounded-0 btn btn-light p-2 px-3"><FontAwesomeIcon icon={fasStar} /></button>;
        }
        return <button onClick={() => saveHistoryItem(item)} className="border-0 rounded-0 btn btn-light p-2 px-3"><FontAwesomeIcon icon={faStar} /></button>;
    }

    if (historyList) {
        return (
            <div>
                <h1 className="h4 ml-2 mt-4 text-muted">Recent History</h1>
                <hr className="m-0" />
                {historyList.map(historyItem =>
                    <div className="d-flex">
                        <Link treeNode={historyItem} canDrop={false} forceUpdateCallback={() => { }}></Link>
                        {getButton(historyItem)}
                    </div>
                )
                }
            </div >);
    }
    return null;
}