import React from 'react';
import { Tabs } from 'expo-router';

import { colors } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray03,
      }}>
      <Tabs.Screen
        name="servers"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" color={color} size={34} />
          ),
          tabBarStyle: {
            backgroundColor: colors.white,
            height: 66,
          }
        }}
      />
      <Tabs.Screen
        name="dm"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="question-answer" color={color} size={34} />
          ),
          tabBarStyle: {
            backgroundColor: colors.white,
            height: 66,
          }
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="notifications" color={color} size={34} />
          ),
          tabBarStyle: {
            backgroundColor: colors.white,
            height: 66,
          }
        }}
      />
      <Tabs.Screen
        name="user"
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" color={color} size={34} />
          ),
          tabBarStyle: {
            backgroundColor: colors.white,
            height: 66,
          }
        }}
      />
      
      
    </Tabs>
  );
}
