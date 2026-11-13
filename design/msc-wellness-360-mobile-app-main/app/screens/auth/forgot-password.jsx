import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ImageBackground,
    Dimensions
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Card, HelperText, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicatorWrapper, Alert } from '../../components/ui';
import { scale } from "nativewind/dist/tailwind/native/scale";
import { useSendPatientOTPMutation } from './auth-api-slice';

const ForgotPassword = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm();

    const [loginError, setForgotPasswordError] = useState(false);
    const [patientEmail, setPatientEmail] = useState();
    const [sendPatientOTP, { isLoading, isSuccess, isError, error, data }] = useSendPatientOTPMutation();

    const handleForgotPassword = (data) => {
        setPatientEmail(data.email);
        console.log(data.email)
        sendPatientOTP({
            email: data.email,
            role: "patient"
        })
    }

    useEffect(() => {
        if (isSuccess) {
            const saveUserEmailInAsyncStorage = async () => {
                try {
                    await AsyncStorage.setItem("email", patientEmail)

                } catch (error) {
                    console.log(error)
                }
                resetForm()
                navigation.replace("VerifyOTP")
            };
            saveUserEmailInAsyncStorage();
        }
    }, [isSuccess])



    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImageStyles}
                resizeMode="cover"
                source={require("../../../assets/background_logo.png")}
            >
                <View style={styles.content}>
                    <View style={styles.screenHeader}>
                        <Text style={{ fontSize: 30 }}>ForgotPassword</Text>
                    </View>
                    <View style={styles.card}>
                        {isError && <Alert type='error' text={error?.data?.error} />}
                        <Controller
                            name="email"
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Invalid email address format',
                                },
                            }}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        keyboardType="email-address"
                                        label="Email"
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        error={!!errors.email}
                                    />
                                    <HelperText type="error" visible={!!errors.email}>
                                        {errors.email?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        <ActivityIndicatorWrapper loading={isLoading}>
                            <Button
                                mode="contained"
                                onPress={handleSubmit(handleForgotPassword)}
                            >
                                Verify-Email
                            </Button>
                        </ActivityIndicatorWrapper>

                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingTop: 20
    },
    backgroundImageStyles: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,

    },
    card: {
        width: '100%',
        padding: 20,
        backgroundColor: 'transparent',
        elevation: 0,
        borderRadius: 20,
        // marginTop:200
    },
    screenHeader: {
        textAlign: "left",
        fontSize: 30,
        justifyContent: 'center',
        width: '100%',
        marginLeft: 30,
        marginTop: 320
    },
    forgotPassword: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },

});

export default ForgotPassword;
