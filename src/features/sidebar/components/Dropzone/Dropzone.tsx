import React, { useState } from "react";
import { DropzoneProps } from "./Dropzone.props";
import "./Dropzone.scss";

export const Dropzone = (props: DropzoneProps) => {

    const [active, setActive] = useState(false);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); }
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setActive(props.canDrop) }
    const handleDragLeave = (e: React.DragEvent) => { e.stopPropagation(); setActive(false); }

    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(ev) => { if (props.canDrop) props.onDropCallback(ev); setActive(false) }}
            onDragLeave={handleDragLeave}
            className={`dropzone ${active ? 'active' : ''}`}
        ></div>);
}

export default Dropzone;