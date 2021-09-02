import React, { useState } from "react";
import { useSelector } from "react-redux";
import { AppState, RootState } from "../../store";
import { DropzoneProps } from "./Dropzone.props";
import "./Dropzone.scss";

export const Dropzone = (props: DropzoneProps) => {

    const [active, setActive] = useState(false);
    const { canDrop } = useSelector<RootState, AppState>(state => state);
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); }
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setActive(canDrop) }
    const handleDragLeave = (e: React.DragEvent) => { e.stopPropagation(); setActive(false); }

    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(ev) => { if (canDrop && !props.disabled) props.onDropCallback(ev); setActive(false) }}
            onDragLeave={handleDragLeave}
            className={`dropzone ${active ? 'active' : ''}`}
        ></div>);
}

export default Dropzone;