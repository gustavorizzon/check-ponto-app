import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomClockInFormScreen from './CustomClockInFormScreen';
import DashboardScreen from './DashboardScreen';

export type SummaryScreenStack = {
  SummaryDashboard: undefined;
  SummaryCustomClockInForm: undefined;
};

const Stack = createNativeStackNavigator<SummaryScreenStack>();

export default function SummaryScreen() {
  return (
    <Stack.Navigator initialRouteName="SummaryDashboard">
      <Stack.Screen
        name="SummaryDashboard"
        options={{ title: 'Resumo' }}
        component={DashboardScreen}
      />
      <Stack.Screen
        name="SummaryCustomClockInForm"
        component={CustomClockInFormScreen}
        options={{ title: 'Marcação Personalizada' }}
      />
    </Stack.Navigator>
  );
}
