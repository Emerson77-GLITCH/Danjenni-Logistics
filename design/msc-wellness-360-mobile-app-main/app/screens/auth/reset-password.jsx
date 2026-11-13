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
import { useChangePatientPasswordMutation } from './auth-api-slice';

const PasswordReset = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm();

    const [loginError, setForgotPasswordError] = useState(false);
    const [changePatientPassword, { isSuccess, isError, isLoading, error, data }] = useChangePatientPasswordMutation();

    const handleChangePassword = async (data) => {
        try {
            const patientEmail = await AsyncStorage.getItem("email")
            await changePatientPassword({
                email: patientEmail,
                password: data.password,
                role: "patient"
            })

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (isSuccess && data) {
            navigation.navigate("Login")
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
                        <Text style={{ fontSize: 30 }}>Change Patient Password</Text>
                    </View>
                    <View style={styles.card}>
                        {isError && <Alert type='error' text={error?.data?.error} />}
                        <Controller
                            name="password"
                            control={control}
                            rules={{ required: 'Password is required' }}
                            render={({ field }) => (
                                <>
                                    <TextInput
                                        mode="outlined"
                                        label="Password"
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        value={field.value}
                                        error={!!errors.password}
                                        secureTextEntry
                                    />
                                    <HelperText type="error" visible={!!errors.password}>
                                        {errors.password?.message}
                                    </HelperText>
                                </>
                            )}
                        />

                        <ActivityIndicatorWrapper loading={isLoading}>
                            <Button
                                mode="contained"
                                onPress={handleSubmit(handleChangePassword)}>
                                Change-Password
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

export default PasswordReset