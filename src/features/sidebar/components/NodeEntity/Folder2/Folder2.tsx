import React, { useEffect, useState } from 'react';
export const Folder2 = (props) => {

    console.log(props);

    function getContents() {
        return props.folder[0].children.map((child) => {

            if (child.children) {
                return <button className="d-flex" onClick={() => {
                    const b = [...props.folder];
                    b.unshift(child);
                    props.setFolder(b);
                }}>{child.title}</button>;
            }

            return <div>{child.title}</div>;
        });
    }

    return <div>
        {props.folder && props.folder.length > 1 ? <button onClick={() => {
            const [a, ...b] = props.folder;
            props.setFolder(b);
        }}>Up</button> : null}
        {props.folder[0] && props.folder[0].children ? getContents() : null}
    </div>;
};