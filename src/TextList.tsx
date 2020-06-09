import React from 'react';
import * as Fuse from 'fuse.js';
import './TextList.css';

export function TextList({
    items,
    filter,
    onSelect
}: {
    items: string[];
    filter: string | null;
    onSelect: (value: string) => void;
}) {
    let matches = items;
    if (filter) {
        const fuse = new Fuse.default(items, { includeScore: true });
        const result = fuse.search(filter);

        matches = result
            .sort((a, b) => {
                if (a.score === undefined && b.score === undefined) {
                    return 0;
                } else if (a.score === undefined) {
                    return 1;
                } else if (b.score === undefined) {
                    return 1;
                } else if (a.score !== b.score) {
                    return a.score - b.score;
                } else {
                    return a.refIndex - b.refIndex;
                }
            })
            .map((result) => result.item);
    }

    return (
        <ul className="TextList">
            {matches.map((item: string, i: number) => (
                <li key={i} onClick={() => onSelect(item)}>
                    {item}
                </li>
            ))}
        </ul>
    );
}
