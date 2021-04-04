import React from 'react';
import { ContextMenuProps } from './ContextMenu.props';
import { ContextMenuState } from './ContextMenu.state';
import './ContextMenu.scss';

export class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {

    constructor(props: any) {
        super(props);
        this.state = {
            xPos: "0px",
            yPos: "0px"
        };
    }

    closeMenu = () => {this.props.setContextMenu(false);}

    openMenu = (e: MouseEvent) => {
        e.preventDefault();
        this.setState({ xPos: `${e.pageX}px`, yPos: `${e.pageY}px` });
    }

    render() {
        if (this.props.menuOpen) {
            return <div className="menu-container" style={{ top: this.state.yPos, left: this.state.xPos }}>
                {this.props.children.map(node=><div className="menu-option-container">{node}</div>)}
                <div className="menu-option-container" onClick={this.closeMenu}>Cancel</div>
            </div>;
        }
        return null;
    }

    componentDidMount() {
        window.addEventListener('click', this.closeMenu);
        document.addEventListener("contextmenu", this.openMenu);
    }

    componentDidUnmount() {
        window.removeEventListener('click', this.closeMenu);
        document.removeEventListener("contextmenu", (this.openMenu));
    }

}