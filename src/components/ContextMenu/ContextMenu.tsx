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
    }

    render() {
        if (this.props.menuOpen) {
            return <div className="menu-container w-100" style={{ top: `${this.props.y}px`, left: 0 }}>
                {this.props.children}
                    <button onClick={this.closeMenu} className="btn btn-outline-primary p-0 border-0 rounded-0 text-left">Cancel</button>
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