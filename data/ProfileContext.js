import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    name: '',
    partnerName: '',
    role: 'sub', // 'sub' or 'dom'
    partnerCode: '',
    isPaired: false,
    avatar: null,
  });

  const updateProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const setRole = (role) => {
    setProfile((prev) => ({ ...prev, role }));
  };

  const pairWithPartner = (partnerCode) => {
    // In a real app, this would validate with a server
    // For now, we'll just simulate pairing
    setProfile((prev) => ({ 
      ...prev, 
      isPaired: true, 
      partnerCode 
    }));
  };

  const unpair = () => {
    setProfile((prev) => ({ 
      ...prev, 
      isPaired: false, 
      partnerCode: '',
      partnerName: '' 
    }));
  };

  // Generate a simple pairing code
  const generatePairingCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setProfile((prev) => ({ ...prev, partnerCode: code }));
    return code;
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        setRole,
        pairWithPartner,
        unpair,
        generatePairingCode,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
