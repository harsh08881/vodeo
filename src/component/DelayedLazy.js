import React, { useState, useEffect } from 'react';
import LazyLoadSpinner from './Lazyload';

const DelayedLazyLoader = ({ children, delay = 5000 }) => {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChildren(true);
    }, delay); // Delay in milliseconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [delay]);

  return showChildren ? children : <LazyLoadSpinner />;
};

export default DelayedLazyLoader;
