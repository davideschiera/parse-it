import './styles.css';

import React, { useState, Fragment, useRef } from 'react';

function FormSection({ title, isDragging, onIsDraggingChanged, onDrop, children }) {
    const sectionRef = useRef();

    function onDragEnter(event) {
        onIsDraggingChanged(true);

        event.preventDefault();
        event.stopPropagation();
    }

    function onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function onDragLeave(event) {
        if (event.target === sectionRef.current) {
            onIsDraggingChanged(false);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    function onInnerDrop(event) {
        onIsDraggingChanged(false);

        onDrop(event.dataTransfer);

        event.preventDefault();
        event.stopPropagation();
    }
    return (
        <section
            ref={sectionRef}
            onDragEnter={onIsDraggingChanged ? onDragEnter : undefined}
            onDragOver={onIsDraggingChanged ? onDragOver : undefined}
            onDragLeave={onIsDraggingChanged ? onDragLeave : undefined}
            onDrop={onIsDraggingChanged ? onInnerDrop : undefined}
            className={isDragging ? 'is-dragging' : null}
        >
            <h2>{title}</h2>
            {children}
        </section>
    );
}

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

function ImportData({ data, setData }) {
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

function ParameterConfiguration({ parameter, onChange, onRemove }) {
    function onInputChange(propName, event) {
        onChange({
            ...parameter,
            [propName]: event.target.value
        });
    }

    function onRemoveClick(event) {
        event.preventDefault();

        onRemove();
    }

    return (
        <div className="fieldset">
            <input type="text" value={parameter.key} onChange={onInputChange.bind(null, 'key')} />
            <input type="text" value={parameter.destination} onChange={onInputChange.bind(null, 'destination')} />
            <input type="text" value={parameter.mapping} onChange={onInputChange.bind(null, 'mapping')} />
            <input type="text" value={parameter.filter} onChange={onInputChange.bind(null, 'filter')} />
            <button onClick={onRemoveClick}>Remove</button>
        </div>
    );
}

function ParametersConfiguration({ parameters, onParametersChange }) {
    function addParameterSet(event) {
        onParametersChange([...parameters, { key: null, destination: null, mapping: null, filter: null }]);

        event.preventDefault();
    }

    function changeParameterSet(index, parameter) {
        onParametersChange([
            ...parameters.filter((item, i) => i < index),
            parameter,
            ...parameters.filter((item, i) => i > index)
        ]);
    }

    function removeParameterSet(index) {
        onParametersChange(parameters.filter((item, i) => i !== index));
    }

    return (
        <FormSection title="2. Define parameters">
            <p>Enter the parameters to generate the parser</p>
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <div className="fieldset">
                    <label>Key</label>
                    <label>Destination</label>
                    <label>Mapping</label>
                    <label>Filter</label>
                </div>

                {parameters.map((set, index) => (
                    <ParameterConfiguration
                        key={index}
                        parameter={set}
                        onChange={changeParameterSet.bind(null, index)}
                        onRemove={removeParameterSet.bind(null, index)}
                    />
                ))}

                <button onClick={addParameterSet}>Add</button>
            </form>
        </FormSection>
    );
}

function ParserGenerator() {
    return (
        <FormSection title="3. Get the parser">
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <button>Generate</button>

                <textarea />

                <button>Download</button>
            </form>
        </FormSection>
    );
}

export function App() {
    const [data, setData] = useState(null);
    const [parameters, setParameters] = useState([{ key: null, destination: null, mapping: null, filter: null }]);

    return (
        <Fragment>
            <h1>Parse-it</h1>
            <ImportData data={data} setData={setData} />
            <ParametersConfiguration parameters={parameters} onParametersChange={setParameters} />
            <ParserGenerator />
        </Fragment>
    );
}
