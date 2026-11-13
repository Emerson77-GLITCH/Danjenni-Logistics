import React, { useCallback, useEffect, useState } from 'react';
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
import { useSignIntoPatientAccountMutation } from "./auth-api-slice";
import { useFocusEffect } from "@react-navigation/native";

const Login = ({ navigation }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset: resetForm,
    } = useForm();

    const [signIntoPatientAccount, { isLoading, isSuccess, isError, error, data }] = useSignIntoPatientAccountMutation();
    const [fetchingCredentials, setFetchingCredentials] = useState(true);

    const [loginError, setLoginError] = useState(false);

    const handleLogin = (data) => {
        signIntoPatientAccount({
            email: data.email,
            password: data.password,
        })

    }

    useFocusEffect(
        useCallback(
            () => {
                const getPatientCredentials = async () => {
                    try {
                        const accessToken = await AsyncStorage.getItem("accessTokens")
                        const fullName = await AsyncStorage.getItem("fullName")
                        const phoneNumber = await AsyncStorage.getItem("phoneNumber")
                        const email = await AsyncStorage.getItem("email")
                        const gender = await AsyncStorage.getItem("gender")

                        if (accessToken && fullName && phoneNumber && email && gender) {
                            navigation.replace("Drawer")
                        }
                    } catch (error) {
                        console.error('Error fetching user credentials:', error);

                    } finally {
                        setFetchingCredentials(false)
                    }
                };

                getPatientCredentials();
            }, [navigation]
        )
    )

    useEffect(() => {
        if (isSuccess && data) {
            const savePatientAccessCredentialsInAsync = async () => {
                try {
                    await AsyncStorage.setItem('accessTokens', data?.response?.token_response?.access_tokens)
                    await AsyncStorage.setItem("fullName", data?.response?.full_name)
                    await AsyncStorage.setItem("phoneNumber", data?.response?.phone_number)
                    await AsyncStorage.setItem("email", data?.response?.email)
                    await AsyncStorage.setItem("gender", data?.response?.gender?.String)
                } catch (error) {
                    console.log(error)
                }

                resetForm();
                navigation.replace('Drawer')
            }

            savePatientAccessCredentialsInAsync();

        }
    }, [isSuccess, data]);

    if (fetchingCredentials) {
        return (
            <View className='items-center justify-center h-full'>
                <ActivityIndicatorWrapper loading={fetchingCredentials}>
                    <Text>Logging in...</Text>
                </ActivityIndicatorWrapper>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.backgroundImageStyles}
                resizeMode="cover"
                source={require("../../../assets/background_logo.png")}
            >
                <View style={styles.content}>

                    <View style={styles.screenHeader}>
                        <Text style={{ fontSize: 30 }}>Login</Text>
                    </View>
                    <View style={styles.card}>
                        {
                            isError && <Alert type="error" text={error?.data?.error} />
                        }
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
                                onPress={handleSubmit(handleLogin)}
                            >
                                Login
                            </Button>
                        </ActivityIndicatorWrapper>
                        <View style={styles.forgotPassword}>
                            <Button
                                mode="text"
                                onPress={() => navigation.navigate('ForgotPassword')}>
                                Forgot password?
                            </Button>
                        </View>
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

export default Login;
