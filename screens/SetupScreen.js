/**
 * SetupScreen - First-run experience
 * 
 * Allows user to:
 * 1. Choose their primary role (Solo/Dom/Sub/Switch)
 * 2. Create a PIN for security
 * 3. Optionally pair with first partner
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../data/AuthContext';
import { useRelationships } from '../data/RelationshipContext';

const ROLES = [
  {
    id: 'solo',
    label: 'Solo',
    icon: 'person-outline',
    description: 'Use the app by yourself without a partner',
    color: '#9C27B0',
  },
  {
    id: 'sub',
    label: 'Submissive',
    icon: 'heart-outline',
    description: 'Tasks and rewards are managed by your Dom partner',
    color: '#E91E63',
  },
  {
    id: 'dom',
    label: 'Dominant',
    icon: 'shield-outline',
    description: 'Create and manage tasks/rewards for your Sub partner',
    color: '#673AB7',
  },
  {
    id: 'switch',
    label: 'Switch',
    icon: 'swap-horizontal-outline',
    description: 'Toggle between Dom and Sub modes as needed',
    color: '#3F51B5',
  },
];

export default function SetupScreen({ onComplete, onSkip }) {
  const { createAccount, skipAuth } = useAuth();
  const { enableSoloMode, createRelationship, generatePairingCode } = useRelationships();
  
  const [step, setStep] = useState(1); // 1: role, 2: pin, 3: partner (optional)
  const [selectedRole, setSelectedRole] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pairingCode, setPairingCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleContinueFromRole = () => {
    if (!selectedRole) {
      showAlert('Please select a mode');
      return;
    }
    setStep(2);
  };

  const handleContinueFromPin = async () => {
    if (pin.length < 4) {
      showAlert('PIN must be at least 4 digits');
      return;
    }
    if (pin !== confirmPin) {
      showAlert('PINs do not match');
      return;
    }

    try {
      // Create the account
      await createAccount({
        displayName: displayName || 'User',
        pin,
        defaultRole: selectedRole === 'solo' ? 'switch' : selectedRole,
        switchModeEnabled: selectedRole === 'switch',
      });

      if (selectedRole === 'solo') {
        // Solo mode - skip partner setup
        await enableSoloMode();
        onComplete?.();
      } else {
        // Go to partner setup
        setStep(3);
      }
    } catch (error) {
      showAlert('Error creating account: ' + error.message);
    }
  };

  const handleSkipPartner = async () => {
    // Create solo mode for now, can add partner later
    await enableSoloMode();
    onComplete?.();
  };

  const handleGenerateCode = async () => {
    const code = generatePairingCode();
    setGeneratedCode(code);
    
    // Create relationship waiting for partner
    await createRelationship({
      partnerName: 'Waiting...',
      myRole: selectedRole === 'switch' ? 'switch' : selectedRole,
      theirRole: selectedRole === 'dom' ? 'sub' : (selectedRole === 'sub' ? 'dom' : 'switch'),
      pairingCode: code,
    });
  };

  const handleJoinWithCode = async () => {
    if (pairingCode.length !== 6) {
      showAlert('Please enter a 6-digit code');
      return;
    }

    // Create relationship with the code
    await createRelationship({
      partnerName: 'Partner',
      myRole: selectedRole === 'switch' ? 'switch' : selectedRole,
      theirRole: selectedRole === 'dom' ? 'sub' : (selectedRole === 'sub' ? 'dom' : 'switch'),
      pairingCode: pairingCode,
    });

    onComplete?.();
  };

  const showAlert = (message) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Notice', message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Progress indicator */}
      <View style={styles.progress}>
        <View style={[styles.progressDot, step >= 1 && styles.progressDotActive]} />
        <View style={styles.progressLine} />
        <View style={[styles.progressDot, step >= 2 && styles.progressDotActive]} />
        <View style={styles.progressLine} />
        <View style={[styles.progressDot, step >= 3 && styles.progressDotActive]} />
      </View>

      {/* Step 1: Role Selection */}
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Welcome to HypKnotic</Text>
          <Text style={styles.subtitle}>How would you like to use the app?</Text>

          <View style={styles.rolesContainer}>
            {ROLES.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  selectedRole === role.id && { borderColor: role.color, borderWidth: 2 },
                ]}
                onPress={() => handleRoleSelect(role.id)}
              >
                <View style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}>
                  <Ionicons name={role.icon} size={32} color={role.color} />
                </View>
                <Text style={styles.roleLabel}>{role.label}</Text>
                <Text style={styles.roleDescription}>{role.description}</Text>
                {selectedRole === role.id && (
                  <View style={[styles.checkmark, { backgroundColor: role.color }]}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={handleContinueFromRole}>
            <Text style={styles.primaryButtonText}>Continue</Text>
          </TouchableOpacity>
          
          {onSkip && (
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <Text style={styles.skipButtonText}>Skip for now (Dev Mode)</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Step 2: PIN Setup */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Secure Your App</Text>
          <Text style={styles.subtitle}>Create a PIN for quick access</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Display Name (optional)</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Your name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Create PIN (4-6 digits)</Text>
            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={(text) => setPin(text.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="Enter PIN"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm PIN</Text>
            <TextInput
              style={styles.input}
              value={confirmPin}
              onChangeText={(text) => setConfirmPin(text.replace(/[^0-9]/g, '').slice(0, 6))}
              placeholder="Confirm PIN"
              placeholderTextColor="#999"
              keyboardType="numeric"
              secureTextEntry
              maxLength={6}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(1)}>
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.primaryButton} onPress={handleContinueFromPin}>
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Step 3: Partner Pairing (optional) */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.title}>Connect with Partner</Text>
          <Text style={styles.subtitle}>
            {selectedRole === 'dom' 
              ? 'Generate a code for your Sub to enter' 
              : selectedRole === 'sub'
              ? 'Enter the code from your Dom'
              : 'Share or enter a code to connect'}
          </Text>

          {!isJoining && !generatedCode && (
            <View style={styles.pairingOptions}>
              <TouchableOpacity 
                style={styles.pairingOption}
                onPress={handleGenerateCode}
              >
                <Ionicons name="qr-code-outline" size={48} color="#9C27B0" />
                <Text style={styles.pairingOptionLabel}>Generate Code</Text>
                <Text style={styles.pairingOptionDesc}>Create a code for your partner to enter</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.pairingOption}
                onPress={() => setIsJoining(true)}
              >
                <Ionicons name="enter-outline" size={48} color="#9C27B0" />
                <Text style={styles.pairingOptionLabel}>Enter Code</Text>
                <Text style={styles.pairingOptionDesc}>Join using your partner's code</Text>
              </TouchableOpacity>
            </View>
          )}

          {generatedCode && (
            <View style={styles.codeDisplay}>
              <Text style={styles.codeLabel}>Your pairing code:</Text>
              <Text style={styles.codeValue}>{generatedCode}</Text>
              <Text style={styles.codeHint}>Share this code with your partner</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => onComplete?.()}>
                <Text style={styles.primaryButtonText}>Done - Wait for Partner</Text>
              </TouchableOpacity>
            </View>
          )}

          {isJoining && (
            <View style={styles.codeEntry}>
              <Text style={styles.codeLabel}>Enter partner's code:</Text>
              <TextInput
                style={styles.codeInput}
                value={pairingCode}
                onChangeText={(text) => setPairingCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={6}
              />
              <TouchableOpacity style={styles.primaryButton} onPress={handleJoinWithCode}>
                <Text style={styles.primaryButtonText}>Connect</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.linkButton} 
                onPress={() => setIsJoining(false)}
              >
                <Text style={styles.linkButtonText}>Back</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.skipButton} onPress={handleSkipPartner}>
            <Text style={styles.skipButtonText}>Skip for now - I'll add a partner later</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  progress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#444',
  },
  progressDotActive: {
    backgroundColor: '#9C27B0',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#444',
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  rolesContainer: {
    gap: 16,
    marginBottom: 24,
  },
  roleCard: {
    backgroundColor: '#252542',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
  },
  roleIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  roleLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    color: '#888',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#252542',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#9C27B0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  pairingOptions: {
    gap: 16,
    marginBottom: 24,
  },
  pairingOption: {
    backgroundColor: '#252542',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  pairingOptionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
  },
  pairingOptionDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
  codeDisplay: {
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 12,
  },
  codeValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#9C27B0',
    letterSpacing: 8,
    marginBottom: 8,
  },
  codeHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  codeEntry: {
    alignItems: 'center',
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  linkButton: {
    padding: 12,
    marginTop: 8,
  },
  linkButtonText: {
    color: '#9C27B0',
    fontSize: 16,
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
