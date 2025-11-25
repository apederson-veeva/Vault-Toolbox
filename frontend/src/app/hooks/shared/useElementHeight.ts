import { useState, useEffect, useRef } from 'react';

/**
 * Calculates height of an element. Returns the height (pixels) and a ref.
 */
export default function useElementHeight() {
    const [elementHeight, setElementHeight] = useState(0);

    const elementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const calculateHeight = () => {
            if (elementRef.current) {
                setElementHeight(elementRef.current.offsetHeight);
            }
        };
        calculateHeight();
        window.addEventListener('resize', calculateHeight);
        return () => window.removeEventListener('resize', calculateHeight);
    }, []);

    return {
        elementHeight,
        elementRef,
    };
}
