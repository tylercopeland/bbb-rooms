import React, { useState } from 'react';

export default function DraggableAvatar({ userName = 'You', userInitial, fixed = false, size = 'md' }) {
  // Generate initials from full name if not provided
  const getInitials = (name) => {
    if (userInitial) return userInitial;
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase() + (name.length > 1 ? name.charAt(1) : '');
  };

  const initials = userInitial || getInitials(userName);
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

  const baseClasses = `
    ${sizeClasses} rounded-full 
    bg-blue-500 text-white flex items-center justify-center
    cursor-move transition-all
    ${isDragging ? 'opacity-50 scale-90' : 'hover:scale-110'}
  `;

  const positionClasses = fixed 
    ? 'fixed bottom-6 right-6' 
    : '';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`${baseClasses} ${positionClasses}`}
      title={`Drag to join a room`}
    >
      <span className="font-medium">{initials}</span>
    </div>
  );
}

