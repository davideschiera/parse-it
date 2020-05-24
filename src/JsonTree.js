import React from 'react';

export function JsonTree({ data, onSelect }) {
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
