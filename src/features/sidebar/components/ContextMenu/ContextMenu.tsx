import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setContextMenu } from '../../store';
import { ContextMenuProps } from './ContextMenu.props';

import './ContextMenu.scss';

export const ContextMenu = (props: ContextMenuProps) => {
    const dispatch = useDispatch();
    const closeMenu = () => { dispatch(setContextMenu({ open: false })); }

    const openMenu = (e: MouseEvent) => {
        e.preventDefault();
    }

    useEffect(() => {
        window.addEventListener('click', closeMenu);
        document.addEventListener("contextmenu", openMenu);
    }, []);

    useEffect(() => () => {
        window.removeEventListener('click', closeMenu);
        document.removeEventListener("contextmenu", (openMenu));
    }, []);

    if (props.menuOpen) {
        return <div className="menu-container w-100" style={{ top: `${props.y}px`, left: 0 }}>
            {props.children}
            <button onClick={closeMenu} className="btn btn-outline-primary p-0 border-0 rounded-0 text-left w-100">Cancel</button>
        </div>;
    }
    return null;


}