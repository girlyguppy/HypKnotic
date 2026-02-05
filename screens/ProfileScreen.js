import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ScrollView } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';
import { useProfile } from '../data/ProfileContext';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';

export default function ProfileScreen() {
  const [theme] = useAtom(themeAtom);
  const { profile, updateProfile, setRole, generatePairingCode, pairWithPartner, unpair } = useProfile();
  const { totalPoints } = useRewardsPunishments();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');

  const handleSaveName = () => {
    updateProfile({ name: tempName });
    setEditingName(false);
  };

  const handleGenerateCode = () => {
    const code = generatePairingCode();
    if (Platform.OS === 'web') {
      window.alert(`Your pairing code is: ${code}\nShare this with your partner to connect.`);
    } else {
      Alert.alert('Pairing Code', `Your pairing code is: ${code}\nShare this with your partner to connect.`);
    }
  };

  const handlePair = () => {
    if (partnerCodeInput.trim().length > 0) {
      pairWithPartner(partnerCodeInput.trim().toUpperCase());
      if (Platform.OS === 'web') {
        window.alert('Successfully paired!');
      } else {
        Alert.alert('Success', 'Successfully paired!');
      }
      setPartnerCodeInput('');
    }
  };

  const handleUnpair = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to unpair from your partner?')) {
        unpair();
      }
    } else {
      Alert.alert(
        'Unpair',
        'Are you sure you want to unpair from your partner?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Unpair', onPress: unpair, style: 'destructive' }
        ]
      );
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.container?.backgroundColor || '#E6E6FA' }]}>
      <Text style={[styles.title, { color: theme.title?.color || '#4B0082' }]}>Profile</Text>

      {/* Avatar Placeholder */}
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: theme.button?.backgroundColor || '#D8BFD8' }]}>
          <Text style={[styles.avatarText, { color: theme.buttonText?.color || '#4B0082' }]}>
            {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
      </View>

      {/* Name Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Your Name</Text>
        {editingName ? (
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.borderColor || '#ccc',
                color: theme.textColor || '#000'
              }]}
              value={tempName}
              onChangeText={setTempName}
              placeholder="Enter your name"
              placeholderTextColor={theme.placeholderTextColor || '#888'}
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#28A745' }]}
              onPress={handleSaveName}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={[styles.nameText, { color: theme.textColor || '#000' }]}>
              {profile.name || 'Not set'}
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.button?.backgroundColor || '#D8BFD8' }]}
              onPress={() => {
                setTempName(profile.name);
                setEditingName(true);
              }}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText?.color || '#4B0082' }]}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Role Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Your Role</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              profile.role === 'sub' && styles.roleButtonActive,
              { 
                backgroundColor: profile.role === 'sub' 
                  ? (theme.activeTabButton?.backgroundColor || '#D8BFD8') 
                  : (theme.tabButton?.backgroundColor || '#E6E6FA'),
                borderColor: theme.borderColor || '#4B0082'
              }
            ]}
            onPress={() => setRole('sub')}
          >
            <Text style={[styles.roleIcon]}>👤</Text>
            <Text style={[styles.roleText, { color: theme.textColor || '#4B0082' }]}>Sub</Text>
            <Text style={[styles.roleDescription, { color: theme.textColor || '#666' }]}>
              Complete tasks, earn rewards
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.roleButton,
              profile.role === 'dom' && styles.roleButtonActive,
              { 
                backgroundColor: profile.role === 'dom' 
                  ? (theme.activeTabButton?.backgroundColor || '#D8BFD8') 
                  : (theme.tabButton?.backgroundColor || '#E6E6FA'),
                borderColor: theme.borderColor || '#4B0082'
              }
            ]}
            onPress={() => setRole('dom')}
          >
            <Text style={[styles.roleIcon]}>👑</Text>
            <Text style={[styles.roleText, { color: theme.textColor || '#4B0082' }]}>Dom</Text>
            <Text style={[styles.roleDescription, { color: theme.textColor || '#666' }]}>
              Assign tasks, manage rewards
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Stats</Text>
        <View style={[styles.statsContainer, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.title?.color || '#4B0082' }]}>{totalPoints}</Text>
            <Text style={[styles.statLabel, { color: theme.textColor || '#666' }]}>Total Points</Text>
          </View>
        </View>
      </View>

      {/* Pairing Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Partner Pairing</Text>
        
        {profile.isPaired ? (
          <View style={[styles.pairingBox, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.pairedText}>✓ Paired</Text>
            <Text style={styles.pairingInfo}>Code: {profile.partnerCode}</Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#DC3545', marginTop: 10 }]}
              onPress={handleUnpair}
            >
              <Text style={styles.buttonText}>Unpair</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.pairingBox, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.button?.backgroundColor || '#D8BFD8', marginBottom: 15 }]}
              onPress={handleGenerateCode}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText?.color || '#4B0082' }]}>
                Generate Pairing Code
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.orText, { color: theme.textColor || '#666' }]}>OR</Text>
            
            <TextInput
              style={[styles.input, { 
                borderColor: theme.borderColor || '#ccc',
                color: theme.textColor || '#000',
                marginTop: 15
              }]}
              value={partnerCodeInput}
              onChangeText={setPartnerCodeInput}
              placeholder="Enter partner's code"
              placeholderTextColor={theme.placeholderTextColor || '#888'}
              autoCapitalize="characters"
            />
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#28A745', marginTop: 10 }]}
              onPress={handlePair}
              disabled={!partnerCodeInput.trim()}
            >
              <Text style={styles.buttonText}>Pair with Partner</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  nameText: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  roleButton: {
    flex: 1,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  roleButtonActive: {
    borderWidth: 3,
  },
  roleIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  roleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleDescription: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  pairingBox: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  pairedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28A745',
    marginBottom: 10,
  },
  pairingInfo: {
    fontSize: 14,
    color: '#666',
  },
  orText: {
    fontSize: 14,
    fontWeight: '600',
  },
});