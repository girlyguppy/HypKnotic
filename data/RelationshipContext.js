/**
 * RelationshipContext - Multi-partner relationship management
 * 
 * Features:
 * - Multiple relationships per user
 * - Role per relationship (Dom/Sub/Switch)
 * - Per-relationship data (tasks, rewards, points)
 * - Visibility controls
 * - Gun.js sync for real-time partner sync
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GunSyncService from './GunSyncService';

const RelationshipContext = createContext();

export function RelationshipProvider({ children }) {
  const [relationships, setRelationships] = useState({});
  const [activeRelationshipId, setActiveRelationshipId] = useState(null);
  const [relationshipData, setRelationshipData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [soloMode, setSoloMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('sub'); // 'dom' or 'sub' - for switch/solo modes
  const [syncStatus, setSyncStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'syncing'
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  // Gun.js sync service instance
  const gunSyncRef = useRef(null);

  // Load on startup
  useEffect(() => {
    loadRelationships();
    initializeGunSync();
  }, []);

  // Initialize Gun.js sync
  async function initializeGunSync() {
    try {
      gunSyncRef.current = new GunSyncService();
      await gunSyncRef.current.initialize();
      setSyncStatus('disconnected');
      
      // Set up listeners
      gunSyncRef.current.addListener('partner_connected', () => {
        setSyncStatus('connected');
      });
      
      gunSyncRef.current.addListener('sync_pushed', ({ timestamp }) => {
        setLastSyncTime(timestamp);
        setSyncStatus('connected');
      });
      
      gunSyncRef.current.addListener('sync_received', ({ data }) => {
        // Handle incoming sync data
        handleIncomingSync(data);
      });
      
      console.log('Gun.js sync initialized');
    } catch (error) {
      console.error('Failed to initialize Gun.js sync:', error);
    }
  }
  
  // Handle incoming sync data from partner
  async function handleIncomingSync(data) {
    if (!activeRelationshipId || !data) return;
    
    const currentData = relationshipData[activeRelationshipId] || {};
    const merged = await gunSyncRef.current?.pullAndMerge(currentData) || currentData;
    
    await updateRelationshipData(activeRelationshipId, merged);
    setLastSyncTime(Date.now());
  }

  async function loadRelationships() {
    try {
      const [relsData, dataData, activeId, solo] = await Promise.all([
        AsyncStorage.getItem('@hypknotic_relationships'),
        AsyncStorage.getItem('@hypknotic_relationship_data'),
        AsyncStorage.getItem('@hypknotic_active_relationship'),
        AsyncStorage.getItem('@hypknotic_solo_mode'),
      ]);

      if (relsData) setRelationships(JSON.parse(relsData));
      if (dataData) setRelationshipData(JSON.parse(dataData));
      if (activeId) setActiveRelationshipId(activeId);
      if (solo === 'true') setSoloMode(true);
    } catch (error) {
      console.error('Error loading relationships:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveRelationships(rels) {
    await AsyncStorage.setItem('@hypknotic_relationships', JSON.stringify(rels));
    setRelationships(rels);
  }

  async function saveRelationshipData(data) {
    await AsyncStorage.setItem('@hypknotic_relationship_data', JSON.stringify(data));
    setRelationshipData(data);
  }

  async function saveActiveRelationship(id) {
    await AsyncStorage.setItem('@hypknotic_active_relationship', id || '');
    setActiveRelationshipId(id);
  }

  /**
   * Enable solo mode (no partner needed)
   */
  async function enableSoloMode() {
    const soloId = 'solo_' + Date.now();
    const soloRel = {
      id: soloId,
      partnerId: null,
      partnerName: 'Solo Mode',
      myRole: 'switch', // Full access in solo mode
      theirRole: null,
      isSolo: true,
      createdAt: new Date().toISOString(),
      visibility: {
        canSeeOthers: false,
        othersCanSee: false,
        sharedWith: [],
      },
    };

    const newRels = { ...relationships, [soloId]: soloRel };
    const newData = {
      ...relationshipData,
      [soloId]: {
        tasks: [],
        rewards: [],
        punishments: [],
        history: [],
        totalPoints: 0,
        notes: [],
        journals: [],
      },
    };

    await saveRelationships(newRels);
    await saveRelationshipData(newData);
    await saveActiveRelationship(soloId);
    await AsyncStorage.setItem('@hypknotic_solo_mode', 'true');
    setSoloMode(true);

    return soloId;
  }

  /**
   * Create a new relationship
   * @param {Object} params
   * @param {string} params.partnerName - Partner's display name
   * @param {string} params.myRole - 'dom', 'sub', or 'switch'
   * @param {string} params.theirRole - 'dom', 'sub', or 'switch'
   * @param {string} params.pairingCode - Generated or entered code
   */
  async function createRelationship({ partnerName, myRole, theirRole, pairingCode }) {
    const relId = 'rel_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    
    const newRel = {
      id: relId,
      partnerId: pairingCode, // Will be updated when partner connects
      partnerName: partnerName || 'Partner',
      myRole: myRole || 'sub',
      theirRole: theirRole || 'dom',
      pairingCode,
      isPaired: false,
      createdAt: new Date().toISOString(),
      lastSync: null,
      visibility: {
        canSeeOthers: false,
        othersCanSee: false,
        sharedWith: [],
      },
    };

    const newRels = { ...relationships, [relId]: newRel };
    const newData = {
      ...relationshipData,
      [relId]: {
        tasks: [],
        rewards: [],
        punishments: [],
        history: [],
        totalPoints: 0,
        notes: [],
        journals: [],
      },
    };

    await saveRelationships(newRels);
    await saveRelationshipData(newData);
    
    // Set as active if first relationship
    if (!activeRelationshipId || soloMode) {
      await saveActiveRelationship(relId);
    }

    return relId;
  }

  /**
   * Generate a 6-digit pairing code for a new relationship
   * This also registers the code with Gun.js for real-time pairing
   */
  function generatePairingCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Register with Gun.js for real-time pairing
    if (gunSyncRef.current) {
      try {
        gunSyncRef.current.generatePairingCode(code);
        setSyncStatus('connecting');
        console.log('Pairing code registered with Gun.js:', code);
      } catch (error) {
        console.error('Failed to register pairing code:', error);
      }
    }
    
    return code;
  }
  
  /**
   * Join an existing pairing using a code
   */
  async function joinWithPairingCode(code) {
    if (!gunSyncRef.current) {
      throw new Error('Sync service not initialized');
    }
    
    setSyncStatus('connecting');
    
    try {
      const success = await gunSyncRef.current.joinWithCode(code);
      if (success) {
        setSyncStatus('connected');
        return true;
      }
    } catch (error) {
      console.error('Failed to join with code:', error);
      setSyncStatus('disconnected');
      throw error;
    }
    
    return false;
  }
  
  /**
   * Push current state to partner via Gun.js
   */
  async function syncWithPartner() {
    if (!gunSyncRef.current || !activeRelationshipId) return;
    
    const currentData = relationshipData[activeRelationshipId];
    if (!currentData) return;
    
    setSyncStatus('syncing');
    
    try {
      await gunSyncRef.current.pushFullState(currentData);
      setLastSyncTime(Date.now());
      setSyncStatus('connected');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('connected');
    }
  }

  /**
   * Switch to a different relationship
   */
  async function switchRelationship(relId) {
    if (relationships[relId]) {
      await saveActiveRelationship(relId);
    }
  }

  /**
   * Update relationship settings
   */
  async function updateRelationship(relId, updates) {
    if (!relationships[relId]) return;
    
    const updated = { ...relationships[relId], ...updates };
    const newRels = { ...relationships, [relId]: updated };
    await saveRelationships(newRels);
  }

  /**
   * Update visibility settings for a relationship
   */
  async function updateVisibility(relId, visibility) {
    await updateRelationship(relId, { visibility });
  }

  /**
   * Get data for a specific relationship
   */
  function getRelationshipData(relId) {
    return relationshipData[relId] || {
      tasks: [],
      rewards: [],
      punishments: [],
      history: [],
      totalPoints: 0,
    };
  }

  /**
   * Update data for a relationship
   */
  async function updateRelationshipData(relId, updates) {
    const current = getRelationshipData(relId);
    const updated = { ...current, ...updates };
    const newData = { ...relationshipData, [relId]: updated };
    await saveRelationshipData(newData);
  }

  /**
   * Delete a relationship
   */
  async function deleteRelationship(relId) {
    const { [relId]: removed, ...rest } = relationships;
    const { [relId]: removedData, ...restData } = relationshipData;
    
    await saveRelationships(rest);
    await saveRelationshipData(restData);
    
    // Switch to another relationship if we deleted the active one
    if (activeRelationshipId === relId) {
      const remaining = Object.keys(rest);
      await saveActiveRelationship(remaining[0] || null);
    }
  }

  /**
   * Get the current active relationship
   */
  function getActiveRelationship() {
    if (!activeRelationshipId) return null;
    return relationships[activeRelationshipId] || null;
  }

  /**
   * Get all relationships where I am a specific role
   */
  function getRelationshipsByRole(role) {
    return Object.values(relationships).filter(r => r.myRole === role);
  }

  /**
   * Check if user can perform an action based on their role in the active relationship
   */
  function canPerformAction(action) {
    const rel = getActiveRelationship();
    if (!rel) return false;
    if (rel.isSolo) return true; // Solo mode = full access
    
    const domActions = ['createTask', 'createReward', 'createPunishment', 'awardPoints', 'editRules'];
    const subActions = ['completeTask', 'useReward', 'requestRule', 'setLimits'];
    
    // For switch mode, check currentMode
    if (rel.myRole === 'switch') {
      if (currentMode === 'dom') return domActions.includes(action);
      if (currentMode === 'sub') return subActions.includes(action);
      return true;
    }
    
    if (rel.myRole === 'dom') return domActions.includes(action);
    if (rel.myRole === 'sub') return subActions.includes(action);
    
    return false;
  }

  /**
   * Toggle between dom and sub mode (for solo or switch roles)
   */
  function toggleMode() {
    setCurrentMode(prev => prev === 'dom' ? 'sub' : 'dom');
  }

  /**
   * Set the active relationship by ID
   */
  async function setActiveRelationship(relId) {
    await saveActiveRelationship(relId);
  }

  /**
   * Get the active relationship object (for ModeSwitcher)
   */
  const activeRelationship = relationships[activeRelationshipId] || null;

  /**
   * Check if we're in solo mode
   */
  const isSoloMode = soloMode || activeRelationship?.isSolo || false;

  const value = {
    // State
    relationships: Object.values(relationships), // Array for easier mapping
    activeRelationshipId,
    activeRelationship,
    relationshipData,
    isLoading,
    soloMode,
    isSoloMode,
    currentMode,
    syncStatus,
    lastSyncTime,
    
    // Actions
    enableSoloMode,
    createRelationship,
    generatePairingCode,
    joinWithPairingCode,
    syncWithPartner,
    switchRelationship,
    setActiveRelationship,
    toggleMode,
    updateRelationship,
    updateVisibility,
    getRelationshipData,
    updateRelationshipData,
    deleteRelationship,
    getActiveRelationship,
    getRelationshipsByRole,
    canPerformAction,
  };

  return (
    <RelationshipContext.Provider value={value}>
      {children}
    </RelationshipContext.Provider>
  );
}

export function useRelationships() {
  const context = useContext(RelationshipContext);
  if (!context) {
    throw new Error('useRelationships must be used within RelationshipProvider');
  }
  return context;
}

// Alias for convenience
export function useRelationship() {
  return useRelationships();
}

export default RelationshipContext;
