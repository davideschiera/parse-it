import React, { useState, useContext, ChangeEvent } from 'react';
import { FormSection } from './FormSection';
import { DestinationOptionsContext } from './DestinationOptions';
import { JsonTree } from './JsonTree';
import { TextList } from './TextList';
import { ImportedData } from './ImportData';
import './ParametersConfiguration.css';

export const MAPPING_DEFAULT = 'STATIC';
const MAPPING_DEFAULT_TEXT = 'Static';
export const MAPPING_DATE = 'DATE';
const MAPPING_DATE_TEXT = 'Date';
export const MAPPING_REPLACE = 'REPLACE';
const MAPPING_REPLACE_TEXT = 'Replace';
export const MAPPING_RENAME = 'RENAME';
const MAPPING_RENAME_TEXT = 'Rename';
export const MAPPING_MERGE = 'MERGE';
const MAPPING_MERGE_TEXT = 'Merge';
export const MAPPING_GROK = 'GROK';
const MAPPING_GROK_TEXT = 'Grok';

export const MAPPING_DATE_RFC3339 = 'RFC3339';
export const MAPPING_DATE_UNIX = 'UNIX';
export const MAPPING_DATE_ISO8601 = 'ISO8601';
export const MAPPING_DATE_UNIX_MS = 'UNIX_MS';
export const MAPPING_DATE_ddMMMyyyyHHmmssZ = 'dd/MMM/yyyy:HH:mm:ss Z';
export const MAPPING_DATE_MMMddyyyyHHmmss = 'MMM dd yyyy HH:mm:ss';

export const MAPPING_CONVERT_UINTEGER = 'uinteger';
export const MAPPING_CONVERT_IPADDRESS = 'ipaddress';
export const MAPPING_CONVERT_INTEGER = 'integer';
export const MAPPING_CONVERT_STRING = 'string';
export const MAPPING_CONVERT_BOOLEAN = 'boolean';
export const MAPPING_CONVERT_MACADDRESS = 'macaddress';
export const MAPPING_CONVERT_BYTES = 'bytes';
export const MAPPING_CONVERT_HASH = 'hash';
export const MAPPING_CONVERT_DONTCONVERT = '-';

export interface Parameter {
    key: string | null;
    destination: string | null;
    mapping: string;
    mappingData: string | null;
    mappingDateType: string;
    mappingConvertType: string;
    filter: string | null;
}

