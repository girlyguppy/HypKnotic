import React, { createContext, useContext, useState } from 'react';

const RewardsPunishmentsContext = createContext();

export const useRewardsPunishments = () => useContext(RewardsPunishmentsContext);

export const RewardsPunishmentsProvider = ({ children }) => {
  const [rewards, setRewards] = useState([]);
  const [punishments, setPunishments] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const addPoints = (points) => {
    setTotalPoints((prev) => prev + points);
  };

  const subtractPoints = (points) => {
    setTotalPoints((prev) => prev - points);
  };

  const addReward = (reward) => {
    setRewards([...rewards, reward]);
  };

  const removeReward = (rewardName) => {
    setRewards(rewards.filter(reward => reward.name !== rewardName));
  };

  const addPunishment = (punishment) => {
    setPunishments([...punishments, punishment]);
  };

  const removePunishment = (punishmentName) => {
    setPunishments(punishments.filter(punishment => punishment.name !== punishmentName));
  };

  const updatePunishmentCount = (name, count) => {
    setPunishments(
      punishments.map((punishment) =>
        punishment.name === name ? { ...punishment, count } : punishment
      )
    );
  };

  const updateRewardCount = (name, quantity) => {
    setRewards(
      rewards.map((reward) =>
        reward.name === name ? { ...reward, quantity } : reward
      )
    );
  };

  return (
    <RewardsPunishmentsContext.Provider
      value={{
        rewards,
        punishments,
        totalPoints,
        addReward,
        removeReward,
        addPunishment,
        removePunishment,
        updatePunishmentCount,
        updateRewardCount,
        addPoints,
        subtractPoints,
      }}
    >
      {children}
    </RewardsPunishmentsContext.Provider>
  );
};