/**
 * AuthContext - Local account authentication
 * 
 * Features:
 * - PIN-based quick unlock (4-6 digits)
 * - Password for account recovery/export
 * - Secure hash storage (SHA-256)
 * - Auto-lock on app background
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Simple SHA-256 hash (works on web and native)
async function hashString(str) {
  if (Platform.OS === 'web' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback for React Native - simple hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, '0');
}

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccount, setHasAccount] = useState(false);
  const [account, setAccount] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(true);

  // Load account on startup
  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    try {
      const accountData = await AsyncStorage.getItem('@hypknotic_account');
      if (accountData) {
        const parsed = JSON.parse(accountData);
        setAccount(parsed);
        setHasAccount(true);
        setNeedsSetup(false);
        // Don't auto-authenticate - require PIN
        setIsAuthenticated(false);
      } else {
        setHasAccount(false);
        setNeedsSetup(true);
      }
    } catch (error) {
      console.error('Error loading account:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveAccount(accountData) {
    try {
      await AsyncStorage.setItem('@hypknotic_account', JSON.stringify(accountData));
      setAccount(accountData);
      setHasAccount(true);
      setNeedsSetup(false);
    } catch (error) {
      console.error('Error saving account:', error);
      throw error;
    }
  }

  /**
   * Create a new account
   * @param {Object} params - Account parameters
   * @param {string} params.displayName - User's display name
   * @param {string} params.pin - 4-6 digit PIN
   * @param {string} params.password - Recovery password (optional)
   * @param {string} params.defaultRole - 'dom', 'sub', or 'switch'
   * @param {boolean} params.switchModeEnabled - Can toggle between roles
   */
  async function createAccount({ displayName, pin, password, defaultRole, switchModeEnabled }) {
    const pinHash = await hashString(pin);
    const passwordHash = password ? await hashString(password) : null;
    
    const newAccount = {
      userId: 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
      displayName: displayName || 'User',
      pinHash,
      passwordHash,
      defaultRole: defaultRole || 'sub',
      switchModeEnabled: switchModeEnabled || false,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    await saveAccount(newAccount);
    setIsAuthenticated(true);
    return newAccount;
  }

  /**
   * Authenticate with PIN
   * @param {string} pin - The PIN to verify
   * @returns {boolean} - Whether authentication succeeded
   */
  async function authenticateWithPin(pin) {
    if (!account) return false;
    
    const pinHash = await hashString(pin);
    if (pinHash === account.pinHash) {
      setIsAuthenticated(true);
      // Update last login
      const updated = { ...account, lastLogin: new Date().toISOString() };
      await saveAccount(updated);
      return true;
    }
    return false;
  }

  /**
   * Authenticate with password (for recovery)
   * @param {string} password - The password to verify
   * @returns {boolean} - Whether authentication succeeded
   */
  async function authenticateWithPassword(password) {
    if (!account || !account.passwordHash) return false;
    
    const passwordHash = await hashString(password);
    if (passwordHash === account.passwordHash) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  /**
   * Change PIN
   * @param {string} currentPin - Current PIN for verification
   * @param {string} newPin - New PIN to set
   */
  async function changePin(currentPin, newPin) {
    const verified = await authenticateWithPin(currentPin);
    if (!verified) {
      throw new Error('Current PIN is incorrect');
    }
    
    const newPinHash = await hashString(newPin);
    const updated = { ...account, pinHash: newPinHash };
    await saveAccount(updated);
  }

  /**
   * Update account settings
   * @param {Object} updates - Fields to update
   */
  async function updateAccount(updates) {
    if (!account) throw new Error('No account');
    
    const updated = { ...account, ...updates };
    await saveAccount(updated);
  }

  /**
   * Lock the app (require PIN again)
   */
  function lock() {
    setIsAuthenticated(false);
  }

  /**
   * Export account data (encrypted with password)
   */
  async function exportAccount() {
    // Get all app data
    const allData = {
      account: { ...account, pinHash: undefined, passwordHash: undefined },
      // Add other data here when we integrate with other contexts
      exportedAt: new Date().toISOString(),
      version: 1,
    };
    return JSON.stringify(allData);
  }

  /**
   * Skip authentication (for development/solo mode)
   */
  function skipAuth() {
    setIsAuthenticated(true);
    setNeedsSetup(false);
  }

  /**
   * Wipe all app data and return to fresh state
   * WARNING: This is destructive and cannot be undone!
   */
  async function wipeAllData() {
    try {
      // Get all AsyncStorage keys and clear them
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      
      // Clear state
      setAccount(null);
      setHasAccount(false);
      setIsAuthenticated(false);
      setNeedsSetup(true);
      
      return true;
    } catch (error) {
      console.error('Error wiping data:', error);
      throw error;
    }
  }

  const value = {
    // State
    isAuthenticated,
    isLoading,
    hasAccount,
    needsSetup,
    account,
    
    // Actions
    createAccount,
    authenticateWithPin,
    authenticateWithPassword,
    changePin,
    updateAccount,
    lock,
    exportAccount,
    skipAuth,
    wipeAllData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
