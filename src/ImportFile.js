import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';

async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function() {
            try {
                resolve(JSON.parse(reader.result));
            } catch (exception) {
                reject({ name: 'Data format not recognized', message: 'Please make sure to pass valid JSON' });
            }
        };
    });
}

export function ImportData({ data, setData }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    function selectLocalFile(event) {
        inputRef.current.click();

        // don't bubble up the event to the from (which will try to submit the form)
        event.preventDefault();
    }

    async function onFileInputChange(event) {
        try {
            setData(await readFile(event.target.files[0]));
        } catch (exception) {
            setError(exception.message);
        }
    }

    async function onDrop(dataTransfer) {
        if (dataTransfer.files.length > 0) {
            try {
                setData(await readFile(dataTransfer.files[0]));
            } catch (exception) {
                setError(exception.message);
            }
        }
    }

    function onTextChange(event) {
        try {
            setData(event.target.value);
        } catch {
            // ignore errors while typing...
        }
    }

    return (
        <FormSection title="1. Import data" isDragging={isDragging} onIsDraggingChanged={setIsDragging} onDrop={onDrop}>
            <p>Paste the JSON data, or drop a file from your computer, or select a file from here</p>

            <form>
                <div className={`drag-drop-placeholder ${isDragging ? 'drag-drop-placeholder--dragging' : ''}`}>
                    Drop the JSON file here...
                </div>

                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <textarea value={data ? JSON.stringify(data, null, 4) : ''} onChange={onTextChange} />

                <input
                    type="file"
                    accept="application/json"
                    style={{ display: 'none' }}
                    ref={inputRef}
                    onChange={onFileInputChange}
                />

                <button onClick={selectLocalFile}>Upload</button>

                {error ? (
                    <p>
                        <span role="img" aria-label="Import error">
                            ⚠️
                        </span>{' '}
                        {error}
                    </p>
                ) : null}
            </form>
        </FormSection>
    );
}
