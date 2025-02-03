import { useState, useEffect } from "react";
import './progress.css'

const LoadingProgressBar = () => {
    const [progress, setProgress] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      progress < 100 && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )
    );
  };


  export default LoadingProgressBar