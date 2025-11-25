import { useEffect, useState } from 'react';
import { useIdleTimer as useReactIdleTimer } from 'react-idle-timer';

const TIMEOUT_STATES = {
    IDLE: 'Idle',
    PROMPT: 'Prompt',
    ACTIVE: 'Active',
};

const TIMEOUT = 1_800_000; // Idle after 30 min
const PROMPT_BEFORE_TIMEOUT = 60_000; // Prompt 60 seconds before timeout

export default function useIdleTimer() {
    const [timeoutState, setTimeoutState] = useState(TIMEOUT_STATES.ACTIVE);
    const [remainingTime, setRemainingTime] = useState(TIMEOUT);
    const [promptOpen, setPromptOpen] = useState(false);

    const { activate, getRemainingTime } = useReactIdleTimer({
        timeout: TIMEOUT,
        promptBeforeIdle: PROMPT_BEFORE_TIMEOUT,
        onIdle: () => {
            setTimeoutState(TIMEOUT_STATES.IDLE);
            setPromptOpen(false);
        },
        onActive: () => {
            setTimeoutState(TIMEOUT_STATES.ACTIVE);
            setPromptOpen(false);
        },
        onPrompt: () => {
            setTimeoutState(TIMEOUT_STATES.PROMPT);
            setPromptOpen(true);
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime(Math.ceil(getRemainingTime() / 1000));
        }, 500);

        return () => {
            clearInterval(interval);
        };
    });

    return { timeoutState, promptOpen, remainingTime, activate };
}
