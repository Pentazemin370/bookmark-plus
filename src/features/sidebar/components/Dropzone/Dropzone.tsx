import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState, RootState } from "../../store";
import { DropzoneProps } from "./Dropzone.props";
import "./Dropzone.scss";

export const Dropzone = (props: DropzoneProps) => {

    const [active, setActive] = useState(false);
    const { canDrop } = useSelector<RootState, AppState>(state => state);
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); }
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setActive(props.alwaysActive || canDrop) }
    const handleDragLeave = (e: React.DragEvent) => { e.stopPropagation(); setActive(false); }
    const setInactive = () => setActive(false);
    useEffect(() => {

        document.addEventListener("onmouseup", setInactive);
    }, []);
    useEffect(() => () => {
        document.removeEventListener("onmouseup", setInactive);
    }, []);
    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDrop={(ev) => { setActive(false); if (props.alwaysActive || canDrop && !props.disabled) props.onDropCallback(ev); }}
            onDragLeave={handleDragLeave}
            className={`dropzone text-center ${props.alwaysActive || active ? 'active' : ''}`}
        >{active || props.alwaysActive ? 'Insert Here' : ''}</div>);
}

export default Dropzone;