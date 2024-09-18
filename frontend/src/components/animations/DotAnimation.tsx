import { useState, useEffect } from 'react';

const DotAnimation = () => {
    // State to track the number of dots
    const [dotCount, setDotCount] = useState(0);

    // Effect hook to update the dot count every 1 second
    useEffect(() => {
        const interval = setInterval(() => {
            setDotCount((prevCount) => (prevCount + 1) % 4); // Reset after 3 dots
        }, 500);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Generate the dots based on the current state
    const dots = '.'.repeat(dotCount);
    const emptyDots = '.'.repeat(3 - dotCount);

    return (
        <>
            <span>{dots}</span>
            <span className='text-emerald-200'>{emptyDots}</span>
        </>
    );
};

export default DotAnimation;
