import { ImportedData } from '../ImportData';
import { Parameter } from '../ParametersConfiguration';

export async function verifyParser({
    data,
    parameters,
    parser
}: {
    data: ImportedData;
    parameters: Parameter[];
    parser: string;
}) {
    // send data + parser to API
    console.log('Starting fetch');

    var rawLogsString = encodeURIComponent(data.content['root'].map(JSON.stringify).join('\r\n'));
    var parserString = encodeURIComponent(parser);
    console.log(
        [
            'https://apps.chronicle.security/partner-tools/raw-log-validation',
            'rawLogs=',
            rawLogsString,
            '&config=',
            parserString
        ].join('')
    );

    console.log('Starting fetch');
    await fetch(
        [
            'https://apps.chronicle.security/partner-tools/raw-log-validation',
            '?rawLogs=',
            rawLogsString,
            '&config=',
            parserString
        ].join(''),
        {
            method: 'POST',
            referrer: '',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    )
        .then(function(response) {
            if (!response.ok) {
                console.log(response.statusText);
                throw Error(response.statusText);
            }
            console.log(response);
            return response;
        })
        .then(function(response) {
            console.log('ok');
            return response;
        })
        .catch(function(error) {
            console.log('In error path');
            console.log(error);
        });
    //console.log("Finished fetch");
    //const responseJson = await response();
    //console.log(responseJson);
    //return responseJson;
}
