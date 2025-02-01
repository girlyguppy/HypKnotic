import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
// Remove the custom useTheme import and use Jotai instead:
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

  const handleCreatePost = () => {
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

  const renderTabContent = () => {
    let data = [];
    if (activeTab === 'Rules') {
      data = rules;
    } else if (activeTab === 'Limits') {
      data = limits;
    } else if (activeTab === 'Ideas') {
      data = ideas;
    } else if (activeTab === 'Notes') {
      data = notes;
    }

    return (
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={theme.entryContainer}>
            <Text style={theme.item}>{item.title}</Text>
            <Text>{item.content}</Text>
            <Button title="Delete" onPress={() => handleDeletePost(index)} />
          </View>
        )}
      />
    );
  };

  return (
    <View style={theme.container}>
      <View style={styles.tabContainer}>
        {['Rules', 'Limits', 'Ideas', 'Notes'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton, activeTab === tab && theme.activeTabButton]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab && theme.tabButtonText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderTabContent()}

      <TouchableOpacity style={[styles.addButton, theme.addButton]} onPress={() => setIsModalVisible(true)}>
        <Text style={[styles.addButtonText, theme.addButtonText]}>+ Add {activeTab}</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={theme.title}>Create {activeTab}</Text>
            <TextInput
              style={theme.input}
              placeholder={`${activeTab} Title`}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={theme.input}
              placeholder={`${activeTab} Content`}
              value={content}
              onChangeText={setContent}
            />
            <Button title="Create" onPress={handleCreatePost} />
            <Button title="Cancel" onPress={resetModalFields} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#DDDDDD',
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabButtonText: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});