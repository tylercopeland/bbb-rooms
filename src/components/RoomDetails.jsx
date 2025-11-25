import React, { useState, useEffect } from 'react';
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

export default function RoomDetails({ room, teacher, activeTab: propActiveTab, onTabChange, isScreenshareEnabled = false, sharedNotes: propSharedNotes, onSharedNotesChange, teacherRoomId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalActiveTab, setInternalActiveTab] = useState('presentation');
  const [internalSharedNotes, setInternalSharedNotes] = useState('');
  const sharedNotes = propSharedNotes !== undefined ? propSharedNotes : internalSharedNotes;
  const setSharedNotes = onSharedNotesChange || setInternalSharedNotes;
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalActiveTab;
  const setActiveTab = onTabChange || setInternalActiveTab;
  const participantsPerPage = 5;

  // If screenshare is disabled and we're on the screenshare tab, switch to presentation
  useEffect(() => {
    if (!isScreenshareEnabled && activeTab === 'screenshare') {
      setActiveTab('presentation');
    }
  }, [isScreenshareEnabled, activeTab, setActiveTab]);

  if (!room) {
    return null;
  }

  // Include teacher in the participant list if teacher exists
  const allParticipants = (teacher && teacherRoomId === room.id)
    ? [{ fullName: teacher.fullName, initials: teacher.initials, isTeacher: true }, ...room.participants]
    : room.participants;

  const totalPages = Math.ceil(allParticipants.length / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const endIndex = startIndex + participantsPerPage;
  const currentParticipants = allParticipants.slice(startIndex, endIndex);

  return (
    <div className="w-full h-full flex flex-col items-center min-h-0">
      {/* Video Grid */}
      {allParticipants.length > 0 && (
        <>
          <div className={`w-full flex flex-shrink-0 ${currentParticipants.length <= 3 ? 'justify-center' : ''} mb-4 mt-4`}>
            <div 
              className="grid gap-4"
              style={{ 
                gridTemplateColumns: currentParticipants.length <= 3
                  ? `repeat(${currentParticipants.length}, minmax(160px, 1fr))`
                  : 'repeat(5, minmax(160px, 1fr))',
                width: currentParticipants.length <= 3 ? 'auto' : '100%'
              }}
            >
            {currentParticipants.map((participant, index) => {
              const fullName = typeof participant === 'string' ? participant : participant.fullName || participant.name;
              const initials = typeof participant === 'object' && participant.initials 
                ? participant.initials 
                : getInitials(fullName);
              const isTeacher = participant.isTeacher || false;
              
              return (
                <div 
                  key={startIndex + index} 
                  className="h-32 bg-gray-100 border border-gray-300 rounded-lg flex flex-col items-center justify-start relative pt-3 pb-3 min-w-[160px] overflow-hidden"
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
            </div>
          </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mb-4 flex-shrink-0">
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
      
      {/* Tabs */}
      <div className="w-full max-w-4xl mt-2 mb-2 flex-shrink-0">
        <div className="flex border-b border-gray-300">
          <button
            onClick={() => setActiveTab('presentation')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'presentation'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Presentation
          </button>
          <button
            onClick={() => setActiveTab('shared-notes')}
            className={`px-4 py-2 text-xs font-medium transition-colors ${
              activeTab === 'shared-notes'
                ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Shared Notes
          </button>
          {isScreenshareEnabled && (
            <button
              onClick={() => setActiveTab('screenshare')}
              className={`px-4 py-2 text-xs font-medium transition-colors ${
                activeTab === 'screenshare'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-px'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Screenshare
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'presentation' && (
          <div className="w-full flex-1 min-h-0 flex items-center justify-center min-w-0 overflow-hidden">
            <Presentation title={`${room.name} Presentation`} />
          </div>
        )}
        {activeTab === 'screenshare' && (
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div className="absolute inset-0 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex flex-col items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-24 h-24 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {room.name} Screenshare
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'shared-notes' && (
          <div className="w-full flex-1 min-h-0 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl h-full flex items-center">
              <textarea
                value={sharedNotes}
                onChange={(e) => setSharedNotes(e.target.value)}
                placeholder="Write your notes here..."
                className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                style={{
                  aspectRatio: '16/9',
                  height: 'auto',
                  maxHeight: '100%'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

