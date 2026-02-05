import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function HistoryScreen() {
  const [theme] = useAtom(themeAtom);
  const [activeTab, setActiveTab] = useState('Rewards');
  const [rewardsHistory] = useState([]);
  const [punishmentsHistory] = useState([]);
  const [habitsHistory] = useState([]);
  const [notesHistory] = useState([]);
  const [journalsHistory] = useState([]);

  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF',
    },
    sidebar: {
      width: 150,
      padding: 10,
      backgroundColor: theme.colors?.surface || theme.drawer?.backgroundColor || '#FFFFFF',
      borderRightWidth: 1,
      borderRightColor: theme.colors?.border || '#DDDDDD',
    },
    tabButton: {
      padding: 12,
      marginVertical: 4,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
    },
    activeTabButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      borderColor: theme.colors?.primary || '#9B59B6',
    },
    tabButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors?.text || '#1A1A1A',
    },
    activeTabButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    entryCard: {
      padding: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
    },
    entryText: {
      color: theme.colors?.text || '#1A1A1A',
      fontSize: 14,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors?.textMuted || '#888888',
      fontSize: 16,
      marginTop: 40,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 16,
    },
  }), [theme]);

  const getData = () => {
    switch (activeTab) {
      case 'Rewards': return rewardsHistory;
      case 'Punishments': return punishmentsHistory;
      case 'Habits': return habitsHistory;
      case 'Notes': return notesHistory;
      case 'Journals': return journalsHistory;
      default: return [];
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.sidebar}>
        {['Rewards', 'Punishments', 'Habits', 'Notes', 'Journals'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              dynamicStyles.tabButton,
              activeTab === tab && dynamicStyles.activeTabButton
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              dynamicStyles.tabButtonText,
              activeTab === tab && dynamicStyles.activeTabButtonText
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>{activeTab} History</Text>
        <FlatList
          data={getData()}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={dynamicStyles.entryCard}>
              <Text style={dynamicStyles.entryText}>{item}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={dynamicStyles.emptyText}>No {activeTab.toLowerCase()} history yet.</Text>
          }
        />
      </View>
    </View>
  );
}
