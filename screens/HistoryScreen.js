import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';
import { useHistory, getHistoryCategory } from '../data/HistoryContext';

export default function HistoryScreen() {
  const [theme] = useAtom(themeAtom);
  const { history, getHistoryByCategory, clearHistory, getStats } = useHistory();
  const [activeTab, setActiveTab] = useState('All');
  
  const stats = getStats();

  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF',
    },
    sidebar: {
      width: 140,
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
      fontSize: 13,
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    entryCard: {
      padding: 16,
      marginVertical: 6,
      borderRadius: 12,
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      flexDirection: 'row',
      alignItems: 'center',
    },
    entryIcon: {
      marginRight: 12,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors?.primary || '#9B59B6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    entryContent: {
      flex: 1,
    },
    entryLabel: {
      color: theme.colors?.text || '#1A1A1A',
      fontSize: 16,
      fontWeight: '600',
    },
    entryDetails: {
      color: theme.colors?.textSecondary || '#666666',
      fontSize: 14,
      marginTop: 2,
    },
    entryTime: {
      color: theme.colors?.textMuted || '#888888',
      fontSize: 12,
      marginTop: 4,
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
    },
    clearButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
    },
    clearButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderRadius: 12,
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.primary || '#9B59B6',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors?.textMuted || '#888888',
    },
  }), [theme]);

  // Get icon for each history type
  const getIconForType = (type) => {
    if (type.includes('reward')) return 'trophy';
    if (type.includes('punishment')) return 'warning';
    if (type.includes('task') || type.includes('habit')) return 'checkmark-circle';
    if (type.includes('note')) return 'document-text';
    if (type.includes('journal')) return 'book';
    if (type.includes('points')) return 'star';
    return 'time';
  };

  const tabs = ['All', 'Rewards', 'Punishments', 'Habits', 'Notes', 'Journals'];

  const getData = () => {
    if (activeTab === 'All') return history;
    return getHistoryByCategory(activeTab);
  };

  const renderEntry = ({ item }) => (
    <View style={dynamicStyles.entryCard}>
      <View style={dynamicStyles.entryIcon}>
        <Ionicons 
          name={getIconForType(item.type)} 
          size={20} 
          color={theme.colors?.textOnPrimary || '#FFFFFF'} 
        />
      </View>
      <View style={dynamicStyles.entryContent}>
        <Text style={dynamicStyles.entryLabel}>{item.label}</Text>
        {item.details?.name && (
          <Text style={dynamicStyles.entryDetails}>{item.details.name}</Text>
        )}
        {item.details?.points !== undefined && (
          <Text style={dynamicStyles.entryDetails}>
            {item.details.points > 0 ? '+' : ''}{item.details.points} points
          </Text>
        )}
        <Text style={dynamicStyles.entryTime}>{item.date} at {item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.sidebar}>
        {tabs.map((tab) => (
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
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>{activeTab} History</Text>
          {history.length > 0 && (
            <TouchableOpacity style={dynamicStyles.clearButton} onPress={clearHistory}>
              <Text style={dynamicStyles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {activeTab === 'All' && (
          <View style={dynamicStyles.statsRow}>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>{stats.total}</Text>
              <Text style={dynamicStyles.statLabel}>Total</Text>
            </View>
            <View style={dynamicStyles.statItem}>
              <Text style={dynamicStyles.statValue}>{stats.today}</Text>
              <Text style={dynamicStyles.statLabel}>Today</Text>
            </View>
          </View>
        )}
        
        <FlatList
          data={getData()}
          keyExtractor={(item) => item.id}
          renderItem={renderEntry}
          ListEmptyComponent={
            <Text style={dynamicStyles.emptyText}>
              No {activeTab.toLowerCase()} history yet.{'\n'}
              Actions you take will appear here.
            </Text>
          }
        />
      </View>
    </View>
  );
}
