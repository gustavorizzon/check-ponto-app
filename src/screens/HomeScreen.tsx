import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';

import SummaryScreen from './SummaryScreen';
import ReportScreen from './ReportScreen';
import SettingsScreen from './SettingsScreen';

interface IconProps {
  size: number;
  color: string;
}

const Tab = createBottomTabNavigator();
const WatchIcon = (props: IconProps) => <Feather name="watch" {...props} />;
const ListIcon = (props: IconProps) => <Feather name="list" {...props} />;
const SlidersIcon = (props: IconProps) => <Feather name="sliders" {...props} />;

export function HomeScreen() {
  return (
    <Tab.Navigator initialRouteName="Summary">
      <Tab.Screen
        name="Summary"
        options={{
          title: 'Resumo',
          tabBarIcon: WatchIcon,
        }}
        component={SummaryScreen}
      />
      <Tab.Screen
        name="Report"
        options={{
          title: 'Relatório',
          tabBarIcon: ListIcon,
        }}
        component={ReportScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          title: 'Jornada',
          tabBarIcon: SlidersIcon,
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}
