import React from 'react';
import Link from '../NodeEntity/Link/Link';
import { SearchMenuProps } from './SearchMenu.props';
import { SearchMenuState } from './SearchMenu.state';
import './SearchMenu.scss';
import { Form, Pagination } from 'react-bootstrap';
import { sortByProperty } from '../../util/common-util';
export class SearchMenu extends React.Component<SearchMenuProps, SearchMenuState> {

    constructor(props: SearchMenuProps) {
        super(props);
        this.state = {
            value: '',
            includeHistory: false,
            page: 1,
            resultList: []
        }
    }

    private tempList: (chrome.bookmarks.BookmarkTreeNode | chrome.history.HistoryItem)[] = [];
    pages: JSX.Element[] = [];

    render() {
        console.log(this.state.page, this.state.resultList.length % 20);
        this.pages = [];
        for (let i = 1; i <= this.state.resultList.length / 20 + 1; i++) {
            this.pages.push(<Pagination.Item key={i} onClick={() => { console.log(i); this.setState({ page: i }); }} active={this.state.page === i}>
                {i}
            </Pagination.Item>);
        }

        return [
            <div>
                <div className="m-2">
                    <input type="text" className="search-input " value={this.state.value} placeholder="Search..." onChange={this.handleChange} />
                </div>
                <hr />
                <div className="d-flex mx-2 align-items-baseline justify-content-between">
                    <label htmlFor="include-search-radio">Include History</label>
                    <Form.Check
                        type="switch"
                        id="include-search-radio"
                        label=""
                        checked={this.state.includeHistory}
                        onChange={() => this.setState({ includeHistory: !this.state.includeHistory }, () => { this.updateResults(); })}
                    />
                </div>
                <hr />
                <i>{this.state.resultList.length} Results</i>
            </div>,
            <div className="d-flex flex-column align-items-center">
                <div className="results-container">
                    {this.state.resultList.map(result => <Link
                        canDrop={false}
                        setContextMenu={this.props.setContextMenu}
                        treeNode={result}
                        forceUpdateCallback={this.props.forceUpdateCallback}></Link>)
                        .slice((this.state.page - 1) * 20, this.state.page * 20)}
                </div>
                <Pagination className="mt-3">
                    <Pagination.First onClick={() => this.setState({ page: 1 })} />
                    <Pagination.Prev onClick={() => {
                        if (this.state.page > 1) {
                            this.setState({ page: this.state.page - 1 });
                        }
                    }} />
                    {this.pages}
                    <Pagination.Next onClick={() => {
                        if (this.state.page <= this.state.resultList.length / 20) {
                            this.setState({ page: this.state.page + 1 });
                        }
                    }} />
                    <Pagination.Last onClick={() => this.setState({ page: 1 + this.state.resultList.length / 20 })} />
                </Pagination>
            </div>
        ];
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: event.target.value }, this.updateResults);
    }

    updateResults = () => {
        this.tempList = [];
        if (this.state.value) {
            chrome.bookmarks.search(this.state.value, (results) => {
                this.tempList = this.tempList.concat(results.filter(res => !!res.url));

                if (this.state.includeHistory) {
                    chrome.history.search({ text: this.state.value }, (results) => {
                        this.tempList = this.tempList.concat(results);
                        sortByProperty(this.tempList, 'title');
                        this.setState({ resultList: this.tempList });
                    });
                } else {
                    sortByProperty(this.tempList, 'title');
                    this.setState({ resultList: this.tempList });
                }
            });

        } else {
            this.setState({ resultList: this.tempList });
        }
    }



}