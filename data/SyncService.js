/**
 * SyncService - Orchestrates data synchronization
 * 
 * Handles:
 * - P2P direct sync when both partners online
 * - Relay server sync for offline messages
 * - Conflict resolution
 * - Change queuing
 */

import { storageService } from './StorageService';

class SyncService {
  constructor() {
    this.isConnected = false;
    this.partnerId = null;
    this.partnerRole = null; // 'dom' or 'sub'
    this.myRole = null;
    this.pendingChanges = [];
    this.onSyncCallbacks = [];
    this.connectionType = null; // 'p2p' | 'relay' | null
  }

  /**
   * Initialize the sync service
   */
  async initialize() {
    // Load saved pairing info
    const pairingData = await storageService.getItem('pairing');
    if (pairingData) {
      this.partnerId = pairingData.partnerId;
      this.partnerRole = pairingData.partnerRole;
      this.myRole = pairingData.myRole;
    }

    // Load any pending changes
    const pending = await storageService.getItem('pendingChanges');
    if (pending) {
      this.pendingChanges = pending;
    }
  }

  /**
   * Generate a pairing code for partner to use
   * @returns {string} 6-digit pairing code
   */
  generatePairingCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store temporarily (expires in 5 minutes)
    storageService.setItem('pendingPairing', {
      code,
      expires: Date.now() + 5 * 60 * 1000,
      role: this.myRole
    });
    return code;
  }

  /**
   * Enter a pairing code to connect with partner
   * @param {string} code - 6-digit pairing code
   * @returns {Promise<boolean>} success
   */
  async enterPairingCode(code) {
    // In a real implementation, this would:
    // 1. Send code to signaling server or use QR-based local exchange
    // 2. Receive partner's connection info
    // 3. Establish WebRTC connection
    
    // For now, simulate success
    console.log('Pairing with code:', code);
    return true;
  }

  /**
   * Set the current user's role
   * @param {'dom' | 'sub' | 'switch' | 'solo'} role 
   */
  async setRole(role) {
    this.myRole = role;
    await storageService.setItem('userRole', role);
  }

  /**
   * Get the current user's role
   * @returns {'dom' | 'sub' | 'switch' | 'solo'}
   */
  async getRole() {
    if (!this.myRole) {
      this.myRole = await storageService.getItem('userRole') || 'solo';
    }
    return this.myRole;
  }

  /**
   * Queue a change to be synced
   * @param {string} type - Type of change (e.g., 'task', 'reward', 'punishment')
   * @param {string} action - Action performed ('create', 'update', 'delete', 'complete')
   * @param {object} data - The data that changed
   */
  async queueChange(type, action, data) {
    const change = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      action,
      data,
      timestamp: Date.now(),
      synced: false
    };

    this.pendingChanges.push(change);
    await storageService.setItem('pendingChanges', this.pendingChanges);

    // If connected, try to sync immediately
    if (this.isConnected) {
      this.syncNow();
    }
  }

  /**
   * Attempt to sync all pending changes
   */
  async syncNow() {
    if (!this.isConnected || this.pendingChanges.length === 0) {
      return;
    }

    const toSync = this.pendingChanges.filter(c => !c.synced);
    
    for (const change of toSync) {
      try {
        // Send via P2P or relay
        await this.sendChange(change);
        change.synced = true;
      } catch (error) {
        console.error('Failed to sync change:', error);
      }
    }

    // Clean up synced changes
    this.pendingChanges = this.pendingChanges.filter(c => !c.synced);
    await storageService.setItem('pendingChanges', this.pendingChanges);
  }

  /**
   * Send a change to partner
   * @param {object} change 
   */
  async sendChange(change) {
    // This will be implemented by P2PService
    console.log('Sending change:', change);
  }

  /**
   * Receive a change from partner
   * @param {object} change 
   */
  async receiveChange(change) {
    // Apply the change based on role permissions
    const canApply = this.validateChangePermission(change);
    
    if (!canApply) {
      console.warn('Received unauthorized change:', change);
      return;
    }

    // Apply to local storage
    await this.applyChange(change);

    // Notify listeners
    this.onSyncCallbacks.forEach(cb => cb(change));
  }

  /**
   * Validate that the sender has permission for this change
   * @param {object} change 
   * @returns {boolean}
   */
  validateChangePermission(change) {
    const { type, action } = change;
    const senderRole = this.partnerRole;

    // Dom can create/update/delete tasks, rewards, punishments, rules
    const domOnlyActions = {
      task: ['create', 'update', 'delete', 'assign'],
      reward: ['create', 'update', 'delete'],
      punishment: ['create', 'update', 'delete', 'assign'],
      rule: ['create', 'update', 'delete'],
      points: ['award', 'deduct']
    };

    // Sub can complete tasks, use rewards, set limits
    const subOnlyActions = {
      task: ['complete', 'progress'],
      reward: ['use', 'purchase'],
      punishment: ['complete'],
      limit: ['create', 'update', 'delete'],
      request: ['create', 'update', 'delete']
    };

    if (senderRole === 'dom') {
      const allowed = domOnlyActions[type];
      return allowed ? allowed.includes(action) : false;
    } else if (senderRole === 'sub') {
      const allowed = subOnlyActions[type];
      return allowed ? allowed.includes(action) : false;
    }

    return false;
  }

  /**
   * Apply a change to local storage
   * @param {object} change 
   */
  async applyChange(change) {
    const { type, action, data } = change;
    
    // Get current data
    const storageKey = `${type}s`; // tasks, rewards, punishments, etc.
    const currentData = await storageService.getItem(storageKey) || [];

    switch (action) {
      case 'create':
        currentData.push(data);
        break;
      case 'update':
        const updateIndex = currentData.findIndex(item => item.id === data.id);
        if (updateIndex !== -1) {
          currentData[updateIndex] = { ...currentData[updateIndex], ...data };
        }
        break;
      case 'delete':
        const deleteIndex = currentData.findIndex(item => item.id === data.id);
        if (deleteIndex !== -1) {
          currentData.splice(deleteIndex, 1);
        }
        break;
      case 'complete':
      case 'progress':
        const progressIndex = currentData.findIndex(item => item.id === data.id);
        if (progressIndex !== -1) {
          currentData[progressIndex] = { ...currentData[progressIndex], ...data };
        }
        break;
    }

    await storageService.setItem(storageKey, currentData);
  }

  /**
   * Register a callback for when sync occurs
   * @param {function} callback 
   */
  onSync(callback) {
    this.onSyncCallbacks.push(callback);
    return () => {
      this.onSyncCallbacks = this.onSyncCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Disconnect from partner
   */
  async disconnect() {
    this.isConnected = false;
    this.partnerId = null;
    this.partnerRole = null;
    this.connectionType = null;
    await storageService.removeItem('pairing');
  }

  /**
   * Get sync status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      connectionType: this.connectionType,
      partnerId: this.partnerId,
      partnerRole: this.partnerRole,
      myRole: this.myRole,
      pendingChanges: this.pendingChanges.filter(c => !c.synced).length
    };
  }
}

export const syncService = new SyncService();
export default syncService;
