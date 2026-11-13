import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'

const AppointmentCards = ({ appoitnemt_doctor, appoitment_date, appointment_status }) => {

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return styles.pending;
            case 'approved':
                return styles.approved;
            case 'disapproved':
                return styles.disapproved;
            default:
                return styles.defaultStatus;
        }
    };


    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.doctor}>
                    <Text >{appoitnemt_doctor}</Text>
                </View>
                <View style={styles.appointment}>
                    <Text style={styles.appointmentText}>{appoitment_date}</Text>
                </View>
                <View style={styles.status}>
                    <Text style={getStatusStyle(appointment_status)}>{appointment_status}</Text>
                </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20
    },
    card: {
        marginLeft: 10,
        marginRight: 10,
    },
    doctor: {
        padding: 20,
    },
    appointment: {
        marginTop: -10,
        marginLeft: 20
    },
    status: {
        marginTop: 10,
        marginLeft: 20,
        paddingBottom: 20
    },
    appointmentText: {
        fontSize: 15,
        color: 'red'
    },
    pending: {
        color: 'yellow',
    },
    approved: {
        color: 'green',
    },
    disapproved: {
        color: 'black',
    },
    defaultStatus: {
        color: 'grey',
    },
})

export default AppointmentCards