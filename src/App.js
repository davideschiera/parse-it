import "./styles.css";

import React, { useState, Fragment } from "react";
import { ImportData } from "./ImportFile";
import {
  ParametersConfiguration,
  MAPPING_DEFAULT,
  MAPPING_DATE_RFC3339,
  MAPPING_CONVERT_DONTCONVERT
} from "./ParametersConfiguration";
import { ParserGenerator } from "./ParserGenerator";
import { DestinationOptions } from "./DestinationOptions";

export function App() {
  const [data, setData] = useState(null);
  const [parameters, setParameters] = useState([
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

  return (
    <Fragment>
      <h1>Parse-it</h1>

      <ImportData data={data} setData={setData} />

      <DestinationOptions>
        <ParametersConfiguration
          data={data}
          parameters={parameters}
          onParametersChange={setParameters}
        />
      </DestinationOptions>

      <ParserGenerator data={data} parameters={parameters} />
    </Fragment>
  );
}
