import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export const Settings = () => {

    const [barOrientation, setBarOrientation] = useState<string>('left');

    const shortcutURL = 'chrome://extensions/shortcuts';

    const handleSubmit = () => {
        chrome.storage.local.set({ barOrientation: barOrientation });
    };

    const openShortcutPage = () => {
        chrome.tabs.create({ url: shortcutURL });
    }

    return <div className="h-100 mx-3 d-flex flex-column">
        <h1 className="h4 my-3 text-muted">Settings</h1>
        <div className="row py-3 border-bottom">
            <span className="col-4">Sidebar Position</span>
            <div>
                <Form.Check
                    inline
                    type="radio"
                    id="bar-left-orientation"
                    label={"Left"}
                    checked={barOrientation === 'left'}
                    onChange={() => { setBarOrientation('left'); }} />
                <Form.Check
                    inline
                    type="radio"
                    id="bar-right-orientation"
                    label={"Right"}
                    checked={barOrientation === 'right'}
                    onChange={() => { setBarOrientation('right'); }} />
            </div>
        </div>
        <div className="row py-3 align-items-center border-bottom">
            <label className="col-6" htmlFor="toggleHotkeyButton">Default hotkey: Ctrl + Space</label>
            <Button id="toggleHotkeyButton" onClick={openShortcutPage} className="p-2" variant="secondary">Set Toggle Hotkey</Button>
        </div>
        <Button onClick={handleSubmit} className="p-2" variant="primary">Save Changes</Button>
    </div>;
}