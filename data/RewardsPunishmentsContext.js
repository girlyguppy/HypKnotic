import React, { createContext, useContext, useState } from 'react';

const RewardsPunishmentsContext = createContext();

export const useRewardsPunishments = () => useContext(RewardsPunishmentsContext);

export const RewardsPunishmentsProvider = ({ children }) => {
  const [rewards, setRewards] = useState([]);
  const [punishments, setPunishments] = useState([]);

  const addReward = (reward) => {
    setRewards([...rewards, reward]);
  };

  const addPunishment = (punishment) => {
    setPunishments([...punishments, punishment]);
  };

  const updatePunishmentCount = (name, count) => {
    setPunishments(
      punishments.map((punishment) =>
        punishment.name === name ? { ...punishment, count } : punishment
      )
    );
  };

  const updateRewardCount = (name, count) => {
    setRewards(
      rewards.map((reward) =>
        reward.name === name ? { ...reward, count } : reward
      )
    );
  };

  return (
    <RewardsPunishmentsContext.Provider
      value={{
        rewards,
        punishments,
        addReward,
        addPunishment,
        updatePunishmentCount,
        updateRewardCount,
      }}
    >
      {children}
    </RewardsPunishmentsContext.Provider>
  );
};