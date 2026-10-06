"use client";

import React, { useRef, useEffect, useState } from "react";
import "./MembershipCard.css";

interface MembershipCardProps {
  member: {
    name: string;
    profilePhoto?: string | null;
    memberId: string;
    membershipType?: string;
  };
  animateEntrance?: boolean;
}

export function MembershipCard({ member, animateEntrance = false }: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is touch/mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    
    // Calculate mouse position relative to card center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation limits (subtle 3D effect)
    const rotateX = -(y / rect.height) * 3;
    const rotateY = (x / rect.width) * 3;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (isMobile || !cardRef.current) return;
    const card = cardRef.current;
    card.style.transform = "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div className={`card-reveal-container flex items-center justify-center p-4 w-full h-full`}>
      <div 
        ref={cardRef}
        className={`eclipse-id-card ${animateEntrance ? 'card-animate-entrance' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: "preserve-3d"
        }}
      >




        {/* Member Information */}
        <div className="member-info-section">
          <div className="member-name">{member.name || "ECLIPSE MEMBER"}</div>
          <div className="member-id">Id No.: {member.memberId || "PENDING"}</div>
        </div>


      </div>
    </div>
  );
}
