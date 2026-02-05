/**
 * LoginScreen - PIN entry for app unlock
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../data/AuthContext';

export default function LoginScreen() {
  const { authenticateWithPin, account } = useAuth();
  const [pin, setPin] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const handlePinChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(cleaned);
    setError('');
    
    // Auto-submit when PIN length matches expected
    if (cleaned.length >= 4 && cleaned.length === 6) {
      handleSubmit(cleaned);
    }
  };

  const handleSubmit = async (pinToCheck = pin) => {
    if (pinToCheck.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }

    const success = await authenticateWithPin(pinToCheck);
    if (!success) {
      setAttempts(prev => prev + 1);
      setError('Incorrect PIN');
      setPin('');
      
      if (attempts >= 4) {
        if (Platform.OS === 'web') {
          window.alert('Too many failed attempts. Please wait a moment.');
        } else {
          Alert.alert('Too Many Attempts', 'Please wait a moment before trying again.');
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed" size={64} color="#9C27B0" />
        </View>

        <Text style={styles.title}>Welcome Back</Text>
        {account?.displayName && (
          <Text style={styles.name}>{account.displayName}</Text>
        )}
        <Text style={styles.subtitle}>Enter your PIN to continue</Text>

        <View style={styles.pinContainer}>
          <TextInput
            style={styles.pinInput}
            value={pin}
            onChangeText={handlePinChange}
            placeholder="• • • •"
            placeholderTextColor="#666"
            keyboardType="numeric"
            secureTextEntry
            maxLength={6}
            autoFocus
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.submitButton, pin.length < 4 && styles.submitButtonDisabled]} 
          onPress={() => handleSubmit()}
          disabled={pin.length < 4}
        >
          <Text style={styles.submitButtonText}>Unlock</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotButtonText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#9C27B020',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    color: '#9C27B0',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  pinContainer: {
    width: '100%',
    marginBottom: 16,
  },
  pinInput: {
    backgroundColor: '#252542',
    borderRadius: 16,
    padding: 20,
    fontSize: 32,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 12,
    borderWidth: 2,
    borderColor: '#333',
  },
  error: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    width: '100%',
    backgroundColor: '#9C27B0',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#555',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotButton: {
    padding: 12,
  },
  forgotButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
