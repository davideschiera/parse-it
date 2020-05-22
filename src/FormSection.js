import React, { useRef } from 'react';

export function FormSection({ title, isDragging, onIsDraggingChanged, onDrop, children }) {
    const sectionRef = useRef();

    function onDragEnter(event) {
        onIsDraggingChanged(true);

        event.preventDefault();
        event.stopPropagation();
    }

    function onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function onDragLeave(event) {
        if (event.target === sectionRef.current) {
            onIsDraggingChanged(false);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    function onInnerDrop(event) {
        onIsDraggingChanged(false);

        onDrop(event.dataTransfer);

        event.preventDefault();
        event.stopPropagation();
    }
    return (
        <section
            ref={sectionRef}
            onDragEnter={onIsDraggingChanged ? onDragEnter : undefined}
            onDragOver={onIsDraggingChanged ? onDragOver : undefined}
            onDragLeave={onIsDraggingChanged ? onDragLeave : undefined}
            onDrop={onIsDraggingChanged ? onInnerDrop : undefined}
            className={isDragging ? 'is-dragging' : null}
        >
            <h2>{title}</h2>
            {children}
        </section>
    );
}
