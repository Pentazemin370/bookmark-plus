import { NodeEntityProps } from "../NodeEntity/NodeEntity.props";

export interface FolderProps extends NodeEntityProps {
    updateTree : (...args : any) => void;
    setCanDrop : (value : boolean) => void;
    index : number[];
}