import { useState, useEffect, RefObject } from 'react';

interface UseRemainingHeightProps {
    refs: Array<RefObject<any>>;
    totalHeight: number;
    padding: number;
}

/**
 * Calculates remaining height after subtracting heights of referenced elements.
 *
 * @param {React.RefObject[]} refs - Array of refs to elements whose heights should be subtracted
 * @param {number} totalHeight - Total height of the container (pixels)
 * @param {number} padding - Additional padding to subtract from final height
 * @returns {number} Remaining height in pixels
 */
export default function useRemainingHeight({ refs = [], totalHeight, padding = 0 }: UseRemainingHeightProps): number {
    const [remainingHeight, setRemainingHeight] = useState(0);

    useEffect(() => {
        const calculateRemainingHeight = () => {
            // Sum up heights of all provided refs
            const usedHeight = refs.reduce((sum, ref) => {
                return sum + (ref.current?.offsetHeight || 0);
            }, 0);

            // Calculate remaining height
            const calculatedHeight = totalHeight - usedHeight - padding;
            setRemainingHeight(calculatedHeight);
        };

        // Initial calculation
        calculateRemainingHeight();

        // Recalculate on window resize
        window.addEventListener('resize', calculateRemainingHeight);
        return () => window.removeEventListener('resize', calculateRemainingHeight);
    }, [refs, totalHeight, padding]);

    return remainingHeight;
}
