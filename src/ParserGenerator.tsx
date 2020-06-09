import React, { useState, useRef } from 'react';
import { FormSection } from './FormSection';
import { createParser } from './parser/createParser';
import { submitParser } from './parser/submitParser';
import { verifyParser } from './parser/verifyParser';
import { ImportedData } from './ImportData';
import { Parameter } from './ParametersConfiguration';

export function ParserGenerator({ data, parameters }: { data: ImportedData | null; parameters: Parameter[] }) {
    const [parser, setParser] = useState(null as (string | null));
    const linkRef = useRef();
    const canGenerate = data !== null && parameters.length > 0;
    const canVerify = data !== null && parameters.length > 0 && parser !== null;
    const canDownload = canVerify;
    const canSubmit = canVerify;

    function generate(event: React.MouseEvent) {
        event.preventDefault();

        if (data) {
            try {
                setParser(createParser(parameters));
            } catch (exception) {}
        }
    }

    async function verify(event: React.MouseEvent) {
        event.preventDefault();

        if (data && parser) {
            try {
                await verifyParser({ data, parameters, parser });
            } catch (exception) {}
        }
    }

    async function submit(event: React.MouseEvent) {
        event.preventDefault();

        if (data && parser) {
            try {
                await submitParser({ data, parameters, parser });
            } catch (exception) {}
        }
    }

    function download(event: React.MouseEvent) {
        event.preventDefault();

        if (parser) {
            const url = window.URL.createObjectURL(new Blob([parser], { type: 'application/javascript' }));
            linkRef.current.href = url;
            linkRef.current.download = 'parser.js';
            linkRef.current.click();
            window.URL.revokeObjectURL(url);
        }
    }

    function onParserChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        event.preventDefault();

        setParser(event.target.value);
    }

    return (
        <FormSection title="3. Get the parser">
            <form>
                {/*Prevent implicit submission of the form*/}
                <button type="submit" disabled style={{ display: 'none' }} aria-hidden="true" />

                <button type="button" onClick={generate} disabled={canGenerate === false}>
                    Generate
                </button>

                <textarea
                    value={parser || ''}
                    disabled={parser === null}
                    onChange={onParserChange}
                    style={{ minHeight: '110px' }}
                />

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
