import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function NotesTab() {
  const [theme] = useAtom(themeAtom);
  
  const [activeTab, setActiveTab] = useState('Rules');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rules, setRules] = useState([]);
  const [limits, setLimits] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [notes, setNotes] = useState([]);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF',
      padding: 16,
    },
    tabContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    tabButton: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
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
      fontWeight: '600',
      color: theme.colors?.text || '#1A1A1A',
    },
    activeTabButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
    },
    addButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    addButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    entryCard: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
    },
    entryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 4,
    },
    entryContent: {
      fontSize: 14,
      color: theme.colors?.textSecondary || '#666666',
    },
    deleteButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12,
    },
    deleteButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 24,
      borderRadius: 16,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 16,
    },
    input: {
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors?.inputText || '#1A1A1A',
      marginVertical: 8,
    },
    actionButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    actionButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    cancelButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors?.textMuted || '#888888',
      fontSize: 16,
      marginTop: 40,
    },
  }), [theme]);

  const handleCreatePost = () => {
    if (!title.trim()) return;
    const newPost = { title, content };
    if (activeTab === 'Rules') {
      setRules([...rules, newPost]);
    } else if (activeTab === 'Limits') {
      setLimits([...limits, newPost]);
    } else if (activeTab === 'Ideas') {
      setIdeas([...ideas, newPost]);
    } else if (activeTab === 'Notes') {
      setNotes([...notes, newPost]);
    }
    resetModalFields();
  };

  const resetModalFields = () => {
    setTitle('');
    setContent('');
    setIsModalVisible(false);
  };

  const handleDeletePost = (index) => {
    if (activeTab === 'Rules') {
      setRules(rules.filter((_, i) => i !== index));
    } else if (activeTab === 'Limits') {
      setLimits(limits.filter((_, i) => i !== index));
    } else if (activeTab === 'Ideas') {
      setIdeas(ideas.filter((_, i) => i !== index));
    } else if (activeTab === 'Notes') {
      setNotes(notes.filter((_, i) => i !== index));
    }
  };

  const getData = () => {
    switch (activeTab) {
      case 'Rules': return rules;
      case 'Limits': return limits;
      case 'Ideas': return ideas;
      case 'Notes': return notes;
      default: return [];
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.tabContainer}>
        {['Rules', 'Limits', 'Ideas', 'Notes'].map((tab) => (
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

      <FlatList
        data={getData()}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={dynamicStyles.entryCard}>
            <Text style={dynamicStyles.entryTitle}>{item.title}</Text>
            {item.content ? <Text style={dynamicStyles.entryContent}>{item.content}</Text> : null}
            <TouchableOpacity 
              style={dynamicStyles.deleteButton}
              onPress={() => handleDeletePost(index)}
            >
              <Text style={dynamicStyles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={dynamicStyles.emptyText}>No {activeTab.toLowerCase()} yet. Tap the button below to add one.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <TouchableOpacity 
        style={dynamicStyles.addButton} 
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={dynamicStyles.addButtonText}>+ Add {activeTab.slice(0, -1)}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.modalContainer}>
                <Text style={dynamicStyles.modalTitle}>Create {activeTab.slice(0, -1)}</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder={`${activeTab.slice(0, -1)} Title`}
                  placeholderTextColor={theme.colors?.textMuted || '#888'}
                  value={title}
                  onChangeText={setTitle}
                />
                <TextInput
                  style={[dynamicStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                  placeholder={`${activeTab.slice(0, -1)} Content (optional)`}
                  placeholderTextColor={theme.colors?.textMuted || '#888'}
                  value={content}
                  onChangeText={setContent}
                  multiline
                />
                <TouchableOpacity 
                  style={[dynamicStyles.actionButton, !title.trim() && { opacity: 0.5 }]}
                  onPress={handleCreatePost}
                  disabled={!title.trim()}
                >
                  <Text style={dynamicStyles.actionButtonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={dynamicStyles.cancelButton}
                  onPress={resetModalFields}
                >
                  <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
