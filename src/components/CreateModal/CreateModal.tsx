import React from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { CreateModalProps } from "./CreateModal.props";
import { CreateModalState } from "./CreateModal.state";
import { CreateService } from '../../services/CreateService';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder } from "@fortawesome/free-regular-svg-icons";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export class CreateModal extends React.Component<CreateModalProps, CreateModalState> {

    parentId: string;
    constructor(props: CreateModalProps) {
        super(props);
        this.state = {
            isFolder: false,
            name: '',
            url: ''
        };
        this.parentId = CreateService.parentId;
    }

    handleShow = () => {
        this.setState({
            isFolder: false,
            name: '',
            url: ''
        });
        this.parentId = CreateService.parentId;
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        chrome.bookmarks.create(({
            parentId: this.parentId,
            title: this.state.name,
            url: this.state.url && !this.state.isFolder ? this.state.url : undefined,
            index: 0
        }), () => {
            this.props.forceUpdateCallback();
            this.props.setModalOpen(false);
        });
    }

    render() {
        return (
            <Modal show={this.props.show} onShow={this.handleShow} onHide={() => this.props.setModalOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New <FontAwesomeIcon icon={this.state.isFolder ? faFolder : faLink}></FontAwesomeIcon></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e: any) => { this.handleSubmit(e); }}>
                        <Form.Check
                            className="mb-3"
                            type="switch"
                            id="custom-switch"
                            label={"Folder"}
                            checked={this.state.isFolder}
                            defaultChecked
                            onChange={() => { this.setState({ isFolder: !this.state.isFolder }); }} />
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="name-input">Name</Form.Label>
                            <Form.Control required id="name-input" value={this.state.name} onChange={(e) => { this.setState({ name: e.target.value }); }} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="url-input">Url</Form.Label>
                            <Form.Control id="url-input"
                                required={!this.state.isFolder}
                                disabled={this.state.isFolder}
                                value={this.state.url}
                                onChange={(e) => { this.setState({ url: e.target.value }); }} />
                        </Form.Group>
                        <Button className="p-2" variant="primary" type="submit">
                            Save Changes
                    </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}