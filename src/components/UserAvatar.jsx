import React from 'react';

function getInitials(fullName) {
  if (!fullName) return '??';
  const parts = fullName.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return fullName.charAt(0).toUpperCase() + (fullName.length > 1 ? fullName.charAt(1) : '');
}

export default function UserAvatar({ userName, userInitial, size = 'md' }) {
  const initials = userInitial || getInitials(userName);
  
  const sizeClasses = size === 'sm' 
    ? 'w-8 h-8 text-xs' 
    : size === 'lg'
    ? 'w-16 h-16 text-base'
    : 'w-12 h-12 text-sm';

  return (
    <div
      className={`
        ${sizeClasses} rounded-full 
        bg-blue-500 text-white flex items-center justify-center
        flex-shrink-0
      `}
    >
      <span className="font-medium">{initials}</span>
    </div>
  );
}

