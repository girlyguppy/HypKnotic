import React, { useState, createContext, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { RewardsPunishmentsProvider } from './data/RewardsPunishmentsContext';
import { HabitsProvider } from './data/HabitsContext';
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
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { lavenderTheme, darkTheme, latexTheme, babyBlueTheme, vampireTheme, fairyTheme, barbieTheme, forestTheme } from './styles/Themes'; // Import all themes
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function CustomDrawerContent(props) {
  const theme = useTheme();
  return (
    <DrawerContentScrollView {...props} style={{ backgroundColor: theme.drawer.backgroundColor }}>
      {props.state.routes.map((route, index) => {
        const focused = props.state.index === index;
        return (
          <DrawerItem
            key={route.key}
            label={route.name}
            focused={focused}
            onPress={() => props.navigation.navigate(route.name)}
            labelStyle={{ color: theme.drawer.textColor }}
            style={{ backgroundColor: focused ? theme.activeTabButton.backgroundColor : theme.tabButton.backgroundColor }}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

function MainTabs({ isDeveloperMode }) {
  const theme = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity 
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={30} color={theme.header.iconColor} />
          </TouchableOpacity>
        ),
        headerStyle: { backgroundColor: theme.header.backgroundColor },
        headerTintColor: theme.header.textColor,
        tabBarStyle: { backgroundColor: theme.container.backgroundColor },
        tabBarActiveTintColor: '#2196F3',
      })}
    >
      <Tab.Screen
        name="Rewards"
        component={RewardsTab}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🎁</Text>,
        }}
      />
      <Tab.Screen
        name="Punishments"
        component={PunishmentsTab}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>🚫</Text>,
        }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitsTab}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Notes"
        component={NotesTab}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📝</Text>,
        }}
      />
      <Tab.Screen
        name="Journals"
        component={JournalsTab}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 24 }}>📖</Text>,
        }}
      />
      {isDeveloperMode && (
        <Tab.Screen
          name="Developer"
          component={DeveloperTab}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 24 }}>🛠️</Text>,
          }}
        />
      )}
    </Tab.Navigator>
  );
}

function DrawerScreens({ toggleTheme, isDeveloperMode, setIsDeveloperMode }) {
  const theme = useTheme();

  const commonScreenOptions = ({ navigation }) => ({
    headerShown: true,
    headerLeft: () => (
      <TouchableOpacity 
        onPress={() => navigation.openDrawer()}
        style={{ marginLeft: 15 }}
      >
        <Ionicons name="menu" size={30} color={theme.header.iconColor} />
      </TouchableOpacity>
    ),
    headerStyle: { backgroundColor: theme.header.backgroundColor },
    headerTintColor: theme.header.textColor,
  });

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      drawerPosition="right"
      screenOptions={commonScreenOptions}
    >
      <Drawer.Screen 
        name="MainTabs" 
        options={{ headerShown: false }}
      >
        {(props) => <MainTabs {...props} isDeveloperMode={isDeveloperMode} />}
      </Drawer.Screen>
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Themes" component={ThemesScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Settings">
        {(props) => (
          <SettingsScreen
            {...props}
            isDeveloperMode={isDeveloperMode}
            setIsDeveloperMode={setIsDeveloperMode}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function App() {
  const [theme, setTheme] = useState(lavenderTheme);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
  };

  return (
    <ThemeContext.Provider value={theme}>
      <RewardsPunishmentsProvider>
        <HabitsProvider>
          <NavigationContainer>
            <DrawerScreens toggleTheme={toggleTheme} isDeveloperMode={isDeveloperMode} setIsDeveloperMode={setIsDeveloperMode} />
          </NavigationContainer>
        </HabitsProvider>
      </RewardsPunishmentsProvider>
    </ThemeContext.Provider>
  );
}