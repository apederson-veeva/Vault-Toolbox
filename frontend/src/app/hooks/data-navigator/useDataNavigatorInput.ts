import { KeyboardEvent, useEffect, useRef } from 'react';

interface UseDataNavigatorInputProps {
    userInput: string;
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
}

export default function useDataNavigatorInput({ userInput, getRecordData }: UseDataNavigatorInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && userInput) {
            getRecordData({});
        }
    };

    /*
        Put initial focus in the input on page load
     */
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return {
        inputRef,
        handleEnterKeyDown,
    };
}
