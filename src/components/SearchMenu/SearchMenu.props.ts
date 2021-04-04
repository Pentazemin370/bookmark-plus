

export interface SearchMenuProps {
    canDrop : boolean;
    forceUpdateCallback : (...args : any) => void;
    setContextMenu : (menuOpen : boolean, menuOptions?: JSX.Element[]) => void;
}