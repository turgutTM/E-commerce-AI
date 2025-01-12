import React, { useEffect } from "react";
import { gsap } from "gsap";

const TuguAnimation = () => {
  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1 });
    
  
    timeline.fromTo(
      "#pathT",
      { strokeDashoffset: 100 },
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      }
    );

    timeline.fromTo(
      "#pathU1",
      { strokeDashoffset: 150 },
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "<0.3" 
    );


    timeline.fromTo(
      "#pathG",
      { strokeDashoffset: 200 },
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "<0.3"
    );

  
    timeline.fromTo(
      "#pathU2",
      { strokeDashoffset: 150 },
      {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "<0.3"
    );
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        className="w-[400px] h-auto"
      >
    
        <defs>
          <linearGradient
            id="gradientStroke"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ff2b57" />
            <stop offset="50%" stopColor="#e70fad" />
            <stop offset="100%" stopColor="#8e44ad" />
          </linearGradient>

        
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodColor="#e70fad"
              floodOpacity="0.7"
            />
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="10"
              floodColor="#ff2b57"
              floodOpacity="0.5"
            />
          </filter>
        </defs>

      
        <path
          id="pathT"
          d="M50 50 L150 50 M100 50 L100 100"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="100"
          strokeDashoffset="100"
        
        />

       
        <path
          id="pathU1"
          d="M180 50 C180 100, 220 100, 220 50"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="150"
          strokeDashoffset="150"
        
        />

     
        <path
          id="pathG"
          d="M250 50 A40 40 0 1 0 330 50 L310 50"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset="200"
       
        />

     
        <path
          id="pathU2"
          d="M360 50 C360 100, 400 100, 400 50"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          fill="none"
          strokeDasharray="150"
          strokeDashoffset="150"
      
        />
      </svg>
    </div>
  );
};

export default TuguAnimation;
