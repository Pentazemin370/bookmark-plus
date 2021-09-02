import { NodeEntityState } from "../NodeEntity.state";

export interface FolderState extends NodeEntityState {
    expanded: boolean;
}