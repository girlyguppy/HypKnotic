/**
 * P2PService - WebRTC peer-to-peer connection handling
 * 
 * Provides direct encrypted connection between Dom and Sub
 * when both are online simultaneously.
 */

import { syncService } from './SyncService';

class P2PService {
  constructor() {
    this.peerConnection = null;
    this.dataChannel = null;
    this.isInitiator = false;
    this.connectionState = 'disconnected'; // disconnected, connecting, connected
    this.onStateChangeCallbacks = [];
    this.onMessageCallbacks = [];
    
    // WebRTC configuration
    this.config = {
      iceServers: [
        // Free STUN servers
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' },
        // OpenRelay TURN servers (free tier)
        { urls: 'stun:openrelay.metered.ca:80' },
      ]
    };
  }

  /**
   * Initialize WebRTC (requires react-native-webrtc on mobile)
   */
  async initialize() {
    // Check if WebRTC is available
    if (typeof RTCPeerConnection === 'undefined') {
      console.warn('WebRTC not available on this platform');
      return false;
    }
    return true;
  }

  /**
   * Create a new peer connection as initiator (Dom typically)
   * @returns {Promise<string>} Offer SDP to share with partner
   */
  async createOffer() {
    this.isInitiator = true;
    this.setConnectionState('connecting');

    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.config);
      this.setupPeerConnectionHandlers();

      // Create data channel
      this.dataChannel = this.peerConnection.createDataChannel('sync', {
        ordered: true
      });
      this.setupDataChannelHandlers();

      // Create offer
      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await this.waitForIceGathering();

      return JSON.stringify(this.peerConnection.localDescription);
    } catch (error) {
      console.error('Error creating offer:', error);
      this.setConnectionState('disconnected');
      throw error;
    }
  }

  /**
   * Accept an offer and create answer (Sub typically)
   * @param {string} offerSdp - The offer SDP from initiator
   * @returns {Promise<string>} Answer SDP to send back
   */
  async acceptOffer(offerSdp) {
    this.isInitiator = false;
    this.setConnectionState('connecting');

    try {
      // Create peer connection
      this.peerConnection = new RTCPeerConnection(this.config);
      this.setupPeerConnectionHandlers();

      // Handle incoming data channel
      this.peerConnection.ondatachannel = (event) => {
        this.dataChannel = event.channel;
        this.setupDataChannelHandlers();
      };

      // Set remote description (the offer)
      const offer = JSON.parse(offerSdp);
      await this.peerConnection.setRemoteDescription(offer);

      // Create answer
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      // Wait for ICE gathering
      await this.waitForIceGathering();

      return JSON.stringify(this.peerConnection.localDescription);
    } catch (error) {
      console.error('Error accepting offer:', error);
      this.setConnectionState('disconnected');
      throw error;
    }
  }

  /**
   * Complete connection by setting the answer (initiator side)
   * @param {string} answerSdp - The answer SDP from partner
   */
  async acceptAnswer(answerSdp) {
    try {
      const answer = JSON.parse(answerSdp);
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error accepting answer:', error);
      throw error;
    }
  }

  /**
   * Set up peer connection event handlers
   */
  setupPeerConnectionHandlers() {
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection.connectionState;
      console.log('Connection state:', state);
      
      if (state === 'connected') {
        this.setConnectionState('connected');
        syncService.isConnected = true;
        syncService.connectionType = 'p2p';
      } else if (state === 'disconnected' || state === 'failed') {
        this.setConnectionState('disconnected');
        syncService.isConnected = false;
      }
    };

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate.candidate);
      }
    };
  }

  /**
   * Set up data channel event handlers
   */
  setupDataChannelHandlers() {
    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.setConnectionState('connected');
      
      // Sync any pending changes
      syncService.syncNow();
    };

    this.dataChannel.onclose = () => {
      console.log('Data channel closed');
      this.setConnectionState('disconnected');
    };

    this.dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.dataChannel.onerror = (error) => {
      console.error('Data channel error:', error);
    };
  }

  /**
   * Handle incoming message from partner
   * @param {object} message 
   */
  handleMessage(message) {
    console.log('Received message:', message.type);

    switch (message.type) {
      case 'sync':
        // Receive a change from partner
        syncService.receiveChange(message.data);
        break;
      case 'ping':
        // Respond to keep-alive
        this.send({ type: 'pong' });
        break;
      case 'pong':
        // Partner is alive
        break;
      default:
        // Notify listeners
        this.onMessageCallbacks.forEach(cb => cb(message));
    }
  }

  /**
   * Send a message to partner
   * @param {object} message 
   */
  send(message) {
    if (!this.dataChannel || this.dataChannel.readyState !== 'open') {
      console.warn('Data channel not open, queuing message');
      return false;
    }

    try {
      this.dataChannel.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  /**
   * Send a sync change to partner
   * @param {object} change 
   */
  sendChange(change) {
    return this.send({
      type: 'sync',
      data: change
    });
  }

  /**
   * Wait for ICE gathering to complete
   */
  waitForIceGathering() {
    return new Promise((resolve) => {
      if (this.peerConnection.iceGatheringState === 'complete') {
        resolve();
        return;
      }

      const checkState = () => {
        if (this.peerConnection.iceGatheringState === 'complete') {
          this.peerConnection.removeEventListener('icegatheringstatechange', checkState);
          resolve();
        }
      };

      this.peerConnection.addEventListener('icegatheringstatechange', checkState);

      // Timeout after 10 seconds
      setTimeout(() => {
        this.peerConnection.removeEventListener('icegatheringstatechange', checkState);
        resolve();
      }, 10000);
    });
  }

  /**
   * Update and notify connection state
   */
  setConnectionState(state) {
    this.connectionState = state;
    this.onStateChangeCallbacks.forEach(cb => cb(state));
  }

  /**
   * Register callback for state changes
   */
  onStateChange(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Register callback for messages
   */
  onMessage(callback) {
    this.onMessageCallbacks.push(callback);
    return () => {
      this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
    };
  }

  /**
   * Disconnect and cleanup
   */
  disconnect() {
    if (this.dataChannel) {
      this.dataChannel.close();
      this.dataChannel = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.setConnectionState('disconnected');
    syncService.isConnected = false;
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      connectionState: this.connectionState,
      isInitiator: this.isInitiator,
      dataChannelState: this.dataChannel?.readyState || 'closed'
    };
  }
}

export const p2pService = new P2PService();
export default p2pService;
