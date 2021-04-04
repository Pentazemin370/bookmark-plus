export interface ContextMenuProps {
    menuOpen : boolean;
    children: React.ReactElement[];
    setContextMenu : (menuOpen : boolean, menuOptions?: JSX.Element[]) => void;
}