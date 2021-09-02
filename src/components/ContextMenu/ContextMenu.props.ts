export interface ContextMenuProps {
    menuOpen : boolean;
    y : number;
    children: React.ReactElement[];
    setContextMenu : (menuOpen : boolean, y? : number, menuOptions?: JSX.Element[]) => void;
}