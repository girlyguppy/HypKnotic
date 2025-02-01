import React, { useState } from 'react';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider, useAtom } from 'jotai';
import { themeAtom } from './atoms/themeAtom';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const [theme] = useAtom(themeAtom);
  
  const drawerStyle = {
    backgroundColor: theme?.drawer?.backgroundColor || '#FFFFFF',
  };
  
  const labelStyle = {
    color: theme?.drawer?.textColor || '#000000',
  };
  
  const itemStyle = (focused) => ({
    backgroundColor: focused 
      ? theme?.activeTabButton?.backgroundColor || '#E0E0E0'
      : theme?.tabButton?.backgroundColor || '#FFFFFF',
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
            labelStyle={labelStyle}
            style={itemStyle(focused)}
          />
        );
      })}
    </DrawerContentScrollView>
  );
}

function MainTabs({ isDeveloperMode }) {
  const [theme] = useAtom(themeAtom);
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
        tabBarActiveTintColor: theme?.activeTabButton?.backgroundColor || '#000000',
        tabBarInactiveTintColor: theme?.tabButton?.backgroundColor || '#888888',
        headerStyle: {
          backgroundColor: theme?.header?.backgroundColor || '#FFFFFF',
        },
        headerTintColor: theme?.header?.textColor || '#000000',
        headerTitleStyle: {
          color: theme?.header?.textColor || '#000000',
        },
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <MaterialCommunityIcons name="menu" size={25} color={theme?.header?.iconColor || '#000000'} style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        ),
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

export default function App() {
  const [theme] = useAtom(themeAtom);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  return (
    <Provider>
      <RewardsPunishmentsProvider>
        <HabitsProvider>
          <NavigationContainer>
            <Drawer.Navigator
              drawerContent={(props) => <CustomDrawerContent {...props} />}
              screenOptions={({ navigation }) => ({
                headerStyle: {
                  backgroundColor: theme?.header?.backgroundColor || '#FFFFFF',
                },
                headerTintColor: theme?.header?.textColor || '#000000',
                headerTitleStyle: {
                  color: theme?.header?.textColor || '#000000',
                },
                headerLeft: () => (
                  <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <MaterialCommunityIcons name="menu" size={25} color={theme?.header?.iconColor || '#000000'} style={{ marginLeft: 15 }} />
                  </TouchableOpacity>
                ),
                headerTitleAlign: 'center',
              })}
            >
              <Drawer.Screen name="MainTabs" options={{ headerShown: false }}>
                {(props) => <MainTabs {...props} isDeveloperMode={isDeveloperMode} />}
              </Drawer.Screen>
              <Drawer.Screen name="Profile" component={ProfileScreen} />
              <Drawer.Screen name="Themes" component={ThemesScreen} />
              <Drawer.Screen name="Notifications" component={NotificationsScreen} />
              <Drawer.Screen name="History" component={HistoryScreen} />
              <Drawer.Screen name="Settings">
                {(props) => <SettingsScreen {...props} isDeveloperMode={isDeveloperMode} setIsDeveloperMode={setIsDeveloperMode} />}
              </Drawer.Screen>
            </Drawer.Navigator>
          </NavigationContainer>
        </HabitsProvider>
      </RewardsPunishmentsProvider>
    </Provider>
  );
}