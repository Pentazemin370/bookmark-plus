

export interface SearchMenuProps {
    forceUpdateCallback: (...args: any) => void;
    setContextMenu: (menuOpen: boolean, y?: number, menuOptions?: JSX.Element[]) => void;
}