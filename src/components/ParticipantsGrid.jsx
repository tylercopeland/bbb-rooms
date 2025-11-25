import React, { useState, useEffect, useRef } from 'react';
import UserAvatar from './UserAvatar';

function getInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return fullName.charAt(0).toUpperCase() + (fullName.length > 1 ? fullName.charAt(1) : '');
}

export default function ParticipantsGrid({ users = [], teacher = null }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isHovering, setIsHovering] = useState(false);
  const [participantsPerPage, setParticipantsPerPage] = useState(5);
  const containerRef = useRef(null);

  // Combine teacher and users, with teacher first
  const allParticipants = teacher
    ? [{ fullName: teacher.fullName, initials: teacher.initials, isTeacher: true }, ...users]
    : users;

  // Calculate how many avatars can fit based on container width
  useEffect(() => {
    const calculateParticipantsPerPage = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const avatarMinWidth = 160; // min-w-[160px]
      const gap = 16; // gap-4 = 16px
      const padding = 96; // px-12 = 48px on each side = 96px total
      const availableWidth = containerWidth - padding;
      
      // Calculate how many avatars can fit
      // Formula: (availableWidth + gap) / (avatarMinWidth + gap)
      const maxAvatars = Math.floor((availableWidth + gap) / (avatarMinWidth + gap));
      
      // Ensure at least 1 avatar per page, and cap at reasonable maximum
      const calculatedPerPage = Math.max(1, Math.min(maxAvatars, 10));
      
      setParticipantsPerPage(calculatedPerPage);
      
      // Reset to page 1 if current page would be out of bounds
      const totalPages = Math.ceil(allParticipants.length / calculatedPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(1);
      }
    };

    calculateParticipantsPerPage();
    
    const resizeObserver = new ResizeObserver(calculateParticipantsPerPage);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', calculateParticipantsPerPage);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateParticipantsPerPage);
    };
  }, [allParticipants.length, currentPage]);

  const totalPages = Math.ceil(allParticipants.length / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const endIndex = startIndex + participantsPerPage;
  const currentParticipants = allParticipants.slice(startIndex, endIndex);

  if (allParticipants.length === 0) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="w-full flex flex-col items-center mb-4 flex-shrink-0 relative px-12"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Video Grid with Floating Arrows */}
      <div className="w-full flex items-center justify-center relative overflow-visible">
        {/* Webcam Row */}
        <div className={`flex gap-4 justify-center relative w-full max-w-full ${currentParticipants.length <= 3 ? 'justify-center' : ''}`}>
          {/* Left Arrow - Positioned on top of leftmost webcam tile, only show on hover and when on page 2 or later */}
          {totalPages > 1 && currentPage > 1 && isHovering && (
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="absolute left-0 top-1/2 z-20 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {currentParticipants.map((participant, index) => {
            const fullName = typeof participant === 'string' ? participant : participant.fullName || participant.name;
            const initials = typeof participant === 'object' && participant.initials
              ? participant.initials
              : getInitials(fullName);
            const isTeacher = participant.isTeacher || false;

            return (
              <div
                key={startIndex + index}
                className="h-32 bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-start relative pt-3 pb-3 min-w-[160px] overflow-hidden flex-shrink-0"
              >
                {isTeacher ? (
                  <div className="w-16 h-16 rounded bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <span className="text-base font-medium">{initials}</span>
                  </div>
                ) : (
                  <UserAvatar
                    userName={fullName}
                    userInitial={initials}
                    size="lg"
                  />
                )}
                <span className="mt-3 text-xs text-gray-600 font-medium text-center px-2 break-words w-full leading-tight">{fullName}</span>
              </div>
            );
          })}
          
          {/* Right Arrow - Positioned on top of last webcam tile */}
          {totalPages > 1 && currentPage < totalPages && isHovering && (
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="absolute right-0 top-1/2 z-20 w-10 h-10 bg-white border border-gray-300 rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{ transform: 'translate(50%, -50%)' }}
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

