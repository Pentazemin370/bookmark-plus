

export interface SearchMenuProps {
    canDrop : boolean;
    forceUpdateCallback : (...args : any) => void;
    setContextMenu : (menuOpen : boolean, y? : number, menuOptions?: JSX.Element[]) => void;
}