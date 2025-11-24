import React, { useState } from 'react';
import UserAvatar from './UserAvatar';
import Presentation from './Presentation';

function getInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return fullName.charAt(0).toUpperCase() + (fullName.length > 1 ? fullName.charAt(1) : '');
}

export default function RoomDetails({ room, teacher }) {
  const [currentPage, setCurrentPage] = useState(1);
  const participantsPerPage = 5;

  if (!room) {
    return null;
  }

  // Include teacher in the participant list if teacher exists
  const allParticipants = teacher 
    ? [{ fullName: teacher.fullName, initials: teacher.initials, isTeacher: true }, ...room.participants]
    : room.participants;

  const totalPages = Math.ceil(allParticipants.length / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const endIndex = startIndex + participantsPerPage;
  const currentParticipants = allParticipants.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col items-center max-w-full overflow-hidden">
      {/* Video Grid */}
      {allParticipants.length > 0 && (
        <>
          <div className="w-full grid gap-4 mb-8 mt-8 max-w-full" style={{ gridTemplateColumns: `repeat(${Math.min(currentParticipants.length, 5)}, minmax(0, 1fr))` }}>
            {currentParticipants.map((participant, index) => {
              const fullName = typeof participant === 'string' ? participant : participant.fullName || participant.name;
              const initials = typeof participant === 'object' && participant.initials 
                ? participant.initials 
                : getInitials(fullName);
              const isTeacher = participant.isTeacher || false;
              
              return (
                <div 
                  key={startIndex + index} 
                  className="aspect-video bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-center relative pt-2 pb-2 min-w-0 overflow-hidden"
                >
                  {isTeacher ? (
                    <div className="w-16 h-16 rounded bg-blue-500 text-white flex items-center justify-center shadow-lg">
                      <span className="text-base font-medium">{initials}</span>
                    </div>
                  ) : (
                    <UserAvatar 
                      userName={fullName}
                      userInitial={initials}
                      size="lg"
                    />
                  )}
                  <span className="mt-2 text-xs text-gray-600 font-medium text-center px-1 pb-2 truncate w-full">{fullName}</span>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      
      {/* Presentation */}
      <Presentation title={`${room.name} Presentation`} />
    </div>
  );
}

