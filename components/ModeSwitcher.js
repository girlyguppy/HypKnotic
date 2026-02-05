/**
 * ModeSwitcher - Header component for switching relationships and modes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRelationships } from '../data/RelationshipContext';

export default function ModeSwitcher() {
  const {
    relationships,
    activeRelationship,
    currentMode,
    setActiveRelationship,
    toggleMode,
    isSoloMode,
  } = useRelationships();

  const [showDropdown, setShowDropdown] = useState(false);

  // Get display info for current state
  const getDisplayInfo = () => {
    if (isSoloMode) {
      return {
        label: 'Solo Mode',
        icon: 'person-outline',
        color: '#9C27B0',
        modeLabel: currentMode === 'dom' ? 'Creating' : 'Completing',
      };
    }

    if (!activeRelationship) {
      return {
        label: 'No Partner',
        icon: 'people-outline',
        color: '#666',
        modeLabel: '',
      };
    }

    const roleIcons = {
      dom: 'shield-outline',
      sub: 'heart-outline',
      switch: 'swap-horizontal-outline',
    };

    const roleColors = {
      dom: '#673AB7',
      sub: '#E91E63',
      switch: '#3F51B5',
    };

    return {
      label: activeRelationship.partnerName || 'Partner',
      icon: roleIcons[activeRelationship.myRole] || 'person-outline',
      color: roleColors[activeRelationship.myRole] || '#9C27B0',
      modeLabel: currentMode === 'dom' ? 'Dom Mode' : 'Sub Mode',
    };
  };

  const displayInfo = getDisplayInfo();
  const canToggleMode = isSoloMode || activeRelationship?.myRole === 'switch';

  return (
    <View style={styles.container}>
      {/* Current Mode Display */}
      <TouchableOpacity
        style={styles.currentMode}
        onPress={() => setShowDropdown(true)}
      >
        <View style={[styles.iconContainer, { backgroundColor: displayInfo.color + '20' }]}>
          <Ionicons name={displayInfo.icon} size={20} color={displayInfo.color} />
        </View>
        <View style={styles.labelContainer}>
          <Text style={styles.partnerLabel}>{displayInfo.label}</Text>
          {displayInfo.modeLabel && (
            <Text style={styles.modeLabel}>{displayInfo.modeLabel}</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#aaa" />
      </TouchableOpacity>

      {/* Toggle Button (for Solo or Switch) */}
      {canToggleMode && (
        <TouchableOpacity
          style={[styles.toggleButton, { backgroundColor: displayInfo.color }]}
          onPress={toggleMode}
        >
          <Ionicons name="swap-horizontal" size={16} color="white" />
        </TouchableOpacity>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdown}>
            <Text style={styles.dropdownTitle}>Switch View</Text>
            
            <ScrollView style={styles.dropdownList}>
              {/* Solo Mode Option */}
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  isSoloMode && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setActiveRelationship(null); // Solo mode
                  setShowDropdown(false);
                }}
              >
                <Ionicons name="person-outline" size={24} color="#9C27B0" />
                <View style={styles.dropdownItemText}>
                  <Text style={styles.dropdownItemLabel}>Solo Mode</Text>
                  <Text style={styles.dropdownItemDesc}>Manage your own tasks</Text>
                </View>
                {isSoloMode && (
                  <Ionicons name="checkmark" size={20} color="#9C27B0" />
                )}
              </TouchableOpacity>

              {/* Partner Relationships */}
              {relationships.map((rel) => (
                <TouchableOpacity
                  key={rel.id}
                  style={[
                    styles.dropdownItem,
                    activeRelationship?.id === rel.id && styles.dropdownItemActive,
                  ]}
                  onPress={() => {
                    setActiveRelationship(rel.id);
                    setShowDropdown(false);
                  }}
                >
                  <Ionicons
                    name={
                      rel.myRole === 'dom' ? 'shield-outline' :
                      rel.myRole === 'sub' ? 'heart-outline' :
                      'swap-horizontal-outline'
                    }
                    size={24}
                    color={
                      rel.myRole === 'dom' ? '#673AB7' :
                      rel.myRole === 'sub' ? '#E91E63' :
                      '#3F51B5'
                    }
                  />
                  <View style={styles.dropdownItemText}>
                    <Text style={styles.dropdownItemLabel}>{rel.partnerName}</Text>
                    <Text style={styles.dropdownItemDesc}>
                      You: {rel.myRole.charAt(0).toUpperCase() + rel.myRole.slice(1)}
                    </Text>
                  </View>
                  {activeRelationship?.id === rel.id && (
                    <Ionicons name="checkmark" size={20} color="#9C27B0" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDropdown(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  currentMode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252542',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    marginRight: 4,
  },
  partnerLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeLabel: {
    color: '#aaa',
    fontSize: 11,
  },
  toggleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdown: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    maxHeight: 400,
    padding: 16,
  },
  dropdownTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownList: {
    maxHeight: 280,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#252542',
    gap: 12,
  },
  dropdownItemActive: {
    backgroundColor: '#3a3a5c',
  },
  dropdownItemText: {
    flex: 1,
  },
  dropdownItemLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownItemDesc: {
    color: '#aaa',
    fontSize: 12,
  },
  closeButton: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
