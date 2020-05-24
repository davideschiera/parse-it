import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import { createParser } from './parser/createParser';
import { submitParser } from './parser/submitParser';
import { verifyParser } from './parser/verifyParser';

export function ParserGenerator({ data, parameters }) {
    const [parser, setParser] = useState(null);
    const linkRef = useRef();
    const canGenerate = data !== null && Array.isArray(parameters);
    const canVerify = data !== null && Array.isArray(parameters) && parser !== null;
    const canDownload = data !== null && Array.isArray(parameters) && parser !== null;
    const canSubmit = data !== null && Array.isArray(parameters) && parser !== null;

    function generate(event) {
        event.preventDefault();

        try {
            setParser(createParser(data, parameters));
        } catch (exception) {}
    }

    async function verify(event) {
        event.preventDefault();

        try {
            await verifyParser(data, parameters, parser);
        } catch (exception) {}
    }

    async function submit(event) {
        event.preventDefault();

        try {
            await submitParser(data, parameters, parser);
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

    return (
        <FormSection title="3. Get the parser">
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <button type="button" onClick={generate} disabled={canGenerate}>
                    Generate
                </button>

                <textarea readOnly value={parser || ''} />

                <button type="button" onClick={verify} disabled={canVerify}>
                    Verify
                </button>

                {/* eslint-disable-next-line  */}
                <a ref={linkRef} style={{ display: 'none' }} />

                <button type="button" onClick={download} disabled={canDownload}>
                    Download
                </button>
                <button type="button" onClick={submit} disabled={canSubmit}>
                    Submit
                </button>
            </form>
        </FormSection>
    );
}
