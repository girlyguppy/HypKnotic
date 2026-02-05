/**
 * StorageService - Local data persistence with sync-ready architecture
 * 
 * Architecture Overview:
 * ----------------------
 * This app uses a "local-first" approach with optional peer-to-peer syncing:
 * 
 * 1. LOCAL STORAGE (AsyncStorage)
 *    - All user data is stored locally on the device
 *    - Works offline, fast, and private
 *    - Data is encrypted at rest by the device OS
 * 
 * 2. EXPORT/IMPORT (Manual Backup)
 *    - Users can export their data as encrypted JSON
 *    - Import on a new device to restore
 *    - Share export file via any method (email, cloud drive, etc.)
 * 
 * 3. PEER-TO-PEER PAIRING (Future: WebRTC/LibP2P)
 *    - Direct connection between two users (Dom/Sub)
 *    - No central server needed
 *    - Data syncs directly between paired devices
 *    - Uses pairing codes for initial connection
 * 
 * 4. OPTIONAL SELF-HOSTED SYNC (Future)
 *    - Users who want always-on sync can self-host a simple relay server
 *    - Open-source server component included in repo
 *    - Or use any WebSocket-compatible hosting (free tiers available)
 * 
 * Privacy Benefits:
 * - No central database = no data breach risk
 * - No account required for basic usage
 * - Encrypted exports for backup
 * - Peer-to-peer = only paired users can see data
 */

import { Platform } from 'react-native';

// AsyncStorage import with web fallback
let AsyncStorage;
if (Platform.OS === 'web') {
  // Web fallback using localStorage
  AsyncStorage = {
    getItem: async (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error('localStorage getItem error:', e);
        return null;
      }
    },
    setItem: async (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error('localStorage setItem error:', e);
      }
    },
    removeItem: async (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error('localStorage removeItem error:', e);
      }
    },
    getAllKeys: async () => {
      try {
        return Object.keys(localStorage).filter(k => k.startsWith('hypknotic_'));
      } catch (e) {
        console.error('localStorage getAllKeys error:', e);
        return [];
      }
    },
    multiGet: async (keys) => {
      try {
        return keys.map(k => [k, localStorage.getItem(k)]);
      } catch (e) {
        console.error('localStorage multiGet error:', e);
        return [];
      }
    },
    clear: async () => {
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('hypknotic_'));
        keys.forEach(k => localStorage.removeItem(k));
      } catch (e) {
        console.error('localStorage clear error:', e);
      }
    }
  };
} else {
  // Native platforms use AsyncStorage
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
}

// Storage keys
const STORAGE_KEYS = {
  // User data
  PROFILE: 'hypknotic_profile',
  SETTINGS: 'hypknotic_settings',
  THEME: 'hypknotic_theme',
  
  // Core app data
  REWARDS: 'hypknotic_rewards',
  PUNISHMENTS: 'hypknotic_punishments',
  TASKS: 'hypknotic_tasks',
  POINTS: 'hypknotic_points',
  
  // Content
  NOTES: 'hypknotic_notes',
  JOURNALS: 'hypknotic_journals',
  RULES: 'hypknotic_rules',
  
  // History & tracking
  HISTORY: 'hypknotic_history',
  
  // Pairing
  PAIRING_CODE: 'hypknotic_pairing_code',
  PARTNER_INFO: 'hypknotic_partner_info',
  
  // Sync metadata
  LAST_SYNC: 'hypknotic_last_sync',
  PENDING_CHANGES: 'hypknotic_pending_changes',
};

/**
 * Save data to local storage
 */
export const saveData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify({
      data,
      timestamp: Date.now(),
      version: 1,
    });
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (e) {
    console.error('Error saving data:', e);
    return false;
  }
};

/**
 * Load data from local storage
 */
export const loadData = async (key, defaultValue = null) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue);
      return parsed.data !== undefined ? parsed.data : parsed;
    }
    return defaultValue;
  } catch (e) {
    console.error('Error loading data:', e);
    return defaultValue;
  }
};

/**
 * Remove data from local storage
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error('Error removing data:', e);
    return false;
  }
};

/**
 * Export all user data as JSON (for backup/transfer)
 */
export const exportAllData = async () => {
  try {
    const allData = {};
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
      const data = await loadData(key);
      if (data !== null) {
        allData[name] = data;
      }
    }
    
    return {
      exportVersion: 1,
      appVersion: '1.0.0',
      exportDate: new Date().toISOString(),
      data: allData,
    };
  } catch (e) {
    console.error('Error exporting data:', e);
    return null;
  }
};

/**
 * Import data from backup JSON
 */
export const importAllData = async (exportData) => {
  try {
    if (!exportData || !exportData.data) {
      throw new Error('Invalid export data format');
    }
    
    for (const [name, data] of Object.entries(exportData.data)) {
      const key = STORAGE_KEYS[name];
      if (key) {
        await saveData(key, data);
      }
    }
    
    return true;
  } catch (e) {
    console.error('Error importing data:', e);
    return false;
  }
};

/**
 * Clear all app data (factory reset)
 */
export const clearAllData = async () => {
  try {
    for (const key of Object.values(STORAGE_KEYS)) {
      await AsyncStorage.removeItem(key);
    }
    return true;
  } catch (e) {
    console.error('Error clearing data:', e);
    return false;
  }
};

/**
 * Generate a unique pairing code for connecting with partner
 */
export const generatePairingCode = () => {
  // Generate 6-character alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Generate a unique device/user ID
 */
export const generateUserId = () => {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Export storage keys for use in contexts
export { STORAGE_KEYS };

export default {
  saveData,
  loadData,
  removeData,
  exportAllData,
  importAllData,
  clearAllData,
  generatePairingCode,
  generateUserId,
  STORAGE_KEYS,
};
