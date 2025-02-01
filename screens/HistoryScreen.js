import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function HistoryScreen() {
  const [theme] = useAtom(themeAtom);
  const [activeTab, setActiveTab] = useState('Rewards');
  const [rewardsHistory, setRewardsHistory] = useState([]);
  const [punishmentsHistory, setPunishmentsHistory] = useState([]);
  const [habitsHistory, setHabitsHistory] = useState([]);
  const [notesHistory, setNotesHistory] = useState([]);
  const [journalsHistory, setJournalsHistory] = useState([]);

  const renderTabContent = () => {
    let data = [];
    if (activeTab === 'Rewards') {
      data = rewardsHistory;
    } else if (activeTab === 'Punishments') {
      data = punishmentsHistory;
    } else if (activeTab === 'Habits') {
      data = habitsHistory;
    } else if (activeTab === 'Notes') {
      data = notesHistory;
    } else if (activeTab === 'Journals') {
      data = journalsHistory;
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.entryContainer, { backgroundColor: theme.entryContainer.backgroundColor }]}>
            <Text style={{ color: theme.textColor }}>{item}</Text>
          </View>
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.container.backgroundColor }]}>
      <View style={[styles.sidebar, { backgroundColor: theme.drawer.backgroundColor }]}>
        {['Rewards', 'Punishments', 'Habits', 'Notes', 'Journals'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
              { backgroundColor: activeTab === tab ? theme.activeTabButton.backgroundColor : theme.tabButton.backgroundColor }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabButtonText, { color: theme.tabButtonText.color }]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 150,
    padding: 10,
  },
  tabButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#0056b3',
  },
  tabButtonText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  entryContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});