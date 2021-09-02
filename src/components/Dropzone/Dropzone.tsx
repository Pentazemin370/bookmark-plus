import React from "react";
import { DropzoneProps } from "./Dropzone.props";
import { DropzoneState } from "./Dropzone.state";
import "./Dropzone.scss";

export class Dropzone extends React.Component<DropzoneProps,DropzoneState> {
    
    constructor(props : DropzoneProps){
        super(props);
        this.state = { 
            active : false
        }
    }   
    handleDragOver = (e : React.DragEvent) => { e.preventDefault(); }
    handleDragEnter = (e : React.DragEvent) => { e.preventDefault(); e.stopPropagation(); this.setState({ active: this.props.canDrop }) }
    handleDragLeave = (e : React.DragEvent) => { e.stopPropagation(); this.setState({ active: false }); }
    
    render() {
        return  (
        <div
        onDragOver={this.handleDragOver}
        onDragEnter={this.handleDragEnter}
        onDrop={(ev)=>{ if(this.props.canDrop) this.props.onDropCallback(ev); this.setState({active:false})}}
        onDragLeave={this.handleDragLeave}
        className={`dropzone ${this.state.active ? 'active' : ''}`}
    ></div>);
    }
}

export default Dropzone;