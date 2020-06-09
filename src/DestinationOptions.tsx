import React, { useState, useEffect, ReactNode } from 'react';

export interface DestinationOptions {
    data: string[];
    isLoading: boolean;
    error: string | null;
}

export const DestinationOptionsContext = React.createContext({
    data: [],
    isLoading: false,
    error: null
} as DestinationOptions);

export function DestinationOptions({ children }: { children: ReactNode }) {
    const [data, setData] = useState([] as string[]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null as (string | null));

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);

            try {
                const result = await fetch('/destinations');
                if (result.ok) {
                    const text = await result.text();
                    const parsedText = text
                        .split('\n')
                        .map((str) => str.trim())
                        .filter((str) => str !== '')
                        .sort();

                    setData(parsedText);
                } else {
                    setError(`${result.statusText}`);
                }
            } catch (exception) {
                setError(exception.message);
            }

            setIsLoading(false);
        }

        fetchData();
    }, []);

    return (
        <DestinationOptionsContext.Provider value={{ data, isLoading, error }}>
            {children}
        </DestinationOptionsContext.Provider>
    );
}
