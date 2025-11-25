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
    participants: [],
    hasActivity: false // Example: No activity
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
  const [showUsersPanel, setShowUsersPanel] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [activeTab, setActiveTab] = useState('presentation');
  const [isScreenshareEnabled, setIsScreenshareEnabled] = useState(false);
  const [roomNotes, setRoomNotes] = useState({}); // Store notes per room: { roomId: notes }
  const [teacherRoomId, setTeacherRoomId] = useState(null); // Track which room the teacher is in

  const handleUserDrop = (roomId, userName) => {
    // Check if the dragged user is the teacher
    const isTeacher = userName === teacher.fullName;
    
    // Check if user is in available users
    const availableUser = availableUsers.find(u => u.name === userName);
    
    if (isTeacher) {
      // Teacher is being moved to the target room
      setTeacherRoomId(roomId);
      // Also select the room when teacher is dragged to it
      setSelectedRoomId(roomId);
    } else if (availableUser) {
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
    // Check if the dropped user is the teacher
    const isTeacher = userName === teacher.fullName;
    
    if (isTeacher) {
      // Move teacher back to available (no room)
      setTeacherRoomId(null);
    } else {
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
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  // Get all users (available + in rooms + teacher)
  const getAllUsers = () => {
    const users = [];
    
    // Add teacher
    if (teacher) {
      users.push({
        fullName: teacher.fullName,
        initials: teacher.initials,
        isTeacher: true
      });
    }
    
    // Add available users
    availableUsers.forEach(user => {
      users.push({
        fullName: user.name,
        initials: user.initial || getInitials(user.name)
      });
    });
    
    // Add users from all rooms
    rooms.forEach(room => {
      room.participants.forEach(participant => {
        const fullName = typeof participant === 'string' ? participant : participant.fullName || participant.name;
        const initials = typeof participant === 'object' && participant.initials 
          ? participant.initials 
          : getInitials(fullName);
        
        // Check if user already exists
        if (!users.some(u => u.fullName === fullName)) {
          users.push({ fullName, initials });
        }
      });
    });
    
    return users;
  };

  const usersContent = (panelWidth) => showUsersPanel ? (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800">
          Users
        </h2>
        <button
          onClick={() => setShowUsersPanel(false)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Close panel"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {getAllUsers().map((user, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded transition-colors">
            {user.isTeacher ? (
              <div className="w-10 h-10 rounded bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium">{user.initials}</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium">{user.initials}</span>
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">{user.fullName}</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const breakoutRoomsContent = (panelWidth) => showBreakoutPanel ? (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-800">
          Huddles
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
          <AvailableUsers users={availableUsers} onDrop={handleDropToAvailable} teacher={teacherRoomId === null ? teacher : null} />
      <BreakoutRoomsGrid 
        rooms={rooms} 
        currentUser="You"
        onUserDrop={handleUserDrop}
        onUserRemove={handleUserRemoveFromRoom}
        onRoomClick={(roomId) => {
          // Move teacher to the clicked room
          setTeacherRoomId(roomId);
          // Toggle: if clicking the same room, deselect it
          setSelectedRoomId(prev => prev === roomId ? null : roomId);
        }}
        selectedRoomId={selectedRoomId}
        panelWidth={panelWidth}
        teacher={teacher}
        activeTab={selectedRoomId ? activeTab : null}
        roomNotes={roomNotes}
        teacherRoomId={teacherRoomId}
      />
    </div>
  ) : null;

  return (
    <Layout 
      breakoutRoomsContent={breakoutRoomsContent}
      showBreakoutPanel={showBreakoutPanel}
      onToggleBreakoutPanel={() => {
        setShowBreakoutPanel(!showBreakoutPanel);
        if (!showBreakoutPanel) {
          setShowUsersPanel(false); // Close users when opening huddles
        }
      }}
      usersContent={usersContent}
      showUsersPanel={showUsersPanel}
      onToggleUsersPanel={() => {
        setShowUsersPanel(!showUsersPanel);
        if (!showUsersPanel) {
          setShowBreakoutPanel(false); // Close huddles when opening users
        }
      }}
      selectedRoom={selectedRoom}
      onLeaveBreakoutRoom={() => setSelectedRoomId(null)}
      isScreenshareEnabled={isScreenshareEnabled}
      setIsScreenshareEnabled={setIsScreenshareEnabled}
    >
      <div className={`h-full flex justify-center w-full min-h-0 ${selectedRoom ? 'overflow-hidden items-start' : 'overflow-hidden items-center'}`}>
        {selectedRoom ? (
          <RoomDetails 
            room={selectedRoom} 
            teacher={teacher} 
            activeTab={activeTab} 
            onTabChange={(tab) => {
              // If screenshare is disabled and user tries to switch to screenshare, switch to presentation instead
              if (tab === 'screenshare' && !isScreenshareEnabled) {
                setActiveTab('presentation');
              } else {
                setActiveTab(tab);
              }
            }}
            isScreenshareEnabled={isScreenshareEnabled}
            sharedNotes={roomNotes[selectedRoomId] || ''}
            onSharedNotesChange={(notes) => {
              setRoomNotes(prev => ({
                ...prev,
                [selectedRoomId]: notes
              }));
            }}
            teacherRoomId={teacherRoomId}
          />
        ) : (
          <Presentation title="Presentation" />
        )}
      </div>
    </Layout>
  );
}

export default App;
