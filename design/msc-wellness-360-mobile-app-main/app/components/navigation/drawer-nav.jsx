import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { Button, Drawer, Text } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';
import { HomeScreenDashboard } from '../../screens/home';
// import ScanQr from '../screens/scan-qr';
// import FormResponse from '../screens/form-response/link-response-screen';
// import QuestionsForm from '../screens/forms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
// import LinkResponse from '../screens/form-response/link-response-screen';
// import QRFormResponseScreen from '../screens/form-response/qr-code-form-response';
import { AppointmentDashboard, CreateAppointment } from "../../screens/appointment"
import { ScanQr } from "../../screens/qr-code"

const { Navigator, Screen } = createDrawerNavigator();

const DrawerContent = ({ navigation, state }) => {
    const [drawerItemActive, setDrawerItemActive] = useState('');
    const [userName, setUserName] = useState();
    const [userPhone, setUserPhone] = useState();
    const [accessTokens, setAccessTokens] = useState();

    const navigateToScreen = (screenName) => {
        navigation.navigate(screenName);
    }

    useFocusEffect(
        React.useCallback(() => {
            const getUserDetails = async () => {
                try {
                    setUserPhone(await AsyncStorage.getItem('phoneNumber'));
                    setUserName(await AsyncStorage.getItem('fullName'));
                    setAccessTokens(await AsyncStorage.getItem("accessTokens"))

                } catch (error) {
                    console.log(error);
                }
            };
            getUserDetails();
        }, [])
    );


    const handleLogout = () => {
        const clearUserDataInAsyncStorage = async () => {
            try {
                await AsyncStorage.removeItem('email');
                await AsyncStorage.removeItem('accessTokens');
                await AsyncStorage.removeItem('fullName');
                await AsyncStorage.removeItem('gender');
                await AsyncStorage.removeItem('phoneNumber');
            } catch (error) {
                console.error('Error while clearing data:', error);
            }
            navigation.replace('Login');
        }
        clearUserDataInAsyncStorage();
    };

    return (
        <ScrollView>
            <SafeAreaView className="flex flex-1 h-screen mt-20">
                <View className="px-8">
                    <Text className="text-lg font-bold text-slate-500">{userName}</Text>
                    <View className="flex flex-row items-center gap-x-2">
                        <Octicons name="dot-fill" size={24} color="green" />
                        <Text className="text-slate-500">Online</Text>
                    </View>
                    <Text className="text-slate-600">{userPhone}</Text>
                </View>

                <Drawer.Section title=" " className="my-2">
                    <Drawer.Item
                        label="Dashboard"
                        className={`${state.index == 0 && 'bg-slate-100'}`}
                        onPress={() => navigateToScreen('Home')}
                    />
                    <Drawer.Item
                        label="Appointment"
                        className={`${state.index == 1 && 'bg-slate-100'}`}
                        onPress={() => navigateToScreen('Appointment')}
                    />

                    <Drawer.Item
                        label="Scan QR Code"
                        className={`${state.index == 2 && 'bg-slate-100'}`}
                        onPress={() => navigateToScreen('ScanQR')}
                    />
                </Drawer.Section>
                <View className="flex items-start px-4 py-4">
                    <Button mode="text" onPress={handleLogout}>Logout</Button>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};


const DrawerNav = () => {
    return (
        <Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerStyle: { backgroundColor: '#0170b9', },
                headerTintColor: '#fff'
            }}
        >
            <Screen name="Home" component={HomeScreenDashboard} options={{ title: '' }} />
            <Screen name="Appointment" component={AppointmentDashboard} options={{ title: 'Appointment' }} />
            <Screen name="CreateAppointment" component={CreateAppointment} options={{ title: 'Appointment' }} />
            <Screen name="ScanQR" component={ScanQr} options={{ title: 'Scan QR-Code' }} />
            {/*
            <Screen name="QRResponse" component={QRFormResponseScreen} options={{ title: '' }} />
            <Screen name="LinkResponse" component={LinkResponse} options={{ title: '' }} />
            <Screen name="Forms" component={QuestionsForm} options={{ title: '' }} /> */}
        </Navigator>
    )
}

export default DrawerNav;