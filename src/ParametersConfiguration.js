import React from 'react';
import { FormSection } from './FormSection';

export function ParametersConfiguration({ parameters, onParametersChange }) {
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

function ParameterConfiguration({ parameter, onChange, onRemove }) {
    function onInputChange(propName, event) {
        onChange({
            ...parameter,
            [propName]: event.target.value !== '' ? event.target.value : null
        });
    }

    function onRemoveClick(event) {
        event.preventDefault();

        onRemove();
    }

    return (
        <div className="fieldset">
            <input type="text" value={parameter.key || ''} onChange={onInputChange.bind(null, 'key')} />
            <input type="text" value={parameter.destination || ''} onChange={onInputChange.bind(null, 'destination')} />
            <input type="text" value={parameter.mapping || ''} onChange={onInputChange.bind(null, 'mapping')} />
            <input type="text" value={parameter.filter || ''} onChange={onInputChange.bind(null, 'filter')} />
            <button onClick={onRemoveClick}>Remove</button>
        </div>
    );
}
