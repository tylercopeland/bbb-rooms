import React, { useState } from 'react';

export default function TeacherAvatar({ userName = 'Teacher', userInitial = 'T', size = 'sm' }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', userName);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const sizeClasses = size === 'sm' 
    ? 'w-8 h-8 text-xs' 
    : size === 'lg'
    ? 'w-16 h-16 text-base'
    : 'w-12 h-12 text-sm';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        ${sizeClasses} rounded
        bg-blue-500 text-white flex items-center justify-center
        cursor-move transition-all
        ${isDragging ? 'opacity-50 scale-90' : 'hover:scale-110'}
      `}
      title={`Teacher: ${userName}`}
    >
      <span className="font-medium">{userInitial}</span>
    </div>
  );
}

