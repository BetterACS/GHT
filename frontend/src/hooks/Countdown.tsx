import { useEffect, useState } from 'react';

function useCountdown() {
    const [timeoutSeconds, setTimeoutSeconds] = useState(0);

    useEffect(() => {
        if (timeoutSeconds <= 0) return;

        const timeOut = setTimeout(() => {
            setTimeoutSeconds(timeoutSeconds - 1);
        }, 1000);
        
        return () => clearTimeout(timeOut);
    }, [timeoutSeconds]);

    function start(seconds: number) {
        setTimeoutSeconds(seconds);
    }

    return {
        timeoutSeconds,
        start
    }
}

export default useCountdown;