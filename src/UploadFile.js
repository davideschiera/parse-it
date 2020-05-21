import React, { useState } from 'react';

const NONE = 0;
const DRAGGING = 1;

export function UploadFile({ onChange }) {
    const [content, setContent] = useState(null);
    const [dropState, setDropState] = useState(NONE);

    function selectFile(event) {
        event.persist();
        console.log('upload', event);

        loadFiles(event.target.files);
    }

    function loadFiles(files) {
        for (const file of files) {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function() {
                onChange(reader.result);
            };
        }
    }

    function onDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        setDropState(NONE);

        loadFiles(event.dataTransfer.files);
    }
    function onDragEnter(event) {
        setDropState(DRAGGING);

        event.preventDefault();
    }
    function onDragOver(event) {
        event.preventDefault();
    }
    function onDragLeave(event) {
        setDropState(NONE);

        event.preventDefault();
    }
    function onDragEnd(event) {
        setDropState(NONE);

        event.preventDefault();
    }

    return (
        <div
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            style={{ width: '100vw', height: '100vh' }}
        >
            <form>
                <input type="file" id="file" accept="*" onChange={selectFile} />
                <label htmlFor="file">Select JSON file</label>
            </form>
        </div>
    );
}
