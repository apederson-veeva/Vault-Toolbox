import { useState, useEffect, useRef, useCallback } from 'react';

interface UseOverflowResizerProps {
    elementContent: string;
}

export default function useOverflowResizer({ elementContent }: UseOverflowResizerProps) {
    const overflowElementRef = useRef<HTMLDivElement>(null);
    const [isOverflown, setIsOverflown] = useState(false);

    /**
     * Check whether the element is overflow or not
     */
    const compareSize = useCallback(() => {
        const element = overflowElementRef.current;

        const elementIsOverflown = element ? element?.scrollHeight > element?.clientHeight : false;

        setIsOverflown(elementIsOverflown);
    }, [overflowElementRef]);

    // Whenever element content changes, check for overlow
    useEffect(() => {
        compareSize();
    }, [elementContent, compareSize]);

    useEffect(() => {
        const element = overflowElementRef.current;
        if (!element) {
            return; // Don't proceed if element isn't mounted yet
        }

        // Create a ResizeObserver instance that checks for overflow on size changes
        const resizeObserver = new ResizeObserver(() => {
            compareSize();
        });

        // Start observing the element
        resizeObserver.observe(element);

        return () => {
            resizeObserver.disconnect();
        };
    }, [compareSize]);

    return {
        overflowElementRef,
        isOverflown,
    };
}
