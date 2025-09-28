import { useEffect, useRef } from 'react';

const useAutoScroll = (dependency = []) => {
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [dependency]);

    return scrollRef;
};

export default useAutoScroll;