import 'react-native-gesture-handler';
import { StatusBar, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {
  ForgotPassword,
  VerifyOtp,
  VerifyEmail,
  ResetPassword,
  Login
} from "./app/screens/auth"
import PasswordReset from "./app/screens/auth/reset-password";
import store from "./app/redux/store";
import { Provider } from "react-redux";
import DrawerNav from "./app/components/navigation/drawer-nav";

const Stack = createNativeStackNavigator();

export default function App() {


  const theme = {
    ...DefaultTheme,
    myOwnProperty: true,
    colors: {
      ...DefaultTheme.colors,
      primary: '#0170b9',
      onPrimary: "#ffffff",
    },
  }

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login"
            screenOptions={{
              // headerStyle: { backgroundColor: '#0170b9' },
              headerTintColor: '#fff'
            }}>
            <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
            <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} component={ForgotPassword} />
            <Stack.Screen name="VerifyOTP" options={{ headerShown: false }} component={VerifyOtp} />
            <Stack.Screen name="EmailVerification" component={VerifyEmail} />
            <Stack.Screen name="ResetPassword" options={{ headerShown: false }} component={PasswordReset} />
            <Stack.Screen name="Drawer" component={DrawerNav} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}

