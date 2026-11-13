import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useForm, Controller } from 'react-hook-form';
import { useCreatePatientAppointmentMutation, useGetAllPatientStaffsQuery } from './appointment-slice';

const CreateAppointment = ({ navigation }) => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState(new Date());

    const { data, isLoading, isError, isSuccess, refetch, error } = useGetAllPatientStaffsQuery();
    const [createAppointment, {
        data: createAppointmentData,
        isLoading: isCreateAppointmentLoading,
        isError: isCreateAppointmentError,
        isSuccess: isCreateAppointmentSuccess,
        refetch: refetchCreateAppointment,
        error: createAppointmentError
    }] = useCreatePatientAppointmentMutation();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (selectedDate) => {
        setDate(selectedDate);
        hideDatePicker();
    };

    const onSubmit = async (formData) => {
        const dateTime = date.toISOString();
        const appointmentDetails = {
            staff_id: formData.doctor,
            requested_date: dateTime,
            reason: formData.reason,
        };

        console.log(appointmentDetails);
        try {
            await createAppointment(appointmentDetails).unwrap();
            Alert.alert('Success', 'Appointment booked successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to book appointment. Please try again.');
        }
    };

    useEffect(() => {
        refetch();
    }, []);

    useEffect(() => {
        if (isCreateAppointmentSuccess && createAppointmentData) {
            console.log('Fetched data:', data?.response);
            navigation.navigate("Appointment")
        } else if (isCreateAppointmentError) {
            console.log('Error fetching data:', createAppointmentError);
        }
    }, [isCreateAppointmentSuccess, isCreateAppointmentError, createAppointmentData, createAppointmentError]);


    useEffect(() => {
        if (isSuccess && data) {
            console.log('Fetched data:', data?.response);
        } else if (isError) {
            console.log('Error fetching data:', error);
        }
    }, [isSuccess, isError, data, error]);

    if (isLoading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (isError) {
        return <Text>Error loading data</Text>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Book Appointment</Text>

            <Text style={styles.label}>Select Doctor:</Text>
            <Controller
                control={control}
                name="doctor"
                rules={{ required: 'Please select a doctor' }}
                render={({ field: { onChange, value } }) => (
                    <Picker
                        selectedValue={value}
                        onValueChange={(itemValue) => onChange(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a doctor" value="" />
                        {isSuccess && data?.response.map((staff) => (
                            <Picker.Item key={staff.id} label={staff.full_name} value={staff.id} />
                        ))}
                    </Picker>
                )}
            />
            {errors.doctor && <Text style={styles.errorText}>{errors.doctor.message}</Text>}

            <Text style={styles.label}>Select Date and Time:</Text>
            <Button title="Pick Date & Time" onPress={showDatePicker} />
            <Text>{date.toLocaleString()}</Text>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <Text style={styles.label}>Reason for Appointment:</Text>
            <Controller
                control={control}
                name="reason"
                rules={{ required: 'Please enter a reason' }}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={4}
                        onChangeText={onChange}
                        value={value}
                        placeholder="Enter reason for appointment"
                    />
                )}
            />
            {errors.reason && <Text style={styles.errorText}>{errors.reason.message}</Text>}

            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
    picker: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        justifyContent: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateAppointment;
