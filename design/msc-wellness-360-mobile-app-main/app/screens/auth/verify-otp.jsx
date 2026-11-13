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
import { useVerifyOTPMutation } from "./auth-api-slice.js"


const OTPVerification = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm();

    const [loginError, setForgotPasswordError] = useState(false);
    const [verifyOTP, { isSuccess, isLoading, isError, error, data }] = useVerifyOTPMutation();


    const handleVerifyOTP = async (data) => {
        try {
            const patientEmail = await AsyncStorage.getItem("email")
            await verifyOTP({
                email: patientEmail,
                secret: data.secret,
                role: "patient"
            })
        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if (isSuccess && data) {
            navigation.navigate("ResetPassword")
            console.log(data)
        }
    }, [isSuccess, data])


    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImageStyles}
                resizeMode="cover"
                source={require("../../../assets/background_logo.png")}
            >
                <View style={styles.content}>
                    <View style={styles.screenHeader}>
                        <Text style={{ fontSize: 20 }}>Secret Code Verification</Text>
                    </View>
                    <View style={styles.card}>
                        {isError && <Alert type='error' text={error?.data?.error} />}

                        <Controller
                            name="secret"
                            rules={{
                                required: 'Secret Code is required',

                            }}
                            control={control}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        label="Secret-Code"
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                    // error={!!errors.email}

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
                                onPress={handleSubmit(handleVerifyOTP)}>
                                OTP-Verification
                            </Button>
                        </ActivityIndicatorWrapper>

                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}


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


export default OTPVerification


