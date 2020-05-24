import React, { useState, useContext } from 'react';
import { FormSection } from './FormSection';
import { DestinationOptionsContext } from './DestinationOptions';
import { JsonTree } from './JsonTree';
import { TextList } from './TextList';

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
                    <label>Key (*)</label>
                    <label>Destination (*)</label>
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
