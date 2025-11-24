import React, { useState } from 'react';
import DraggableAvatar from './DraggableAvatar';

export default function BreakoutRoomTile({ 
  roomId,
  roomName, 
  participants = [], 
  onDrop,
  onUserRemove,
  onClick,
  isSelected,
  isDraggingOver 
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const userName = e.dataTransfer.getData('text/plain');
    if (onDrop) {
      onDrop(userName);
    }
  };

  const handleClick = (e) => {
    // Don't trigger click if clicking on drag/drop area or avatars
    if (e.target.closest('[draggable="true"]')) {
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  const showDropZone = isDragOver || isDraggingOver;

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        bg-white border-2 rounded-lg p-4 w-full
        transition-all cursor-pointer min-w-0
        ${isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : showDropZone 
            ? 'border-blue-400 bg-blue-50 shadow-md' 
            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
        }
      `}
    >
      {/* Room Name */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-700 truncate flex-1">
          {roomName.replace('Room ', '')}
        </h3>
        {isSelected && (
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>

      {/* Presentation Thumbnail */}
      <div className="mb-3 w-full aspect-video bg-gray-100 border border-gray-200 rounded overflow-hidden flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg 
            className="w-12 h-12 mx-auto mb-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
            />
          </svg>
          <p className="text-xs">Presentation</p>
        </div>
      </div>

      {/* Participants */}
      {participants.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {participants.map((participant, index) => {
            const fullName = typeof participant === 'string' ? participant : participant.fullName || participant.name;
            const initials = typeof participant === 'object' && participant.initials 
              ? participant.initials 
              : null;
            
            return (
              <DraggableAvatar 
                key={index}
                userName={fullName} 
                userInitial={initials}
                size="sm"
              />
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-gray-500 text-center">No participants</p>
      )}

      {/* Drop Zone Indicator */}
      {showDropZone && (
        <div className="mt-3 pt-3 border-t border-blue-300">
          <div className="text-xs text-blue-600 font-medium text-center">
            Drop here to join
          </div>
        </div>
      )}
    </div>
  );
}

