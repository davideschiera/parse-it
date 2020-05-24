export async function verifyParser(data, parameters, parser) {
    // send data + parser to API
    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, parameters, parser })
    });

    const responseJson = await response.json();

    return responseJson;
}
