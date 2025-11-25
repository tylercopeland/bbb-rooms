import React from 'react';
import BreakoutRoomTile from './BreakoutRoomTile';

export default function BreakoutRoomsGrid({ rooms, currentUser, onUserDrop, onUserRemove, onRoomClick, selectedRoomId, panelWidth = 320, teacher, activeTab, roomNotes, teacherRoomId }) {
  // Show 2 columns when panel width is 400px or larger
  const showTwoColumns = panelWidth >= 400;
  
  return (
    <div className={`grid gap-4 w-full ${showTwoColumns ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {rooms.map(room => (
        <BreakoutRoomTile
          key={room.id}
          roomId={room.id}
          roomName={room.name}
          participants={room.participants}
          onDrop={(userName) => onUserDrop(room.id, userName)}
          onUserRemove={onUserRemove}
          onClick={() => onRoomClick && onRoomClick(room.id)}
          isSelected={selectedRoomId === room.id}
          teacher={teacher}
          showTeacher={teacherRoomId === room.id}
          activeTab={selectedRoomId === room.id ? activeTab : null}
          hasActivity={room.hasActivity !== false}
          sharedNotes={selectedRoomId === room.id && activeTab === 'shared-notes' ? (roomNotes && roomNotes[room.id] || '') : null}
        />
      ))}
    </div>
  );
}

