import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import JSON5 from 'json5';

async function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function() {
            try {
                const lines = reader.result.split('\n');

                resolve({ root: lines.map(JSON5.parse) });
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
            setError(null);
            setData(await readFile(event.target.files[0]));
        } catch (exception) {
            setError(exception.message);
        }
    }

    async function onDrop(dataTransfer) {
        if (dataTransfer.files.length > 0) {
            try {
                setError(null);
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
            <p>
                Select, or drag&drop, or past the JSONL data (see{' '}
                <a href="http://jsonlines.org/">JSON Lines documentation</a>)
            </p>

            <form>
                <div className={`drag-drop-placeholder ${isDragging ? 'drag-drop-placeholder--dragging' : ''}`}>
                    Drop the file here...
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
                            🛑
                        </span>{' '}
                        {error}
                    </p>
                ) : null}
            </form>
        </FormSection>
    );
}
