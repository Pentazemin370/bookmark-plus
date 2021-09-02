import React, { useEffect, useState } from 'react';
import Link from '../NodeEntity/Link/Link';
import { SearchMenuProps } from './SearchMenu.props';
import './SearchMenu.scss';
import { Form, Pagination } from 'react-bootstrap';
import { sortByProperty } from '../../../../util/common-util';




export const SearchMenu = (props: SearchMenuProps) => {

    const [resultList, setResultList] = useState<(chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem)[]>([]);
    const [page, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [includeHistory, setIncludeHistory] = useState(false);



    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    }

    const updateResults = () => {
        let tempList: (chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem)[] = [];
        if (query) {
            chrome.bookmarks.search(query, (results) => {
                tempList = tempList.concat(results.filter(res => !!res.url));
                if (includeHistory) {
                    chrome.history.search({ text: query }, (results) => {
                        tempList = tempList.concat(results);
                        sortByProperty(tempList, 'title');
                        setResultList(tempList);
                    });
                }
                else {
                    sortByProperty(tempList, 'title');
                    setResultList(tempList);
                }
            });
        } else {
            sortByProperty(tempList, 'title');
            setResultList(tempList);
        }
    }

    const pagination = () => {
        let tempPages = [];
        for (let i = 1; i <= resultList.length / 20 + 1; i++) {
            tempPages.push(<Pagination.Item key={i} onClick={() => setPage(i)} active={page === i}>
                {i}
            </Pagination.Item>);
        }
        return tempPages;
    }

    useEffect(() => { updateResults(); }, [query, page, includeHistory]);

    return <>
        <div>
            <div className="m-2">
                <input type="text" className="search-input " value={query} placeholder="Search..." onChange={handleChange} />
            </div>
            <hr />
            <div className="d-flex mx-2 align-items-baseline justify-content-between">
                <label htmlFor="include-search-radio">Include History</label>
                <Form.Check
                    type="switch"
                    id="include-search-radio"
                    label=""
                    checked={includeHistory}
                    onChange={() => setIncludeHistory(!includeHistory)}
                />
            </div>
            <hr />
            <i>{resultList.length} Results</i>
        </div>,
        <div className="d-flex flex-column align-items-center">
            <div className="results-container">
                {resultList.map(result => <Link
                    isBookmark={false}
                    treeNode={result}
                    forceUpdateCallback={props.forceUpdateCallback} />)
                    .slice((page - 1) * 20, page * 20)}
            </div>
            <Pagination className="mt-3">
                <Pagination.First onClick={() => setPage(1)} />
                <Pagination.Prev onClick={() => {
                    if (page > 1) {
                        setPage(page - 1);
                    }
                }} />
                {pagination()}
                <Pagination.Next onClick={() => {
                    if (page <= resultList.length / 20) {
                        setPage(page + 1);
                    }
                }} />
                <Pagination.Last onClick={() => setPage(1 + resultList.length / 20)} />
            </Pagination>
        </div>
    </>;

}