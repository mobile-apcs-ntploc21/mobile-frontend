import React from 'react';
import { Tabs } from 'expo-router';

import { colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

const TabArr = [
  { name: 'servers', iconType: MaterialIcons, iconName: 'dashboard' },
  { name: 'dm', iconType: MaterialIcons, iconName: 'group' },
  { name: 'notifications', iconType: MaterialIcons, iconName: 'notifications' },
  { name: 'user', iconType: MaterialIcons, iconName: 'account-circle' }
];

export default function TabLayout() {
  const isPlayground = process.env.EXPO_PUBLIC_PLAYGROUND_MODE === 'true';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray03
      }}
    >
      {TabArr.map((tab, index) => (
        <Tabs.Screen
          key={index}
          name={tab.name}
          options={{
            href: tab.name !== 'notifications' ? `/${tab.name}` : null,
            headerShown: false,
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => (
              // @ts-ignore
              <tab.iconType name={tab.iconName} color={color} size={34} />
            ),
            tabBarStyle: {
              backgroundColor: colors.white,
              height: 70
            }
          }}
        />
      ))}
      <Tabs.Screen
        name="playground"
        options={{
          href: isPlayground ? '/playground' : null,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="wc" color={color} size={34} />
          ),
          tabBarStyle: {
            backgroundColor: colors.white,
            height: 70
          }
        }}
      />
    </Tabs>
  );
}
