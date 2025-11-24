import React, { useState } from 'react';
import Layout from './components/Layout';
import BreakoutRoomsGrid from './components/BreakoutRoomsGrid';
import Presentation from './components/Presentation';
import AvailableUsers from './components/AvailableUsers';
import RoomDetails from './components/RoomDetails';
import UserAvatar from './components/UserAvatar';

// Sample data with full names
const initialRooms = [
  {
    id: 1,
    name: 'Room Alpha',
    participants: [
      { fullName: 'Alice Anderson', initials: 'AA' },
      { fullName: 'Bob Brown', initials: 'BB' }
    ]
  },
  {
    id: 2,
    name: 'Room Beta',
    participants: [
      { fullName: 'Charlie Chen', initials: 'CC' }
    ]
  },
  {
    id: 3,
    name: 'Room Gamma',
    participants: [
      { fullName: 'Diana Davis', initials: 'DD' },
      { fullName: 'Eve Evans', initials: 'EE' },
      { fullName: 'Frank Foster', initials: 'FF' }
    ]
  },
  {
    id: 4,
    name: 'Room Delta',
    participants: []
  },
  {
    id: 5,
    name: 'Room Epsilon',
    participants: [
      { fullName: 'Grace Green', initials: 'GG' }
    ]
  }
];

const initialAvailableUsers = [
  { name: 'Hannah Harris', initial: 'HH' },
  { name: 'Ian Ingram', initial: 'II' },
  { name: 'Jack Johnson', initial: 'JJ' },
  { name: 'Kate Kelly', initial: 'KK' },
  { name: 'Liam Lee', initial: 'LL' }
];

const teacher = {
  name: 'Teacher',
  fullName: 'Teacher Name',
  initials: 'TN'
};

function App() {
  const [rooms, setRooms] = useState(initialRooms);
  const [availableUsers, setAvailableUsers] = useState(initialAvailableUsers);
  const [showBreakoutPanel, setShowBreakoutPanel] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const handleUserDrop = (roomId, userName) => {
    // Check if user is in available users
    const availableUser = availableUsers.find(u => u.name === userName);
    
    if (availableUser) {
      // Remove from available users
      setAvailableUsers(prev => prev.filter(u => u.name !== userName));
      
      // Add to target room
      const userObj = {
        fullName: availableUser.name,
        initials: availableUser.initial || getInitials(availableUser.name)
      };
      
      setRooms(prevRooms =>
        prevRooms.map(room => {
          if (room.id === roomId) {
            // Add user to target room if not already present
            const isPresent = room.participants.some(p => 
              (typeof p === 'string' ? p : p.fullName || p.name) === userName
            );
            if (!isPresent) {
              return {
                ...room,
                participants: [...room.participants, userObj]
              };
            }
            return room;
          } else {
            // Remove user from all other rooms
            return {
              ...room,
              participants: room.participants.filter(p => {
                const pName = typeof p === 'string' ? p : p.fullName || p.name;
                return pName !== userName;
              })
            };
          }
        })
      );
    } else {
      // User is being moved from another room
      setRooms(prevRooms => {
        let userToMove = null;
        const roomsWithoutUser = prevRooms.map(room => {
          const participant = room.participants.find(p => {
            const pName = typeof p === 'string' ? p : p.fullName || p.name;
            return pName === userName;
          });
          if (participant && room.id !== roomId) {
            userToMove = typeof participant === 'string' 
              ? { fullName: participant, initials: getInitials(participant) }
              : participant;
          }
          return {
            ...room,
            participants: room.participants.filter(p => {
              const pName = typeof p === 'string' ? p : p.fullName || p.name;
              return pName !== userName;
            })
          };
        });
        
        if (userToMove) {
          return roomsWithoutUser.map(room => {
            if (room.id === roomId) {
              const isPresent = room.participants.some(p => {
                const pName = typeof p === 'string' ? p : p.fullName || p.name;
                return pName === userName;
              });
              if (!isPresent) {
                return {
                  ...room,
                  participants: [...room.participants, userToMove]
                };
              }
            }
            return room;
          });
        }
        return roomsWithoutUser;
      });
    }
  };

  const getInitials = (fullName) => {
    if (!fullName) return '??';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.charAt(0).toUpperCase() + (fullName.length > 1 ? fullName.charAt(1) : '');
  };

  const handleUserRemoveFromRoom = (userName) => {
    // Add user back to available users if they're not already there
    setAvailableUsers(prev => {
      if (!prev.some(u => u.name === userName)) {
        const userInitial = getInitials(userName);
        return [...prev, { name: userName, initial: userInitial }];
      }
      return prev;
    });
  };

  const handleDropToAvailable = (userName) => {
    // Remove user from all rooms
    setRooms(prevRooms =>
      prevRooms.map(room => ({
        ...room,
        participants: room.participants.filter(p => {
          const pName = typeof p === 'string' ? p : p.fullName || p.name;
          return pName !== userName;
        })
      }))
    );

    // Add user back to available users
    handleUserRemoveFromRoom(userName);
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const breakoutRoomsContent = (panelWidth) => showBreakoutPanel ? (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800">
          Breakout Rooms
        </h2>
        <button
          onClick={() => setShowBreakoutPanel(false)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Close panel"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
          <AvailableUsers users={availableUsers} onDrop={handleDropToAvailable} teacher={selectedRoomId ? null : teacher} />
      <BreakoutRoomsGrid 
        rooms={rooms} 
        currentUser="You"
        onUserDrop={handleUserDrop}
        onUserRemove={handleUserRemoveFromRoom}
        onRoomClick={(roomId) => {
          // Toggle: if clicking the same room, deselect it
          setSelectedRoomId(prev => prev === roomId ? null : roomId);
        }}
        selectedRoomId={selectedRoomId}
        panelWidth={panelWidth}
        teacher={teacher}
      />
    </div>
  ) : null;

  return (
    <Layout 
      breakoutRoomsContent={breakoutRoomsContent}
      onToggleBreakoutPanel={() => setShowBreakoutPanel(!showBreakoutPanel)}
      selectedRoom={selectedRoom}
      onLeaveBreakoutRoom={() => setSelectedRoomId(null)}
    >
      <div className="h-full flex items-center justify-center p-6 w-full overflow-hidden">
        {selectedRoom ? (
          <RoomDetails room={selectedRoom} teacher={teacher} />
        ) : (
          <Presentation title="Presentation" />
        )}
      </div>
    </Layout>
  );
}

export default App;
