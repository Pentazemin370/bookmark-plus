import React, { useEffect, useReducer } from "react";
import { Form, Modal, Button, FormControl } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import { AppState, RootState, setShowModal, AppSettingsState, updateSettings } from "../store";
import { reducer, SettingsAction, SettingsReducer, SettingsState } from "./SettingsModalState";



export function SettingsModal() {

    const { showModal, bookmarkBarNode, contentWindow } = useSelector<RootState, AppState>(state => state.appReducer, shallowEqual);

    const appSettingsState = useSelector<RootState, AppSettingsState>(state => state.appSettingsReducer, shallowEqual);

    const [settings, setSettings] = useReducer<SettingsReducer>(reducer, {} as SettingsState);

    const dispatch = useDispatch();

    useEffect(() => {
        const initSettings = { ...appSettingsState, bgFile: '', isLocalFile: false } as SettingsState;
        setSettings({ type: SettingsAction.init, payload: initSettings });
    }, []);

    const handleSubmit = () => {
        let { isLocalFile, ..._settings } = settings;
        if (!_settings.bgFile) {
            _settings.bgFile = appSettingsState.bgFile;
        }
        chrome.storage.local.set(_settings);
        dispatch(updateSettings(_settings));
        dispatch(setShowModal(false));
    }

    const openBookmarkSettings = () => {
        if (bookmarkBarNode) {
            bookmarkBarNode.style.left = '0px';
        }
        if (contentWindow) {
            contentWindow.postMessage('settings', "*");
        }
    }



    const clockOptions = () => {
        return [<Form.Check
            className="mb-3"
            id="clock-show-time"
            label={"Show Time"}
            type="switch"
            checked={settings.displayTime}
            disabled={!settings.showClock}
            onChange={() => setSettings({ type: SettingsAction.setDisplayTime })} />,
        <Form.Check
            className="mb-3"
            id="clock-show-AM-PM"
            label={"Show AM/PM"}
            type="switch"
            checked={settings.hour12}
            disabled={!settings.showClock || !settings.displayTime}
            onChange={() => setSettings({ type: SettingsAction.setHour12 })} />,
        <Form.Check
            className="mb-3"
            id="clock-show-seconds"
            label={"Show Seconds"}
            type="switch"
            checked={settings.displaySeconds}
            disabled={!settings.showClock || !settings.displayTime}
            onChange={() => setSettings({ type: SettingsAction.setDisplaySeconds })} />,
        <Form.Check
            className="mb-3"
            id="clock-show-date"
            label={"Show Date"}
            type="switch"
            checked={settings.displayDate}
            disabled={!settings.showClock}
            onChange={() => setSettings({ type: SettingsAction.setDisplayDate })} />
        ]
    }

    return <Modal show={showModal} onHide={() => dispatch(setShowModal(false))}>
        <Modal.Header closeButton>
            <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary" onClick={openBookmarkSettings}>Bookmark Bar Settings</button>
            </div>
            <div className="row pt-3 pb-3 align-items-baseline border-top border-bottom">
                <label className="col-4" htmlFor="bg-url">Set Background Image</label>
                <div className="col-8">
                    <Form.Check
                        className="mb-3"
                        inline
                        type="radio"
                        id="bg-file-url"
                        label={"Web URL"}
                        checked={!settings.isLocalFile}
                        onChange={() => { setSettings({ type: SettingsAction.setIsLocalFile, payload: false }) }} />
                    <Form.Check
                        className="mb-3"
                        inline
                        type="radio"
                        id="bg-file-upload"
                        label={"Upload File"}
                        checked={settings.isLocalFile}
                        onChange={() => { setSettings({ type: SettingsAction.setIsLocalFile, payload: true }) }} />
                    {settings.isLocalFile ?
                        <Form.File id="bg-url">
                            <Form.File.Input onChange={(s: React.ChangeEvent<HTMLInputElement>) => {
                                if (s.target && s.target.files) {
                                    let file = s.target.files[0];
                                    let reader = new FileReader();
                                    reader.addEventListener("load", () => {
                                        if (reader.result) {
                                            setSettings({ type: SettingsAction.setBgFile, payload: reader.result });
                                        }
                                    });
                                    if (file) {
                                        reader.readAsDataURL(file);
                                    }
                                }
                            }} />
                        </Form.File>
                        :
                        <FormControl
                            id="bg-url"
                            placeholder="Enter Image URL"
                            aria-label="Enter Image URL"
                            value={settings.bgFile as string}
                            onChange={(e) => { setSettings({ type: SettingsAction.setBgFile, payload: e.target.value }); }}
                        />
                    }
                </div>
            </div>
            <div className="row pt-3 pb-3 border-bottom">
                <label className="col-4">Override New Tab</label>
                <div className="col-8">
                    <div>NOTE: Required to run bookmark extension on New Tab.</div>
                    <Form.Check
                        type="switch"
                        id="custom-switch"
                        inline
                        label={settings.enableOverride ? 'Yes' : 'No'}
                        checked={settings.enableOverride}
                        onChange={() => { setSettings({ type: SettingsAction.setEnableOverride }) }} />
                </div>
            </div>
            <div className="row pt-3 pb-3 border-bottom">
                <label className="col-4">Clock Options</label>
                <div className="col-8">
                    <Form.Check
                        className="mb-3"
                        type="switch"
                        id="custom-switch-2"
                        inline
                        label={"Show Clock"}
                        checked={settings.showClock}
                        onChange={() => setSettings({ type: SettingsAction.setShowClock })} />
                    {clockOptions()}
                </div>
            </div>
            <div className="d-flex pt-3 justify-content-end">
                <Button onClick={() => dispatch(setShowModal(false))} className="p-2 mr-3 modal-button" variant="light">
                    Cancel
                    </Button>
                <Button onClick={handleSubmit} className="p-2 modal-button" variant="primary">
                    Save Changes
                    </Button>
            </div>

        </Modal.Body>
    </Modal>;

}