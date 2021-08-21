import React, { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { CreateModalProps } from "./CreateModal.props";
import { CreateModalState } from "./CreateModal.state";
import { CreateService } from '../../../../services/CreateService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export const CreateModal = (props: CreateModalProps) => {

    let parentId: string;
    const [isFolder, setIsFolder] = useState(false);
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    const handleShow = () => {
        setIsFolder(false);
        setName('');
        setUrl('');
        parentId = CreateService.parentId;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        chrome.bookmarks.create(({
            parentId: parentId,
            title: name,
            url: url && !isFolder ? url : undefined,
            index: 0
        }), () => {
            props.forceUpdateCallback();
            props.setModalOpen(false);
        });
    }
    return (
        <Modal show={props.show} onShow={handleShow} onHide={() => props.setModalOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Create New <FontAwesomeIcon icon={isFolder ? faFolder : faLink}></FontAwesomeIcon></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={(e: any) => { handleSubmit(e); }}>
                    <Form.Check
                        className="mb-3"
                        type="switch"
                        id="custom-switch"
                        label={"Folder"}
                        checked={isFolder}
                        defaultChecked
                        onChange={() => { setIsFolder(!isFolder); }} />
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="name-input">Name</Form.Label>
                        <Form.Control required id="name-input" value={name} onChange={(e) => { setName(e.target.value); }} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="url-input">Url</Form.Label>
                        <Form.Control id="url-input"
                            required={!isFolder}
                            disabled={isFolder}
                            value={url}
                            onChange={(e) => { setUrl(e.target.value); }} />
                    </Form.Group>
                    <Button className="p-2" variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}