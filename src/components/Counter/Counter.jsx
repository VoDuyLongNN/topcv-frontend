import React, { useState, useEffect } from 'react';

const Counter = ({ number }) => {
   const [count, setCount] = useState(0);

   useEffect(() => {
      const duration = 2000; 
      const increment = number / (duration / 10); 

      const counterInterval = setInterval(() => {
         setCount((prevCount) => {
            if (prevCount < number) {
               return Math.min(prevCount + increment, number);
            } else {
               clearInterval(counterInterval);
               return number;
            }
         });
      }, 10);

      return () => clearInterval(counterInterval);
   }, [number]);

   return (
      <span className='counter'>{Math.floor(count)}</span>
   );
};

export default Counter;
