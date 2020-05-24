import React, { useState, useEffect } from 'react';

export const DestinationOptionsContext = React.createContext();

export function DestinationOptions({ children }) {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
