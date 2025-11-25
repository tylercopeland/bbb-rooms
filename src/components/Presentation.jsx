import React from 'react';

export default function Presentation({ title = 'Presentation' }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-6 min-w-0 min-h-0 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center min-h-0 min-w-0 max-w-full max-h-full">
        {/* 16:9 Aspect Ratio Container - Scales to fit available space */}
        <div 
          className="bg-gray-100 border border-gray-300 rounded-lg overflow-hidden flex flex-col items-center justify-center"
          style={{ 
            aspectRatio: '16/9',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            height: 'auto',
            minHeight: 0,
            minWidth: 0
          }}
        >
          {/* Placeholder content */}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {/* Title below icon */}
            <h2 className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

