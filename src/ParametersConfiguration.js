import React, { useState, useContext } from 'react';
import { FormSection } from './FormSection';
import { DestinationOptionsContext } from './DestinationOptions';
import * as Fuse from 'fuse.js';

export function ParametersConfiguration({ data, parameters, onParametersChange }) {
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
                        data={data}
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

function ParameterConfiguration({ parameter, data, onChange, onRemove }) {
    const destinationOptions = useContext(DestinationOptionsContext);

    function onInputChange(propName, event) {
        changeParameter(propName, event.target.value);
    }

    function changeParameter(propName, value) {
        onChange({
            ...parameter,
            [propName]: value !== '' ? value : null
        });
    }

    function onRemoveClick(event) {
        event.preventDefault();

        onRemove();
    }

    return (
        <div className="fieldset">
            <SuggestiveInput value={parameter.key} onChange={changeParameter.bind(null, 'key')}>
                {({ value, onChange }) => (
                    <JsonTree
                        data={data}
                        filter={value}
                        onSelect={(value) => onChange(['jsonParsed', ...value.split('.').slice(2)].join('.'))}
                    />
                )}
            </SuggestiveInput>

            <SuggestiveInput value={parameter.destination} onChange={changeParameter.bind(null, 'destination')}>
                {({ value, onChange }) => (
                    <TextList items={destinationOptions.data || []} filter={value} onSelect={onChange} />
                )}
            </SuggestiveInput>

            <input type="text" value={parameter.mapping || ''} onChange={onInputChange.bind(null, 'mapping')} />

            <input type="text" value={parameter.filter || ''} onChange={onInputChange.bind(null, 'filter')} />

            <button onClick={onRemoveClick}>Remove</button>
        </div>
    );
}

function SuggestiveInput({ value, onChange, children }) {
    const [isExpanded, toggle] = useState(false);

    function onClick(event) {
        event.preventDefault();

        toggle(isExpanded === false);
    }

    return (
        <div className="SuggestiveInput">
            <input type="text" value={value || ''} onChange={(event) => onChange(event.target.value)} />

            <button className="SuggestiveInput" onClick={onClick}>
                V
            </button>

            <div
                className={`SuggestiveInput__Suggestions ${
                    isExpanded ? 'SuggestiveInput__Suggestions--IsExpanded' : ''
                }`}
            >
                {isExpanded ? children({ value, onChange }) : null}
            </div>
        </div>
    );
}

function TextList({ items, filter, onSelect }) {
    let matches = items;
    if (filter) {
        const fuse = new Fuse.default(items, { includeScore: true });
        const result = fuse.search(filter);

        matches = result
            .sort((a, b) => {
                if (a.score !== b.score) {
                    return a.score - b.score;
                } else {
                    return a.refIndex - b.refIndex;
                }
            })
            .map((result) => result.item);
    }

    return (
        <ul className="TextList">
            {matches.map((item, i) => (
                <li key={i} onClick={() => onSelect(item)}>
                    {item}
                </li>
            ))}
        </ul>
    );
}

function JsonTree({ data, onSelect }) {
    if (data) {
        const keys = Object.keys(data);

        return (
            <ul className="JsonTree">
                {keys.map((key, i) => (
                    <JsonElement key={i} data={data} dataKey={key} onSelect={onSelect} />
                ))}
            </ul>
        );
    } else {
        return null;
    }
}

function JsonElement({ data, dataKey, onSelect }) {
    const datum = data[dataKey];
    let face;
    let keys;
    if (datum === null) {
        face = `${dataKey}: null`;
        face = 'null';
    } else if (datum === undefined) {
        face = `${dataKey}: undefined`;
        face = 'undefined';
    } else if (Array.isArray(datum)) {
        face = `${dataKey} (array)`;
        keys = Object.keys(datum);
    } else if (typeof datum === 'object') {
        face = `${dataKey} (object)`;
        keys = Object.keys(datum);
    } else {
        face = `${dataKey}: ${datum.toString()}`;
    }

    return (
        <li className="JsonElement">
            <div className="JsonElement__Face" onClick={() => onSelect(dataKey)}>
                {face}
            </div>
            {keys ? (
                <JsonTree data={datum} parent={dataKey} onSelect={(path) => onSelect(`${dataKey}.${path}`)} />
            ) : null}
        </li>
    );
}
