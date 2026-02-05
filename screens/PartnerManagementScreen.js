/**
 * PartnerManagementScreen - Manage all relationships
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelationships } from '../data/RelationshipContext';
import { useAtomValue } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

const ROLE_ICONS = {
  dom: 'shield',
  sub: 'heart',
  switch: 'swap-horizontal',
};

const ROLE_COLORS = {
  dom: '#673AB7',
  sub: '#E91E63',
  switch: '#3F51B5',
};

export default function PartnerManagementScreen({ navigation }) {
  const theme = useAtomValue(themeAtom);
  const {
    relationships,
    activeRelationshipId,
    switchRelationship,
    createRelationship,
    generatePairingCode,
    joinWithPairingCode,
    syncWithPartner,
    deleteRelationship,
    updateVisibility,
    syncStatus,
    lastSyncTime,
  } = useRelationships();

  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState(null); // 'generate' or 'join'
  const [generatedCode, setGeneratedCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [newPartnerName, setNewPartnerName] = useState('');
  const [selectedRole, setSelectedRole] = useState('sub');
  const [isJoining, setIsJoining] = useState(false);

  const relationshipList = Object.values(relationships);

  const handleGenerateCode = async () => {
    const code = generatePairingCode();
    setGeneratedCode(code);
    setAddMode('generate');
  };

  const handleCreateWithCode = async () => {
    if (!generatedCode) return;

    await createRelationship({
      partnerName: newPartnerName || 'Partner',
      myRole: selectedRole,
      theirRole: selectedRole === 'dom' ? 'sub' : (selectedRole === 'sub' ? 'dom' : 'switch'),
      pairingCode: generatedCode,
    });

    setShowAddModal(false);
    resetAddModal();
  };

  const handleJoinWithCode = async () => {
    if (joinCode.length !== 6) {
      showAlert('Please enter a 6-digit code');
      return;
    }

    setIsJoining(true);
    
    try {
      // Try to join via Gun.js
      await joinWithPairingCode(joinCode);
      
      // Create the relationship locally
      await createRelationship({
        partnerName: newPartnerName || 'Partner',
        myRole: selectedRole,
        theirRole: selectedRole === 'dom' ? 'sub' : (selectedRole === 'sub' ? 'dom' : 'switch'),
        pairingCode: joinCode,
      });

      setShowAddModal(false);
      resetAddModal();
      showAlert('Successfully connected with partner!');
    } catch (error) {
      showAlert('Failed to connect: ' + error.message);
    } finally {
      setIsJoining(false);
    }
  };

  const resetAddModal = () => {
    setAddMode(null);
    setGeneratedCode('');
    setJoinCode('');
    setNewPartnerName('');
    setSelectedRole('sub');
  };

  const handleDeleteRelationship = (relId, name) => {
    const doDelete = () => deleteRelationship(relId);
    
    if (Platform.OS === 'web') {
      if (window.confirm(`Remove ${name}? This cannot be undone.`)) {
        doDelete();
      }
    } else {
      Alert.alert(
        'Remove Partner',
        `Remove ${name}? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: doDelete },
        ]
      );
    }
  };

  const showAlert = (message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Notice', message);
    }
  };

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <ScrollView style={styles.scroll}>
        <Text style={[styles.title, dynamicStyles.title]}>Partners</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
          Manage your relationships and visibility
        </Text>

        {/* Sync Status Indicator */}
        <View style={[styles.syncStatus, { backgroundColor: syncStatus === 'connected' ? '#d4edda' : syncStatus === 'syncing' ? '#fff3cd' : '#f8d7da' }]}>
          <Ionicons 
            name={syncStatus === 'connected' ? 'cloud-done' : syncStatus === 'syncing' ? 'cloud-upload' : 'cloud-offline'} 
            size={20} 
            color={syncStatus === 'connected' ? '#155724' : syncStatus === 'syncing' ? '#856404' : '#721c24'} 
          />
          <Text style={{ marginLeft: 8, color: syncStatus === 'connected' ? '#155724' : syncStatus === 'syncing' ? '#856404' : '#721c24' }}>
            {syncStatus === 'connected' ? 'Connected' : syncStatus === 'syncing' ? 'Syncing...' : 'Disconnected'}
            {lastSyncTime && syncStatus === 'connected' && ` (Last: ${new Date(lastSyncTime).toLocaleTimeString()})`}
          </Text>
          {syncStatus === 'connected' && (
            <TouchableOpacity 
              style={{ marginLeft: 'auto', padding: 4 }} 
              onPress={syncWithPartner}
            >
              <Ionicons name="sync" size={20} color="#155724" />
            </TouchableOpacity>
          )}
        </View>

        {/* Relationship List */}
        {relationshipList.length === 0 ? (
          <View style={[styles.emptyState, dynamicStyles.card]}>
            <Ionicons name="people-outline" size={64} color={theme.colors?.textSecondary || '#666'} />
            <Text style={[styles.emptyText, dynamicStyles.text]}>No partners yet</Text>
            <Text style={[styles.emptyHint, dynamicStyles.subtitle]}>
              Add a partner to start syncing
            </Text>
          </View>
        ) : (
          relationshipList.map((rel) => (
            <TouchableOpacity
              key={rel.id}
              style={[
                styles.relationshipCard,
                dynamicStyles.card,
                activeRelationshipId === rel.id && styles.activeCard,
              ]}
              onPress={() => switchRelationship(rel.id)}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.roleIcon, { backgroundColor: ROLE_COLORS[rel.myRole] + '20' }]}>
                  <Ionicons 
                    name={ROLE_ICONS[rel.myRole] || 'person'} 
                    size={24} 
                    color={ROLE_COLORS[rel.myRole]} 
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.partnerName, dynamicStyles.text]}>{rel.partnerName}</Text>
                  <Text style={[styles.roleText, dynamicStyles.subtitle]}>
                    You: {rel.myRole.charAt(0).toUpperCase() + rel.myRole.slice(1)}
                    {rel.isSolo ? ' (Solo)' : ` → They: ${rel.theirRole?.charAt(0).toUpperCase() + rel.theirRole?.slice(1)}`}
                  </Text>
                </View>
                {activeRelationshipId === rel.id && (
                  <View style={styles.activeIndicator}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  </View>
                )}
              </View>

              <View style={styles.cardActions}>
                {!rel.isSolo && (
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => {
                      updateVisibility(rel.id, {
                        ...rel.visibility,
                        canSeeOthers: !rel.visibility?.canSeeOthers,
                      });
                    }}
                  >
                    <Ionicons 
                      name={rel.visibility?.canSeeOthers ? 'eye' : 'eye-off'} 
                      size={20} 
                      color={theme.colors?.textSecondary || '#888'} 
                    />
                    <Text style={[styles.actionText, dynamicStyles.subtitle]}>
                      {rel.visibility?.canSeeOthers ? 'Can see others' : 'Hidden'}
                    </Text>
                  </TouchableOpacity>
                )}

                {!rel.isSolo && (
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteRelationship(rel.id, rel.partnerName)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#F44336" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Add Partner Button */}
        <TouchableOpacity 
          style={[styles.addButton, dynamicStyles.primaryButton]}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Partner</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Partner Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowAddModal(false);
          resetAddModal();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, dynamicStyles.card]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, dynamicStyles.text]}>Add Partner</Text>
              <TouchableOpacity onPress={() => {
                setShowAddModal(false);
                resetAddModal();
              }}>
                <Ionicons name="close" size={24} color={theme.colors?.textSecondary || '#888'} />
              </TouchableOpacity>
            </View>

            {!addMode && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, dynamicStyles.subtitle]}>Partner's Name</Text>
                  <TextInput
                    style={[styles.input, dynamicStyles.input]}
                    value={newPartnerName}
                    onChangeText={setNewPartnerName}
                    placeholder="Their name"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, dynamicStyles.subtitle]}>Your Role with Them</Text>
                  <View style={styles.roleButtons}>
                    {['sub', 'dom', 'switch'].map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleButton,
                          selectedRole === role && { backgroundColor: ROLE_COLORS[role] },
                        ]}
                        onPress={() => setSelectedRole(role)}
                      >
                        <Ionicons 
                          name={ROLE_ICONS[role]} 
                          size={20} 
                          color={selectedRole === role ? '#fff' : ROLE_COLORS[role]} 
                        />
                        <Text style={[
                          styles.roleButtonText,
                          selectedRole === role && { color: '#fff' },
                        ]}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.pairingButtons}>
                  <TouchableOpacity 
                    style={[styles.pairingButton, dynamicStyles.card]}
                    onPress={handleGenerateCode}
                  >
                    <Ionicons name="qr-code" size={32} color="#9C27B0" />
                    <Text style={[styles.pairingButtonLabel, dynamicStyles.text]}>Generate Code</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.pairingButton, dynamicStyles.card]}
                    onPress={() => setAddMode('join')}
                  >
                    <Ionicons name="enter" size={32} color="#9C27B0" />
                    <Text style={[styles.pairingButtonLabel, dynamicStyles.text]}>Enter Code</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {addMode === 'generate' && (
              <View style={styles.codeSection}>
                <Text style={[styles.codeLabel, dynamicStyles.subtitle]}>Share this code:</Text>
                <Text style={styles.codeDisplay}>{generatedCode}</Text>
                <TouchableOpacity 
                  style={[styles.confirmButton, dynamicStyles.primaryButton]}
                  onPress={handleCreateWithCode}
                >
                  <Text style={styles.confirmButtonText}>Done - Wait for Partner</Text>
                </TouchableOpacity>
              </View>
            )}

            {addMode === 'join' && (
              <View style={styles.codeSection}>
                <Text style={[styles.codeLabel, dynamicStyles.subtitle]}>Enter partner's code:</Text>
                <TextInput
                  style={styles.codeInput}
                  value={joinCode}
                  onChangeText={(text) => setJoinCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholder="000000"
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                  maxLength={6}
                />
                <TouchableOpacity 
                  style={[styles.confirmButton, dynamicStyles.primaryButton]}
                  onPress={handleJoinWithCode}
                >
                  <Text style={styles.confirmButtonText}>Connect</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function createDynamicStyles(theme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.colors?.background || '#1A1A2E',
    },
    card: {
      backgroundColor: theme.colors?.surface || '#252542',
      borderColor: theme.colors?.border || '#333',
    },
    text: {
      color: theme.colors?.text || '#fff',
    },
    title: {
      color: theme.colors?.text || '#fff',
    },
    subtitle: {
      color: theme.colors?.textSecondary || '#888',
    },
    input: {
      backgroundColor: theme.colors?.surface || '#252542',
      borderColor: theme.colors?.border || '#333',
      color: theme.colors?.text || '#fff',
    },
    primaryButton: {
      backgroundColor: theme.colors?.primary || '#9C27B0',
    },
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    padding: 20,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 16,
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    marginTop: 8,
  },
  relationshipCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  activeCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 14,
    marginTop: 2,
  },
  activeIndicator: {
    marginLeft: 8,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    gap: 8,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888',
  },
  pairingButtons: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  pairingButton: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
  },
  pairingButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  codeSection: {
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 16,
    marginBottom: 16,
  },
  codeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9C27B0',
    letterSpacing: 8,
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: '#252542',
    borderRadius: 12,
    padding: 20,
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 8,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  confirmButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
