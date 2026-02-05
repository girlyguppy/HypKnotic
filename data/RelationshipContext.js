/**
 * RelationshipContext - Multi-partner relationship management
 * 
 * Features:
 * - Multiple relationships per user
 * - Role per relationship (Dom/Sub/Switch)
 * - Per-relationship data (tasks, rewards, points)
 * - Visibility controls
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RelationshipContext = createContext();

export function RelationshipProvider({ children }) {
  const [relationships, setRelationships] = useState({});
  const [activeRelationshipId, setActiveRelationshipId] = useState(null);
  const [relationshipData, setRelationshipData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [soloMode, setSoloMode] = useState(false);

  // Load on startup
  useEffect(() => {
    loadRelationships();
  }, []);

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
   */
  function generatePairingCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
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
    
    if (rel.myRole === 'switch') return true;
    if (rel.myRole === 'dom') return domActions.includes(action);
    if (rel.myRole === 'sub') return subActions.includes(action);
    
    return false;
  }

  const value = {
    // State
    relationships,
    activeRelationshipId,
    relationshipData,
    isLoading,
    soloMode,
    
    // Actions
    enableSoloMode,
    createRelationship,
    generatePairingCode,
    switchRelationship,
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

export default RelationshipContext;
