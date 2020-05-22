import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import { createParser } from './createParser';

export function ParserGenerator({ data, parameters }) {
    const [parser, setParser] = useState(null);
    const linkRef = useRef();

    function generate(event) {
        event.preventDefault();

        setParser(createParser(data, parameters));
    }

    function download(event) {
        event.preventDefault();

        const url = window.URL.createObjectURL(new Blob([parser], { type: 'text/plain' }));
        linkRef.current.href = url;
        linkRef.current.download = 'parser.txt';
        linkRef.current.click();
        window.URL.revokeObjectURL(url);
    }

    return (
        <FormSection title="3. Get the parser">
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <button onClick={generate}>Generate</button>

                <textarea readOnly value={parser || ''} />

                {/* eslint-disable-next-line  */}
                <a ref={linkRef} style={{ display: 'none' }} />

                <button onClick={download}>Download</button>
            </form>
        </FormSection>
    );
}
