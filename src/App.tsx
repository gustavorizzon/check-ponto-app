import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import AppProvider from './providers';
import { HomeScreen } from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <AppProvider>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
