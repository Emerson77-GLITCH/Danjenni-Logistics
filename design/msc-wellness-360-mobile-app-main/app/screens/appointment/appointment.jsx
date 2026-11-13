import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useCallback } from 'react';
import AppointmentCards from './appointment-cards';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useGetAllPatientAppointmentsQuery } from './appointment-slice';
import { useFocusEffect } from '@react-navigation/native';

const AppointmentDashboard = ({ navigation }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const { refetch: refetchAllPatientsAppointment, data, isLoading, isSuccess, isError, error } = useGetAllPatientAppointmentsQuery();

    useFocusEffect(
        useCallback(() => {
            refetchAllPatientsAppointment();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.iconsContainer}>
                <View style={styles.previousIcon}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Home'); }}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.addIcon}>
                    <TouchableOpacity onPress={() => { navigation.navigate('CreateAppointment'); }}>
                        <Entypo name="plus" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                {isSuccess && data?.response?.map((appointment, index) => (

                    <AppointmentCards
                        key={index}
                        appoitnemt_doctor={appointment.staff_full_name}
                        appoitment_date={formatDate(appointment.requested_date)}
                        appointment_status={appointment.status}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    iconsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 20,
        marginRight: 20,
        paddingBottom: 20,
        paddingTop: 20,
    },
    previousIcon: {
        borderRadius: 50,
        backgroundColor: 'white',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    addIcon: {
        borderRadius: 50,
        backgroundColor: 'white',
        width: 50,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
});

export default AppointmentDashboard;