export function ParametersConfiguration({
    data,
    parameters,
    onParametersChange
}: {
    data: ImportedData | null;
    parameters: Parameter[];
    onParametersChange: (parameters: Parameter[]) => void;
}) {
    function addParameterSet(event: React.MouseEvent) {
        onParametersChange([
            ...parameters,
            {
                key: null,
                destination: null,
                mapping: MAPPING_DEFAULT,
                mappingData: null,
                mappingDateType: MAPPING_DATE_RFC3339,
                mappingConvertType: MAPPING_CONVERT_DONTCONVERT,
                filter: null
            }
        ]);

        event.preventDefault();
    }

    function changeParameterSet(index: number, parameter: Parameter) {
        console.log(index);
        onParametersChange([
            ...parameters.filter((item, i) => i < index),
            parameter,
            ...parameters.filter((item, i) => i > index)
        ]);
    }

    function removeParameterSet(index: number) {
        onParametersChange(parameters.filter((item, i) => i !== index));
    }

    return (
        <FormSection title="2. Define parameters">
            <p>Enter the parameters to generate the parser</p>
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <div className="ParameterConfiguration__Fieldset">
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

function ParameterConfiguration({
    parameter,
    data,
    onChange,
    onRemove
}: {
    parameter: Parameter;
    data: ImportedData | null;
    onChange: (parameter: Parameter) => void;
    onRemove: () => void;
}) {
    const destinationOptions = useContext(DestinationOptionsContext);

    function onInputChange(propName: string, event: ChangeEvent<HTMLInputElement>) {
        changeParameter(propName, event.target.value);
    }

    function changeParameter(propName: string, value: string) {
        onChange({
            ...parameter,
            [propName]: value !== '' ? value : null
        });
    }

    function onRemoveClick(event: React.MouseEvent) {
        event.preventDefault();

        onRemove();
    }

    return (
        <div className="ParameterConfiguration__Fieldset">
            <SuggestiveInput value={parameter.key} onChange={changeParameter.bind(null, 'key')}>
                {({ value, onSelect }) => (
                    <JsonTree
                        data={data?.content}
                        onSelect={(value) =>
                            onSelect(
                                value
                                    .split('.')
                                    .slice(2)
                                    .join('.')
                            )
                        }
                    />
                )}
            </SuggestiveInput>

            <SuggestiveInput value={parameter.destination} onChange={changeParameter.bind(null, 'destination')}>
                {({ value, onSelect }) => (
                    <TextList items={destinationOptions.data} filter={value} onSelect={onSelect} />
                )}
            </SuggestiveInput>

            <div className="ParameterConfiguration__MappingFieldset">
                <select value={parameter.mapping} onChange={onInputChange.bind(null, 'mapping')}>
                    <option value={MAPPING_DEFAULT}>{MAPPING_DEFAULT_TEXT}</option>
                    <option value={MAPPING_DATE}>{MAPPING_DATE_TEXT}</option>
                    <option value={MAPPING_REPLACE}>{MAPPING_REPLACE_TEXT}</option>
                    <option value={MAPPING_RENAME}>{MAPPING_RENAME_TEXT}</option>
                    <option value={MAPPING_MERGE}>{MAPPING_MERGE_TEXT}</option>
                    <option value={MAPPING_GROK}>{MAPPING_GROK_TEXT}</option>
                </select>
                {parameter.mapping === MAPPING_GROK || parameter.mapping === MAPPING_REPLACE ? (
                    <input
                        type="text"
                        value={parameter.mappingData || ''}
                        onChange={onInputChange.bind(null, 'mappingData')}
                    />
                ) : null}

                {parameter.mapping === MAPPING_DATE ? (
                    <select value={parameter.mappingDateType} onChange={onInputChange.bind(null, 'mappingDateType')}>
                        <option value={MAPPING_DATE_RFC3339}>{MAPPING_DATE_RFC3339}</option>
                        <option value={MAPPING_DATE_ISO8601}>{MAPPING_DATE_ISO8601}</option>
                        <option value={MAPPING_DATE_UNIX}>{MAPPING_DATE_UNIX}</option>
                        <option value={MAPPING_DATE_UNIX_MS}>{MAPPING_DATE_UNIX}</option>
                        <option value={MAPPING_DATE_ddMMMyyyyHHmmssZ}>{MAPPING_DATE_ddMMMyyyyHHmmssZ}</option>
                        <option value={MAPPING_DATE_MMMddyyyyHHmmss}>{MAPPING_DATE_MMMddyyyyHHmmss}</option>
                    </select>
                ) : null}
                {parameter.mapping === MAPPING_MERGE || parameter.mapping === MAPPING_RENAME ? (
                    <select
                        value={parameter.mappingConvertType || '-'}
                        onChange={onInputChange.bind(null, 'mappingConvertType')}
                    >
                        <option value={MAPPING_CONVERT_DONTCONVERT}>{MAPPING_CONVERT_DONTCONVERT}</option>
                        <option value={MAPPING_CONVERT_UINTEGER}>{MAPPING_CONVERT_UINTEGER}</option>
                        <option value={MAPPING_CONVERT_BOOLEAN}>{MAPPING_CONVERT_BOOLEAN}</option>
                        <option value={MAPPING_CONVERT_BYTES}>{MAPPING_CONVERT_BYTES}</option>
                        <option value={MAPPING_CONVERT_HASH}>{MAPPING_CONVERT_HASH}</option>
                        <option value={MAPPING_CONVERT_INTEGER}>{MAPPING_CONVERT_INTEGER}</option>
                        <option value={MAPPING_CONVERT_IPADDRESS}>{MAPPING_CONVERT_IPADDRESS}</option>
                        <option value={MAPPING_CONVERT_STRING}>{MAPPING_CONVERT_STRING}</option>
                        <option value={MAPPING_CONVERT_MACADDRESS}>{MAPPING_CONVERT_MACADDRESS}</option>
                    </select>
                ) : null}
            </div>

            <input type="text" value={parameter.filter || ''} onChange={onInputChange.bind(null, 'filter')} />

            <button onClick={onRemoveClick}>Remove</button>
        </div>
    );
}

function SuggestiveInput({
    value,
    onChange,
    children
}: {
    value: string | null;
    onChange: (value: string) => void;
    children: ({ value, onSelect }: { value: string | null; onSelect: (value: string) => void }) => React.ReactNode;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    function onClick(event: React.MouseEvent) {
        event.preventDefault();

        setIsExpanded(isExpanded === false);
    }

    function onSelect(value: string) {
        setIsExpanded(false);
        onChange(value);
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
                {isExpanded ? children({ value, onSelect }) : null}
            </div>
        </div>
    );
}
