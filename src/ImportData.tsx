import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import JSON5 from 'json5';
import { SimpleError } from './SimpleError';
import './ImportData.css';

export enum ImportedDataType {
    NONE = 'NONE',
    JSON = 'JSON',
    GROK = 'GROK'
}

export interface ImportedData {
    type: ImportedDataType;
    content: Array<string | any>;
}

export function ImportData({ data, setData }: { data: ImportedData | null; setData: (data: ImportedData) => void }) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef();

    function selectLocalFile(event: React.MouseEvent) {
        inputRef.current.click();

        // don't bubble up the event to the from (which will try to submit the form)
        event.preventDefault();
    }

    async function onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            try {
                setError(null);
                setData(await readFile(event.target.files[0]));
            } catch (exception) {
                setError(exception.message);
            }
        }
    }

    async function onDrop(dataTransfer: DataTransfer) {
        if (dataTransfer.files.length > 0) {
            try {
                setError(null);
                setData(await readFile(dataTransfer.files[0]));
            } catch (exception) {
                setError(exception.message);
            }
        }
    }

    // function onTextChange(event) {
    //     try {
    //         setData(event.target.value);
    //     } catch {
    //         // ignore errors while typing...
    //     }
    // }

    return (
        <FormSection title="1. Import data" isDragging={isDragging} onIsDraggingChanged={setIsDragging} onDrop={onDrop}>
            <p>
                Select or drag&drop data (<a href="https://www.json.org/json-en.html">JSON</a> or{' '}
                <a href="https://logz.io/blog/logstash-grok/">grok</a> files)
            </p>

            <form>
                <div className={`drag-drop-placeholder ${isDragging ? 'drag-drop-placeholder--dragging' : ''}`}>
                    Drop the file here...
                </div>

                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                {/* <textarea value={data ? JSON.stringify(data, null, 4) : ''} onChange={onTextChange} /> */}

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

async function readFile(file: File): Promise<ImportedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = function() {
            const result = reader.result as string;
            if (result === null || result === '') {
                reject(
                    new SimpleError(
                        'Empty file',
                        'Please make sure to import a valid single-line JSON file, or multi-line JSON file, or a grok file'
                    )
                );
            } else {
                const output = tryParseJsonFile(result) || tryParseGrokFile(result);

                if (output) {
                    resolve(output);
                } else {
                    reject(
                        new SimpleError(
                            'Data format not recognized',
                            'Please make sure to import a valid single-line JSON file, or multi-line JSON file, or a grok file'
                        )
                    );
                }
            }
        };
    });
}

function tryParseJsonFile(data: string) {
    try {
        return {
            type: ImportedDataType.JSON,
            content: data.split('\n').map(JSON5.parse)
        };
    } catch (exception) {
        throw new SimpleError('Data format not recognized', 'Please make sure to pass valid JSON', exception);
    }
}

function tryParseGrokFile(data: string) {
    // TODO
    return null;
}
