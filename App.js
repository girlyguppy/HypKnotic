import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { RewardsPunishmentsProvider } from './data/RewardsPunishmentsContext';
import { HabitsProvider } from './data/HabitsContext';
import { ProfileProvider } from './data/ProfileContext';
import { HistoryProvider } from './data/HistoryContext';
import { AuthProvider, useAuth } from './data/AuthContext';
import { RelationshipProvider, useRelationships } from './data/RelationshipContext';
import RewardsTab from './screens/RewardsTab';
import PunishmentsTab from './screens/PunishmentsTab';
import HabitsTab from './screens/HabitsTab';
import NotesTab from './screens/NotesTab';
import JournalsTab from './screens/JournalsTab';
import ProfileScreen from './screens/ProfileScreen';
import ThemesScreen from './screens/ThemesScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import DeveloperTab from './screens/DeveloperTab';
import SetupScreen from './screens/SetupScreen';
import LoginScreen from './screens/LoginScreen';
import PartnerManagementScreen from './screens/PartnerManagementScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider, useAtom } from 'jotai';
import { themeAtom } from './atoms/themeAtom';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [theme] = useAtom(themeAtom);
  
  const drawerStyle = {
    backgroundColor: theme?.colors?.drawer || theme?.colors?.background || '#FFFFFF',
  };
  
  const labelStyle = {
    color: theme?.colors?.drawerText || theme?.colors?.text || '#000000',
  };
  
  const itemStyle = (focused) => ({
    backgroundColor: focused 
      ? theme?.colors?.primary || '#E0E0E0'
      : 'transparent',
    borderRadius: 8,
    marginVertical: 2,
  });

  return (
    <DrawerContentScrollView {...props} style={drawerStyle}>
      {props.state.routes.map((route, index) => {
        const focused = props.state.index === index;
        return (
          <DrawerItem
            key={route.key}
            label={route.name}
            focused={focused}
            onPress={() => props.navigation.navigate(route.name)}
            labelStyle={[labelStyle, focused && { color: theme?.colors?.textOnPrimary || '#FFFFFF' }]}
            style={itemStyle(focused)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

function MainTabs({ isDeveloperMode }) {
  const [theme] = useAtom(themeAtom);
  const { getActiveRelationship, canPerformAction } = useRelationships();
  const activeRel = getActiveRelationship();
  
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Rewards') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Punishments') {
            iconName = focused ? 'alert' : 'alert-outline';
          } else if (route.name === 'Habits') {
            iconName = focused ? 'check-circle' : 'check-circle-outline';
          } else if (route.name === 'Notes') {
            iconName = focused ? 'note' : 'note-outline';
          } else if (route.name === 'Journals') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Developer') {
            iconName = focused ? 'code-tags' : 'code-tags';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme?.colors?.primary || '#9B59B6',
        tabBarInactiveTintColor: theme?.colors?.textMuted || '#888888',
        tabBarStyle: {
          backgroundColor: theme?.colors?.surface || '#FFFFFF',
          borderTopColor: theme?.colors?.border || '#DDDDDD',
        },
        headerStyle: {
          backgroundColor: theme?.colors?.surface || '#FFFFFF',
        },
        headerTintColor: theme?.colors?.text || '#000000',
        headerTitleStyle: {
          color: theme?.colors?.text || '#000000',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" size={25} color={theme?.colors?.text || '#000000'} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        ),
        headerRight: () => activeRel && !activeRel.isSolo ? (
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginRight: 15,
            backgroundColor: theme?.colors?.primary + '20',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}>
            <MaterialCommunityIcons 
              name={activeRel.myRole === 'dom' ? 'shield' : (activeRel.myRole === 'sub' ? 'heart' : 'swap-horizontal')} 
              size={16} 
              color={theme?.colors?.primary || '#9C27B0'} 
            />
            <Text style={{ 
              marginLeft: 4, 
              color: theme?.colors?.primary || '#9C27B0',
              fontSize: 12,
              fontWeight: '600',
            }}>
              {activeRel.partnerName}
            </Text>
          </View>
        ) : null,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Rewards" component={RewardsTab} />
      <Tab.Screen name="Punishments" component={PunishmentsTab} />
      <Tab.Screen name="Habits" component={HabitsTab} />
      <Tab.Screen name="Notes" component={NotesTab} />
      <Tab.Screen name="Journals" component={JournalsTab} />
      {isDeveloperMode && <Tab.Screen name="Developer" component={DeveloperTab} />}
    </Tab.Navigator>
  );
}

// Main app with auth and setup flow
function AppContent() {
  const [theme] = useAtom(themeAtom);
  const { isAuthenticated, isLoading: authLoading, needsSetup, skipAuth } = useAuth();
  const { isLoading: relLoading, soloMode, enableSoloMode } = useRelationships();
  const [isDeveloperMode, setIsDeveloperMode] = useState(true); // Dev mode ON by default
  const [setupComplete, setSetupComplete] = useState(false);
  
  // DEBUG: Log the current state on every render
  console.log('=== APP DEBUG ===');
  console.log('authLoading:', authLoading);
  console.log('relLoading:', relLoading);
  console.log('needsSetup:', needsSetup);
  console.log('setupComplete:', setupComplete);
  console.log('isAuthenticated:', isAuthenticated);
  console.log('isDeveloperMode:', isDeveloperMode);

  // Show loading screen while checking auth state
  if (authLoading || relLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme?.colors?.background || '#1A1A2E',
      }}>
        <ActivityIndicator size="large" color={theme?.colors?.primary || '#9C27B0'} />
        <Text style={{ color: theme?.colors?.text || '#fff', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Show setup screen for new users (but allow skipping for now during development)
  if (needsSetup && !setupComplete) {
    return (
      <SetupScreen 
        onComplete={() => {
          setSetupComplete(true);
          skipAuth?.(); // Skip auth for now after setup
        }}
        onSkip={() => {
          setSetupComplete(true);
          skipAuth?.(); // Allow skipping setup
        }}
      />
    );
  }

  // Show login screen if not authenticated (but has account)
  // For now, in dev mode, we skip this
  if (!isAuthenticated && !needsSetup && !isDeveloperMode) {
    return <LoginScreen />;
  }

  return (
    <NavigationContainer>
      {/* DEBUG BANNER - Remove after confirming code is loading */}
      <View style={{ 
        backgroundColor: '#FF00FF', 
        padding: 5, 
        alignItems: 'center',
        position: 'absolute',
        top: 30,
        left: 0,
        right: 0,
        zIndex: 9999,
      }}>
        <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 10 }}>
          DEBUG: v2.0 - needsSetup:{String(needsSetup)} auth:{String(isAuthenticated)}
        </Text>
      </View>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ navigation }) => ({
          drawerStyle: {
            backgroundColor: theme?.colors?.drawer || theme?.colors?.background || '#FFFFFF',
          },
          headerStyle: {
            backgroundColor: theme?.colors?.surface || '#FFFFFF',
          },
          headerTintColor: theme?.colors?.text || '#000000',
          headerTitleStyle: {
            color: theme?.colors?.text || '#000000',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <MaterialCommunityIcons name="menu" size={25} color={theme?.colors?.text || '#000000'} style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          ),
          headerTitleAlign: 'center',
        })}
      >
        <Drawer.Screen name="MainTabs" options={{ headerShown: false }}>
          {(props) => <MainTabs {...props} isDeveloperMode={isDeveloperMode} />}
        </Drawer.Screen>
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Partners" component={PartnerManagementScreen} />
        <Drawer.Screen name="Themes" component={ThemesScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
        <Drawer.Screen name="Settings">
          {(props) => <SettingsScreen {...props} isDeveloperMode={isDeveloperMode} setIsDeveloperMode={setIsDeveloperMode} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider>
      <AuthProvider>
        <RelationshipProvider>
          <ProfileProvider>
            <HistoryProvider>
              <RewardsPunishmentsProvider>
                <HabitsProvider>
                  <AppContent />
                </HabitsProvider>
              </RewardsPunishmentsProvider>
            </HistoryProvider>
          </ProfileProvider>
        </RelationshipProvider>
      </AuthProvider>
    </Provider>
  );
}