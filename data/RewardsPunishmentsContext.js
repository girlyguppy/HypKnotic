import React, { createContext, useState, useContext } from 'react';

const RewardsPunishmentsContext = createContext();

export const RewardsPunishmentsProvider = ({ children }) => {
  const [rewards, setRewards] = useState([]);
  const [punishments, setPunishments] = useState([]);

  const addReward = (reward) => setRewards([...rewards, reward]);
  const addPunishment = (punishment) => setPunishments([...punishments, punishment]);

  return (
    <RewardsPunishmentsContext.Provider value={{ rewards, addReward, punishments, addPunishment }}>
      {children}
    </RewardsPunishmentsContext.Provider>
  );
};

export const useRewardsPunishments = () => useContext(RewardsPunishmentsContext);