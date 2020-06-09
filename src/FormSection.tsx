import React, { useRef } from 'react';
import './FormSection.css';

export function FormSection({
    title,
    isDragging,
    onIsDraggingChanged,
    onDrop,
    children
}: {
    title: string;
    isDragging?: boolean;
    onIsDraggingChanged?: (isDragging: boolean) => void;
    onDrop?: (data: DataTransfer) => void;
    children: React.ReactNode;
}) {
    const sectionRef = useRef();

    function onDragEnter(event: React.DragEvent<HTMLElement>) {
        if (onIsDraggingChanged) {
            onIsDraggingChanged(true);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    function onDragOver(event: React.DragEvent<HTMLElement>) {
        event.preventDefault();
        event.stopPropagation();
    }

    function onDragLeave(event: React.DragEvent<HTMLElement>) {
        if (onIsDraggingChanged && event.target === sectionRef.current) {
            onIsDraggingChanged(false);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    function onInnerDrop(event: React.DragEvent<HTMLElement>) {
        if (onIsDraggingChanged && onDrop) {
            onIsDraggingChanged(false);

            onDrop(event.dataTransfer);

            event.preventDefault();
            event.stopPropagation();
        }
    }

    return (
        <section
            ref={sectionRef}
            onDragEnter={onIsDraggingChanged ? onDragEnter : undefined}
            onDragOver={onIsDraggingChanged ? onDragOver : undefined}
            onDragLeave={onIsDraggingChanged ? onDragLeave : undefined}
            onDrop={onIsDraggingChanged ? onInnerDrop : undefined}
            className={`FormSection ${isDragging ? 'is-dragging' : ''}`}
        >
            <h2>{title}</h2>
            {children}
        </section>
    );
}
