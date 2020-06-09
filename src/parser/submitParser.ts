import { ImportedData } from '../ImportData';
import { Parameter } from '../ParametersConfiguration';

export async function submitParser({
    data,
    parameters,
    parser
}: {
    data: ImportedData;
    parameters: Parameter[];
    parser: string;
}) {
    // send data + parser to API
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, parameters, parser })
    });

    const responseJson = await response.json();

    return responseJson;
}
