import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import type { Connection, ConnectionRequest, UserSearchResult } from '../types';

interface ConnectionContextType {
  connections: Connection[];
  connectionRequests: ConnectionRequest[];
  sentRequests: ConnectionRequest[];
  isLoading: boolean;
  sendConnectionRequest: (userId: string, message?: string) => Promise<void>;
  acceptConnectionRequest: (requestId: string) => Promise<void>;
  ignoreConnectionRequest: (requestId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
  getConnectionStatus: (userId: string) => 'not_connected' | 'connected' | 'pending_sent' | 'pending_received';
  getMutualConnectionsCount: (userId: string) => number;
  searchUsers: (query: string) => UserSearchResult[];
  getPeopleYouMayKnow: () => UserSearchResult[];
  refreshConnections: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load connections and requests from localStorage
  useEffect(() => {
    if (user) {
      loadConnectionsData();
    } else {
      setConnections([]);
      setConnectionRequests([]);
      setSentRequests([]);
    }
  }, [user]);

  const loadConnectionsData = () => {
    if (!user) return;

    // Load connections
    const allConnections = JSON.parse(localStorage.getItem('connections') || '[]');
    const userConnections = allConnections.filter((conn: Connection) => conn.userId === user.id);
    setConnections(userConnections);

    // Load connection requests
    const allRequests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
    const receivedRequests = allRequests.filter(
      (req: ConnectionRequest) => req.receiverId === user.id && req.status === 'pending'
    );
    const sentRequestsList = allRequests.filter(
      (req: ConnectionRequest) => req.senderId === user.id && req.status === 'pending'
    );
    
    setConnectionRequests(receivedRequests);
    setSentRequests(sentRequestsList);
  };

  const refreshConnections = () => {
    loadConnectionsData();
  };

  const sendConnectionRequest = async (userId: string, message?: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Get recipient user data
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const recipient = registeredUsers.find((u: any) => u.id === userId);
      
      if (!recipient) throw new Error('User not found');

      // Create new connection request
      const newRequest: ConnectionRequest = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: user.id,
        sender: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.profilePicture,
          department: user.role === 'student' ? (user as any).department : undefined,
          designation: user.role === 'faculty' ? (user as any).designation : undefined,
          skills: user.skills || [],
        },
        receiverId: userId,
        message: message,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const allRequests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
      allRequests.push(newRequest);
      localStorage.setItem('connectionRequests', JSON.stringify(allRequests));

      // Create notification for recipient
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${user.firstName} ${user.lastName} sent you a connection request`,
        link: '/connections/requests',
        read: false,
        createdAt: new Date().toISOString(),
        relatedUserId: user.id,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // Update local state
      setSentRequests(prev => [...prev, newRequest]);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptConnectionRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Get the request
      const allRequests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
      const requestIndex = allRequests.findIndex((req: ConnectionRequest) => req.id === requestId);
      
      if (requestIndex === -1) throw new Error('Request not found');
      
      const request = allRequests[requestIndex];

      // Update request status
      allRequests[requestIndex].status = 'accepted';
      allRequests[requestIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('connectionRequests', JSON.stringify(allRequests));

      // Get sender data
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const sender = registeredUsers.find((u: any) => u.id === request.senderId);
      
      if (!sender) throw new Error('Sender not found');

      // Create connections for both users
      const allConnections = JSON.parse(localStorage.getItem('connections') || '[]');
      
      const connection1: Connection = {
        id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        connectedUserId: sender.id,
        connectedUser: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
          role: sender.role,
          avatar: sender.profilePicture,
          department: sender.role === 'student' ? sender.department : undefined,
          designation: sender.role === 'faculty' ? sender.designation : undefined,
          skills: sender.skills || [],
          email: sender.email,
        },
        connectedAt: new Date().toISOString(),
      };

      const connection2: Connection = {
        id: `conn_${Date.now() + 1}_${Math.random().toString(36).substr(2, 9)}`,
        userId: sender.id,
        connectedUserId: user.id,
        connectedUser: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          avatar: user.profilePicture,
          department: user.role === 'student' ? (user as any).department : undefined,
          designation: user.role === 'faculty' ? (user as any).designation : undefined,
          skills: user.skills || [],
          email: user.email,
        },
        connectedAt: new Date().toISOString(),
      };

      allConnections.push(connection1, connection2);
      localStorage.setItem('connections', JSON.stringify(allConnections));

      // Create notification for sender
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.push({
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: sender.id,
        type: 'connection_accepted',
        title: 'Connection Request Accepted',
        message: `${user.firstName} ${user.lastName} accepted your connection request`,
        link: '/connections',
        read: false,
        createdAt: new Date().toISOString(),
        relatedUserId: user.id,
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));

      // Update local state
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
      setConnections(prev => [...prev, connection1]);
    } finally {
      setIsLoading(false);
    }
  };

  const ignoreConnectionRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      const allRequests = JSON.parse(localStorage.getItem('connectionRequests') || '[]');
      const requestIndex = allRequests.findIndex((req: ConnectionRequest) => req.id === requestId);
      
      if (requestIndex === -1) throw new Error('Request not found');

      // Update request status to ignored
      allRequests[requestIndex].status = 'ignored';
      allRequests[requestIndex].updatedAt = new Date().toISOString();
      localStorage.setItem('connectionRequests', JSON.stringify(allRequests));

      // Update local state
      setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
    } finally {
      setIsLoading(false);
    }
  };

  const removeConnection = async (connectionId: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      const allConnections = JSON.parse(localStorage.getItem('connections') || '[]');
      const connection = allConnections.find((conn: Connection) => conn.id === connectionId);
      
      if (!connection) throw new Error('Connection not found');

      // Remove both connections (bidirectional)
      const updatedConnections = allConnections.filter(
        (conn: Connection) => 
          !(conn.userId === user.id && conn.connectedUserId === connection.connectedUserId) &&
          !(conn.userId === connection.connectedUserId && conn.connectedUserId === user.id)
      );
      
      localStorage.setItem('connections', JSON.stringify(updatedConnections));

      // Update local state
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    } finally {
      setIsLoading(false);
    }
  };

  const getConnectionStatus = (userId: string): 'not_connected' | 'connected' | 'pending_sent' | 'pending_received' => {
    if (!user) return 'not_connected';

    // Check if connected
    const isConnected = connections.some(conn => conn.connectedUserId === userId);
    if (isConnected) return 'connected';

    // Check if request sent
    const hasSentRequest = sentRequests.some(req => req.receiverId === userId);
    if (hasSentRequest) return 'pending_sent';

    // Check if request received
    const hasReceivedRequest = connectionRequests.some(req => req.senderId === userId);
    if (hasReceivedRequest) return 'pending_received';

    return 'not_connected';
  };

  const getMutualConnectionsCount = (userId: string): number => {
    if (!user) return 0;

    // Get target user's connections
    const allConnections = JSON.parse(localStorage.getItem('connections') || '[]');
    const targetUserConnections = allConnections
      .filter((conn: Connection) => conn.userId === userId)
      .map((conn: Connection) => conn.connectedUserId);

    // Count mutual connections
    const mutualCount = connections.filter(conn => 
      targetUserConnections.includes(conn.connectedUserId)
    ).length;

    return mutualCount;
  };

  const searchUsers = (query: string): UserSearchResult[] => {
    if (!user) return [];

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const searchLower = query.toLowerCase();

    return registeredUsers
      .filter((u: any) => u.id !== user.id) // Exclude current user
      .filter((u: any) => {
        const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
        const email = u.email?.toLowerCase() || '';
        const department = u.department?.toLowerCase() || '';
        const skills = u.skills?.join(' ').toLowerCase() || '';
        
        return fullName.includes(searchLower) ||
               email.includes(searchLower) ||
               department.includes(searchLower) ||
               skills.includes(searchLower);
      })
      .map((u: any) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        avatar: u.profilePicture,
        department: u.department,
        designation: u.designation,
        skills: u.skills || [],
        connectionStatus: getConnectionStatus(u.id),
        mutualConnectionsCount: getMutualConnectionsCount(u.id),
      }));
  };

  const getPeopleYouMayKnow = (): UserSearchResult[] => {
    if (!user) return [];

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Get IDs of connected users and pending requests
    const connectedUserIds = connections.map(conn => conn.connectedUserId);
    const pendingUserIds = [
      ...sentRequests.map(req => req.receiverId),
      ...connectionRequests.map(req => req.senderId),
    ];

    // Get all users except current user, connected users, and pending requests
    const potentialConnections = registeredUsers
      .filter((u: any) => 
        u.id !== user.id && 
        !connectedUserIds.includes(u.id) &&
        !pendingUserIds.includes(u.id)
      );

    // Score users based on mutual connections and shared skills
    const scoredUsers = potentialConnections.map((u: any) => {
      const mutualConnectionsCount = getMutualConnectionsCount(u.id);
      const sharedSkills = (user.skills || []).filter(skill => 
        (u.skills || []).includes(skill)
      ).length;
      
      // Prioritize department match for students
      const sameDepartment = user.role === 'student' && u.role === 'student' && 
        (user as any).department === u.department ? 1 : 0;

      const score = mutualConnectionsCount * 10 + sharedSkills * 5 + sameDepartment * 3;

      return {
        ...u,
        score,
        mutualConnectionsCount,
      };
    });

    // Sort by score and return top recommendations
    return scoredUsers
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 10)
      .map((u: any) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        avatar: u.profilePicture,
        department: u.department,
        designation: u.designation,
        skills: u.skills || [],
        connectionStatus: 'not_connected' as const,
        mutualConnectionsCount: u.mutualConnectionsCount,
      }));
  };

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        connectionRequests,
        sentRequests,
        isLoading,
        sendConnectionRequest,
        acceptConnectionRequest,
        ignoreConnectionRequest,
        removeConnection,
        getConnectionStatus,
        getMutualConnectionsCount,
        searchUsers,
        getPeopleYouMayKnow,
        refreshConnections,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnections = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
};
