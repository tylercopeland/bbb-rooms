import React, { useState } from 'react';
import DraggableAvatar from './DraggableAvatar';

export default function AvailableUsers({ users = [], onDrop }) {
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

  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
        Available Users
      </h3>
      <div 
        className={`flex flex-wrap gap-2 p-2 rounded transition-colors ${
          isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {users.map((user, index) => (
          <DraggableAvatar
            key={index}
            userName={user.name}
            userInitial={user.initial}
            size="md"
          />
        ))}
        {isDragOver && (
          <div className="text-xs text-gray-400 italic w-full text-center py-2">
            Drop users here
          </div>
        )}
      </div>
    </div>
  );
}

