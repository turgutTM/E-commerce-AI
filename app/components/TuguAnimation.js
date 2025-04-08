import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const TuguAnimation = () => {
  const svgRef = useRef(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    
    // Reset any previous animations
    gsap.set([
      "#pathT", 
      "#pathU1", 
      "#pathG", 
      "#pathU2",
      "#circleDot1",
      "#circleDot2",
      "#circleDot3",
      "#circleDot4"
    ], { clearProps: "all" });

    // Main timeline
    const mainTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    
    // Drawing animation
    const drawingTimeline = gsap.timeline();
    
    // T animation
    drawingTimeline.fromTo(
      "#pathT",
      { 
        strokeDasharray: 250,
        strokeDashoffset: 250,
        opacity: 0.2 
      },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      }
    );
    
    // U1 animation
    drawingTimeline.fromTo(
      "#pathU1",
      { 
        strokeDasharray: 150,
        strokeDashoffset: 150,
        opacity: 0.2 
      },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.inOut",
      },
      "-=0.7"
    );
    
    // G animation
    drawingTimeline.fromTo(
      "#pathG",
      { 
        strokeDasharray: 200,
        strokeDashoffset: 200,
        opacity: 0.2 
      },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.inOut",
      },
      "-=0.7"
    );
    
    // U2 animation
    drawingTimeline.fromTo(
      "#pathU2",
      { 
        strokeDasharray: 150,
        strokeDashoffset: 150,
        opacity: 0.2 
      },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.inOut",
      },
      "-=0.7"
    );
    
    // Dots appear
    drawingTimeline.fromTo(
      ["#circleDot1", "#circleDot2", "#circleDot3", "#circleDot4"],
      { 
        scale: 0,
        opacity: 0
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)",
      }
    );
    
    // Pulse animation for the entire logo
    const pulseTimeline = gsap.timeline({repeat: 2});
    
    pulseTimeline.to([
      "#pathT", 
      "#pathU1", 
      "#pathG", 
      "#pathU2"
    ], {
      strokeWidth: 5,
      filter: "url(#glow)",
      duration: 0.5,
      ease: "sine.inOut"
    })
    .to([
      "#pathT", 
      "#pathU1", 
      "#pathG", 
      "#pathU2"
    ], {
      strokeWidth: 3,
      filter: "none",
      duration: 0.5,
      ease: "sine.inOut"
    });
    
    // Dot animation
    const dotTimeline = gsap.timeline();
    
    dotTimeline.to([
      "#circleDot1", 
      "#circleDot2", 
      "#circleDot3", 
      "#circleDot4"
    ], {
      y: -10,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    })
    .to([
      "#circleDot1", 
      "#circleDot2", 
      "#circleDot3", 
      "#circleDot4"
    ], {
      y: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.in"
    });
    
    // Fade out
    const fadeOutTimeline = gsap.timeline();
    fadeOutTimeline.to([
      "#pathT", 
      "#pathU1", 
      "#pathG", 
      "#pathU2",
      "#circleDot1",
      "#circleDot2",
      "#circleDot3",
      "#circleDot4"
    ], {
      opacity: 0.2,
      duration: 0.8,
      ease: "power2.in"
    });
    
    // Add all timelines to main timeline
    mainTimeline
      .add(drawingTimeline)
      .add(pulseTimeline, "+=0.2")
      .add(dotTimeline, "+=0.1")
      .add(fadeOutTimeline, "+=0.5");
    
    return () => {
      mainTimeline.kill();
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 150"
        className="w-[300px] md:w-[400px] h-auto"
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
          
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ff2b57" />
            <stop offset="100%" stopColor="#e70fad" />
          </radialGradient>
          
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor="#e70fad" floodOpacity="0.7" result="glow1" />
            <feComposite in="glow1" in2="blur" operator="in" result="softGlow" />
            <feFlood floodColor="#ff2b57" floodOpacity="0.5" result="glow2" />
            <feComposite in="glow2" in2="blur" operator="in" result="softGlow2" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="softGlow2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* T letter */}
        <path
          id="pathT"
          d="M50 50 L150 50 M100 50 L100 100"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* U1 letter */}
        <path
          id="pathU1"
          d="M180 50 L180 85 Q180 100 197.5 100 Q215 100 215 85 L215 50"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* G letter */}
        <path
          id="pathG"
          d="M290 75 Q290 50 265 50 Q240 50 240 75 Q240 100 265 100 Q290 100 290 75 L290 85 L265 85"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* U2 letter */}
        <path
          id="pathU2"
          d="M315 50 L315 85 Q315 100 332.5 100 Q350 100 350 85 L350 50"
          stroke="url(#gradientStroke)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Decorative dots */}
        <circle
          id="circleDot1"
          cx="380"
          cy="65"
          r="6"
          fill="url(#dotGradient)"
        />
        <circle
          id="circleDot2"
          cx="400"
          cy="65"
          r="6"
          fill="url(#dotGradient)"
        />
        <circle
          id="circleDot3"
          cx="420"
          cy="65"
          r="6"
          fill="url(#dotGradient)"
        />
        <circle
          id="circleDot4"
          cx="440"
          cy="65"
          r="6"
          fill="url(#dotGradient)"
        />
      </svg>
    </div>
  );
};

export default TuguAnimation;