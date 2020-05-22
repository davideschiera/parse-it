import './styles.css';

import React, { useState, Fragment } from 'react';
import { ImportData } from './ImportFile';
import { ParametersConfiguration } from './ParametersConfiguration';
import { ParserGenerator } from './ParserGenerator';

export function App() {
    const [data, setData] = useState(null);
    const [parameters, setParameters] = useState([{ key: null, destination: null, mapping: null, filter: null }]);

    return (
        <Fragment>
            <h1>Parse-it</h1>

            <ImportData data={data} setData={setData} />

            <ParametersConfiguration parameters={parameters} onParametersChange={setParameters} />

            <ParserGenerator data={data} parameters={parameters} />
        </Fragment>
    );
}
