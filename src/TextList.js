import React from 'react';
import * as Fuse from 'fuse.js';

export function TextList({ items, filter, onSelect }) {
    let matches = items;
    if (filter) {
        const fuse = new Fuse.default(items, { includeScore: true });
        const result = fuse.search(filter);

        matches = result
            .sort((a, b) => {
                if (a.score !== b.score) {
                    return a.score - b.score;
                } else {
                    return a.refIndex - b.refIndex;
                }
            })
            .map((result) => result.item);
    }

    return (
        <ul className="TextList">
            {matches.map((item, i) => (
                <li key={i} onClick={() => onSelect(item)}>
                    {item}
                </li>
            ))}
        </ul>
    );
}
