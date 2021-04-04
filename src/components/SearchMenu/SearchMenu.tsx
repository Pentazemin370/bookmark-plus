import React from 'react';
import Link from '../Link/Link';
import { SearchMenuProps } from './SearchMenu.props';
import { SearchMenuState } from './SearchMenu.state';
export class SearchMenu extends React.Component<SearchMenuProps, SearchMenuState> {

    constructor(props: SearchMenuProps) {
        super(props);
        this.state = {
            value: '',
            resultList: []
        }
    }

    render() {     
        return [<input type="text" value={this.state.value} onChange={this.handleChange} />,
        this.state.resultList.map(result => <Link
            canDrop={true}
            setContextMenu={this.props.setContextMenu}
            treeNode={result}
            forceUpdateCallback={this.props.forceUpdateCallback}></Link>)
        ];
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: event.target.value },this.updateResults);
    }

    updateResults = () => {
        if (this.state.value) {
            chrome.bookmarks.search(this.state.value,(results)=>this.setState({ resultList: results.slice(0, 50) }));
        }
        else {
            this.setState({ resultList: [] });
        }
    }

}