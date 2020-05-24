import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import { createParser } from './createParser';

export function ParserGenerator({ data, parameters }) {
    const [parser, setParser] = useState(null);
    const linkRef = useRef();

    function generate(event) {
        event.preventDefault();

        try {
            setParser(createParser(data, parameters));
        } catch (exception) {}
    }

    async function verify(event) {
        event.preventDefault();

        try {
            // send data + parser to API
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data, parameters, parser })
            });

            const responseJson = await response.json();
        } catch (exception) {}
    }

    function download(event) {
        event.preventDefault();

        const url = window.URL.createObjectURL(new Blob([parser], { type: 'application/javascript' }));
        linkRef.current.href = url;
        linkRef.current.download = 'parser.js';
        linkRef.current.click();
        window.URL.revokeObjectURL(url);
    }

    async function submit(event) {
        event.preventDefault();

        try {
            // send data + parser to API
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data, parameters, parser })
            });

            const responseJson = await response.json();
        } catch (exception) {}
    }

    return (
        <FormSection title="3. Get the parser">
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <button onClick={generate}>Generate</button>

                <textarea readOnly value={parser || ''} />

                <button onClick={verify}>Verify</button>

                {/* eslint-disable-next-line  */}
                <a ref={linkRef} style={{ display: 'none' }} />

                <button onClick={download}>Download</button>
                <button onClick={submit} disabled>
                    Submit
                </button>
            </form>
        </FormSection>
    );
}
