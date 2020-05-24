import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import { createParser } from './parser/createParser';
import { submitParser } from './parser/submitParser';
import { verifyParser } from './parser/verifyParser';

export function ParserGenerator({ data, parameters }) {
    const [parser, setParser] = useState(null);
    const linkRef = useRef();
    const canGenerate = data !== null && parameters.length > 0;
    const canVerify = data !== null && parameters.length > 0 && parser !== null;
    const canDownload = canVerify;
    const canSubmit = canVerify;

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

                <button type="button" onClick={generate} disabled={canGenerate === false}>
                    Generate
                </button>

                <textarea readOnly value={parser || ''} disabled={parser === null} />

                <button type="button" onClick={verify} disabled={canVerify === false}>
                    Verify
                </button>

                {/* eslint-disable-next-line  */}
                <a ref={linkRef} style={{ display: 'none' }} />

                <button type="button" onClick={download} disabled={canDownload === false}>
                    Download
                </button>
                <button type="button" onClick={submit} disabled={canSubmit === false}>
                    Submit
                </button>
            </form>
        </FormSection>
    );
}
