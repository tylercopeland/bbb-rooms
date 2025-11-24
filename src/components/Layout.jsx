import React, { useState, useRef } from 'react';
import MeetingControls from './MeetingControls';

export default function Layout({ children, breakoutRoomsContent, onToggleBreakoutPanel, selectedRoom, onLeaveBreakoutRoom }) {
  const [sidebarWidth, setSidebarWidth] = useState(64); // Thin sidebar with icons
  const [breakoutPanelWidth, setBreakoutPanelWidth] = useState(320); // 80 * 4 = 320px (w-80)
  
  const isResizingSidebar = useRef(false);
  const isResizingBreakout = useRef(false);
  const breakoutResizeStartX = useRef(0);
  const breakoutResizeStartWidth = useRef(0);
  const sidebarResizeStartX = useRef(0);
  const sidebarResizeStartWidth = useRef(0);

  const handleMouseMove = (e) => {
      if (isResizingSidebar.current) {
        const deltaX = e.clientX - sidebarResizeStartX.current;
        const newWidth = sidebarResizeStartWidth.current + deltaX;
        if (newWidth >= 64 && newWidth <= 200) {
          setSidebarWidth(newWidth);
        }
      }
    if (isResizingBreakout.current) {
      const deltaX = e.clientX - breakoutResizeStartX.current;
      const newWidth = breakoutResizeStartWidth.current + deltaX;
      if (newWidth >= 250 && newWidth <= 600) {
        setBreakoutPanelWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    isResizingSidebar.current = false;
    isResizingBreakout.current = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleSidebarResizeStart = (e) => {
    e.preventDefault();
    isResizingSidebar.current = true;
    sidebarResizeStartX.current = e.clientX;
    sidebarResizeStartWidth.current = sidebarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleBreakoutResizeStart = (e) => {
    e.preventDefault();
    isResizingBreakout.current = true;
    breakoutResizeStartX.current = e.clientX;
    breakoutResizeStartWidth.current = breakoutPanelWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside 
        className="bg-white border-r border-gray-200 flex flex-col items-center py-4 flex-shrink-0"
        style={{ width: `${sidebarWidth}px` }}
      >
        <div className="flex flex-col items-center space-y-6">
          {/* Users Icon */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Users">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          
          {/* Chat Icon */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Chat">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          {/* Breakout Rooms Icon */}
          <button 
            className={`p-2 rounded transition-colors ${
              breakoutRoomsContent 
                ? 'bg-blue-100 hover:bg-blue-200' 
                : 'hover:bg-gray-100'
            }`} 
            title="Breakout Rooms"
            onClick={onToggleBreakoutPanel}
          >
            <svg 
              className={`w-6 h-6 ${
                breakoutRoomsContent 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          {/* Notes Icon */}
          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Notes">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Sidebar Resize Handle */}
      <div
        onMouseDown={handleSidebarResizeStart}
        className="w-0.5 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors"
      />

      {/* Breakout Rooms Panel */}
      {breakoutRoomsContent && (
        <>
          {/* Breakout Rooms Panel */}
          <aside 
            className="bg-white border-r border-gray-200 flex flex-col flex-shrink-0"
            style={{ width: `${breakoutPanelWidth}px` }}
          >
            <div className="flex-1 overflow-auto p-6">
              {typeof breakoutRoomsContent === 'function' ? breakoutRoomsContent(breakoutPanelWidth) : breakoutRoomsContent}
            </div>
          </aside>

          {/* Breakout Panel Resize Handle */}
          <div
            onMouseDown={handleBreakoutResizeStart}
            className="w-0.5 bg-gray-200 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors"
          />
        </>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <header className="h-16 px-6 flex items-center justify-center flex-shrink-0 relative">
          <div className="text-sm font-medium text-gray-700">
            {selectedRoom ? selectedRoom.name : 'Meeting Actions'}
          </div>
          {selectedRoom && (
            <button
              onClick={onLeaveBreakoutRoom}
              className="absolute right-6 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            >
              Leave
            </button>
          )}
        </header>

        {/* Center Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>

        {/* Meeting Controls */}
        <div className="flex-shrink-0">
          <MeetingControls />
        </div>
      </div>
    </div>
  );
}

