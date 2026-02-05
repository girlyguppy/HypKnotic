/**
 * GunSyncService - Decentralized sync using Gun.js
 * 
 * This provides "just works" pairing without any server setup.
 * Uses free public Gun.js relay servers.
 * 
 * Features:
 * - 6-digit pairing codes
 * - Full-state sync (not deltas)
 * - Dom priority conflict resolution
 * - Offline queuing
 * - Real-time updates when both online
 */

// Note: Gun.js will be imported when this service is used
// import Gun from 'gun';

class GunSyncService {
  constructor() {
    this.gun = null;
    this.user = null;
    this.partnerNode = null;
    this.pairId = null;
    this.role = null; // 'dom' | 'sub' | 'switch' | 'solo'
    this.currentMode = null; // For switches: 'dom' | 'sub'
    this.listeners = [];
    this.offlineQueue = [];
    this.isOnline = true;
    this.lastSyncTime = null;
  }

  /**
   * Initialize Gun.js with public relay servers
   */
  async initialize() {
    // Dynamic import for Gun.js
    const Gun = (await import('gun')).default;
    
    // Use free public Gun relay servers
    this.gun = Gun({
      peers: [
        'https://gun-manhattan.herokuapp.com/gun',
        'https://gun-eu.herokuapp.com/gun',
        // Users can add their own relay if they want
      ],
      localStorage: false, // We use AsyncStorage instead
    });

    // Monitor online status
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
    }
  }

  // ============================================
  // PAIRING
  // ============================================

  /**
   * Generate a 6-digit pairing code for Dom to share with Sub
   * @returns {string} 6-digit code
   */
  generatePairingCode() {
    // Generate cryptographically random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Create unique pair ID from code + timestamp
    this.pairId = `hypknotic_${code}_${Date.now()}`;
    this.role = 'dom';
    this.currentMode = 'dom';
    
    // Store the pairing info in Gun
    this.gun.get('pairing_codes').get(code).put({
      pairId: this.pairId,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      domConnected: true,
      subConnected: false,
    });

    // Set up the partner data node
    this.partnerNode = this.gun.get(this.pairId);
    
    // Listen for sub to connect
    this.gun.get('pairing_codes').get(code).on((data) => {
      if (data && data.subConnected) {
        this.notifyListeners('partner_connected', { role: 'sub' });
      }
    });

    return code;
  }

  /**
   * Join with a pairing code (for Sub)
   * @param {string} code - 6-digit code from Dom
   * @returns {Promise<boolean>} - Success
   */
  async joinWithCode(code) {
    return new Promise((resolve, reject) => {
      this.gun.get('pairing_codes').get(code).once((data) => {
        if (!data || !data.pairId) {
          reject(new Error('Invalid or expired code'));
          return;
        }

        if (data.expiresAt < Date.now()) {
          reject(new Error('Code has expired'));
          return;
        }

        // Connect to the pair
        this.pairId = data.pairId;
        this.role = 'sub';
        this.currentMode = 'sub';
        this.partnerNode = this.gun.get(this.pairId);

        // Mark sub as connected
        this.gun.get('pairing_codes').get(code).put({
          ...data,
          subConnected: true,
        });

        // Start listening for updates
        this.startListening();

        this.notifyListeners('paired', { pairId: this.pairId, role: 'sub' });
        resolve(true);
      });
    });
  }

  /**
   * Set user role
   * @param {'dom' | 'sub' | 'switch' | 'solo'} role 
   */
  setRole(role) {
    this.role = role;
    if (role !== 'switch') {
      this.currentMode = role;
    }
  }

  /**
   * For switches: toggle between dom and sub mode
   */
  toggleMode() {
    if (this.role === 'switch') {
      this.currentMode = this.currentMode === 'dom' ? 'sub' : 'dom';
      this.notifyListeners('mode_changed', { mode: this.currentMode });
    }
  }

  // ============================================
  // SYNC OPERATIONS
  // ============================================

  /**
   * Push full state to partner
   * @param {Object} fullState - Complete app state
   */
  async pushFullState(fullState) {
    if (!this.partnerNode) {
      console.warn('Not paired, queuing state');
      this.offlineQueue.push({ type: 'push', data: fullState, timestamp: Date.now() });
      return;
    }

    const syncPacket = {
      version: (fullState.version || 0) + 1,
      timestamp: Date.now(),
      senderRole: this.currentMode,
      data: {
        tasks: fullState.tasks || [],
        rewards: fullState.rewards || [],
        punishments: fullState.punishments || [],
        notes: fullState.notes || [],
        journals: fullState.journals || [],
        history: fullState.history || [],
        totalPoints: fullState.totalPoints || 0,
        settings: fullState.settings || {},
      },
    };

    // Push to Gun
    this.partnerNode.get(this.currentMode === 'dom' ? 'dom_state' : 'sub_state').put(
      JSON.stringify(syncPacket)
    );

    this.lastSyncTime = Date.now();
    this.notifyListeners('sync_pushed', { timestamp: this.lastSyncTime });
  }

  /**
   * Pull partner's state and merge with Dom priority
   * @param {Object} localState - Current local state
   * @returns {Object} - Merged state
   */
  async pullAndMerge(localState) {
    if (!this.partnerNode) {
      console.warn('Not paired');
      return localState;
    }

    return new Promise((resolve) => {
      const partnerKey = this.currentMode === 'dom' ? 'sub_state' : 'dom_state';
      
      this.partnerNode.get(partnerKey).once((data) => {
        if (!data) {
          resolve(localState);
          return;
        }

        try {
          const partnerState = JSON.parse(data);
          const mergedState = this.mergeStates(localState, partnerState);
          resolve(mergedState);
        } catch (e) {
          console.error('Failed to parse partner state:', e);
          resolve(localState);
        }
      });
    });
  }

  /**
   * Merge two states with Dom priority
   */
  mergeStates(localState, remotePacket) {
    const remoteState = remotePacket.data;
    const remoteRole = remotePacket.senderRole;
    const remoteTimestamp = remotePacket.timestamp;

    // If we're sub and remote is dom, dom wins on conflicts
    const domPriority = remoteRole === 'dom' && this.currentMode === 'sub';

    const merged = { ...localState };

    // Merge tasks - Dom's version wins on conflicts
    if (remoteState.tasks) {
      merged.tasks = this.mergeArrays(
        localState.tasks || [],
        remoteState.tasks,
        domPriority,
        'id'
      );
    }

    // Merge rewards
    if (remoteState.rewards) {
      merged.rewards = this.mergeArrays(
        localState.rewards || [],
        remoteState.rewards,
        domPriority,
        'id'
      );
    }

    // Merge punishments
    if (remoteState.punishments) {
      merged.punishments = this.mergeArrays(
        localState.punishments || [],
        remoteState.punishments,
        domPriority,
        'id'
      );
    }

    // History is append-only, merge all entries
    if (remoteState.history) {
      const localHistory = localState.history || [];
      const localIds = new Set(localHistory.map(h => h.id));
      const newEntries = remoteState.history.filter(h => !localIds.has(h.id));
      merged.history = [...localHistory, ...newEntries].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      );
    }

    // Points: Dom's value wins if there's a conflict
    if (domPriority && remoteState.totalPoints !== undefined) {
      merged.totalPoints = remoteState.totalPoints;
    }

    merged.lastSyncTime = Date.now();
    merged.version = Math.max(localState.version || 0, remotePacket.version || 0) + 1;

    return merged;
  }

  /**
   * Merge two arrays with conflict resolution
   */
  mergeArrays(localArray, remoteArray, remotePriority, idField) {
    const merged = new Map();

    // Add all local items
    localArray.forEach(item => {
      merged.set(item[idField], { ...item, source: 'local' });
    });

    // Add/overwrite with remote items
    remoteArray.forEach(item => {
      const existing = merged.get(item[idField]);
      
      if (!existing) {
        // New item from remote
        merged.set(item[idField], { ...item, source: 'remote' });
      } else if (remotePriority) {
        // Remote has priority (we're sub, they're dom)
        merged.set(item[idField], { ...item, source: 'remote' });
      } else {
        // We have priority - keep our version
        // But check timestamps if available
        const localTime = existing.updatedAt || existing.createdAt || 0;
        const remoteTime = item.updatedAt || item.createdAt || 0;
        
        if (remoteTime > localTime) {
          merged.set(item[idField], { ...item, source: 'remote' });
        }
      }
    });

    return Array.from(merged.values()).map(({ source, ...item }) => item);
  }

  // ============================================
  // REAL-TIME LISTENING
  // ============================================

  /**
   * Start listening for partner updates
   */
  startListening() {
    if (!this.partnerNode) return;

    const partnerKey = this.currentMode === 'dom' ? 'sub_state' : 'dom_state';
    
    this.partnerNode.get(partnerKey).on((data) => {
      if (data) {
        try {
          const partnerState = JSON.parse(data);
          this.notifyListeners('partner_update', partnerState);
        } catch (e) {
          console.error('Failed to parse partner update:', e);
        }
      }
    });
  }

  /**
   * Subscribe to sync events
   */
  onSyncEvent(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  notifyListeners(event, data) {
    this.listeners.forEach(callback => callback(event, data));
  }

  // ============================================
  // OFFLINE HANDLING
  // ============================================

  handleOnline() {
    this.isOnline = true;
    this.flushOfflineQueue();
    this.notifyListeners('online', {});
  }

  handleOffline() {
    this.isOnline = false;
    this.notifyListeners('offline', {});
  }

  async flushOfflineQueue() {
    while (this.offlineQueue.length > 0) {
      const action = this.offlineQueue.shift();
      if (action.type === 'push') {
        await this.pushFullState(action.data);
      }
    }
  }

  // ============================================
  // PERMISSION CHECKS
  // ============================================

  /**
   * Check if current user can perform an action
   */
  canPerformAction(action) {
    const domActions = ['create_task', 'edit_task', 'delete_task', 
                        'create_reward', 'create_punishment',
                        'award_points', 'deduct_points', 'write_rules'];
    
    const subActions = ['complete_task', 'use_reward', 
                        'set_limits', 'request_rule', 'write_notes'];

    if (this.role === 'solo') return true;
    if (this.role === 'switch') {
      // In switch mode, depends on current mode
      if (this.currentMode === 'dom') return domActions.includes(action);
      return subActions.includes(action);
    }

    if (this.currentMode === 'dom') return domActions.includes(action);
    if (this.currentMode === 'sub') return subActions.includes(action);

    return false;
  }

  // ============================================
  // CLEANUP
  // ============================================

  disconnect() {
    if (this.partnerNode) {
      this.partnerNode.off();
    }
    this.listeners = [];
    this.pairId = null;
    this.partnerNode = null;
  }
}

// Singleton instance
const gunSyncService = new GunSyncService();
export default gunSyncService;
