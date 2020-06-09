import {
    MAPPING_DEFAULT,
    MAPPING_GROK,
    MAPPING_DATE,
    MAPPING_RENAME,
    MAPPING_MERGE,
    MAPPING_REPLACE,
    MAPPING_CONVERT_DONTCONVERT,
    Parameter
} from '../ParametersConfiguration';

export function createParser(passedParameters: Parameter[]) {
    let parameters = passedParameters.slice();
    function emitMergeRenameBlock(
        outputStatements: string[],
        destination: string,
        source: string,
        mappingConvertType: string,
        operator: string
    ) {
        if (mappingConvertType !== null && mappingConvertType !== MAPPING_CONVERT_DONTCONVERT) {
            outputStatements.push(`    mutate {`);
            outputStatements.push(`            convert => { "${source}" => "${mappingConvertType}" }
            on_error => "is_already_${mappingConvertType}_${source}"
            }`);
        }

        let lhs = source;
        let rhs = destination;
        if (operator === 'merge') {
            rhs = source;
            lhs = destination;
        }
        outputStatements.push(`    mutate {`);
        outputStatements.push(`            ${operator} => {
              "${lhs}" => "${rhs}"
            }
        }`);
        /* if (
      mappingConvertType !== null &&
      mappingConvertType !== MAPPING_CONVERT_DONTCONVERT
    ) {
      outputStatements.push(`            if [is_already_${mappingConvertType}_${source}] {
            # Does not need conversion
        }`);
    }*/
    }

    const header = `filter {
	json {
          source => "message"
          array_function => "split_columns"
      }`;

    const sectionTrailer = `             }
        }`;

    const trailer = `       mutate {
            merge => {
                "@output" => "event"
            }
        }
}`;
    parameters.sort((a, b) => {
        if (a.filter === null) {
            return -1;
        } else if (b.filter === null) {
            return 1;
        } else if (a.filter > b.filter) {
            return 1;
        } else {
            return -1;
        }
    });

    let lastFilter = '';
    let outputStatements = [];
    let firstFilter = true;
    let inConditional = false;
    console.log('Length of parameters == ' + String(parameters.length));
    for (let index = 0; index < parameters.length; index++) {
        let parameter = parameters[index];
        let currentFilter = parameters[index].filter || '';

        if (lastFilter !== currentFilter) {
            lastFilter = currentFilter;
            if (firstFilter === false) {
                outputStatements.push('    }');
            }
            if (currentFilter !== '') {
                outputStatements.push('    ' + currentFilter + '  {');
                inConditional = true;
            } else {
                inConditional = false;
            }
        }

        const { destination, key, mapping, mappingData, mappingConvertType, mappingDateType } = parameter;
        let udmDestination = 'event.idm.read_only_udm.' + destination;
        switch (mapping) {
            case MAPPING_DEFAULT:
                outputStatements.push(`         mutate {
            replace => {
	    	    "${udmDestination}" => "${key}"
	        }
        }`);
                break;
            case MAPPING_DATE:
                console.log(mappingDateType);
                outputStatements.push(`       date {
            match => ["${key}", "${mappingDateType}"]
            locale => "en"
        }`);
                break;
            case MAPPING_GROK:
                outputStatements.push(`       grok {
            match => {
                message => ${mappingData}`);
                outputStatements.push(sectionTrailer);
                break;
            case MAPPING_MERGE:
                emitMergeRenameBlock(outputStatements, udmDestination, key, mappingConvertType, 'merge');
                break;
            case MAPPING_RENAME:
                emitMergeRenameBlock(outputStatements, udmDestination, key, mappingConvertType, 'rename');
                break;
            case MAPPING_REPLACE:
                outputStatements.push(`       mutate {
            replace => {
                "${udmDestination}" => ${mappingData}`);
                outputStatements.push(sectionTrailer);
                break;
            default:
                console.log('Should not have reached here');
        }
    }

    if (inConditional === true) {
        outputStatements.push('    }');
    }
    console.log(header + '\r\n' + outputStatements.join('\r\n') + trailer);
    return header + '\r\n' + outputStatements.join('\r\n') + '\r\n' + trailer;
}
