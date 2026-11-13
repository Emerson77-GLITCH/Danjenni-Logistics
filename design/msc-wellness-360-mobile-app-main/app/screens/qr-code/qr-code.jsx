import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';

const ScanQr = ({ navigation }) => {

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [formTempDetails, setFormTempDetails] = useState({});
    const [showScanner, setShowScanner] = useState(false);
    const [enumId, setEnumId] = useState('');

    // useFocusEffect(useCallback(() => {
    //     const getEnumId = async () => {
    //         try {
    //             const enumId = await AsyncStorage.getItem('accessTokens');
    //             setEnumId(enumId);
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    //     getEnumId();
    // }, []));

    useEffect(() => {
        getBarCodeScannerPermissions();
    }, [])

    const getBarCodeScannerPermissions = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setShowScanner(status === "granted");

        })();
    };

    const handleBarCodeScanned = ({ type, data }) => {
        const parsedData = JSON.parse(data);
        if (parsedData) {
            const { patientId } = parsedData;
            // setFormTempDetails({ patientId, qr_code_id, template_id });
            setScanned(false);
            setShowScanner(false);
            refetchInvitedFormQuestions();
        } else {
            console.log('Invalid qr')
        }
    };

    // const {
    //     refetch: refetchInvitedFormQuestions,
    //     data,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error
    // } = useGetFormTemplateQuestionsQuery({
    //     patientId: formTempDetails.patientId,
    //     template_id: formTempDetails.template_id,
    //     qr_code_id: formTempDetails.qr_code_id,
    // });

    // useEffect(() => {
    //     if (isSuccess && data) {
    //         navigation.navigate('QRResponse', {
    //             formTemplateDetails: {
    //                 enum_id: enumId,
    //                 patientId: formTempDetails.patientId,
    //                 template_id: formTempDetails.template_id,
    //                 qr_code_id: formTempDetails.qr_code_id,
    //             },
    //         });
    //     }
    // }, [isSuccess, data, formTempDetails])

    const handleClose = () => {
        setShowScanner(false);
    };

    let content;

    if (showScanner) {
        content = (
            <>
                <Button
                    onPress={handleClose}
                >
                    Close camera
                </Button>
                <View style={styles.scannerContainer}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>
            </>
        )
    } else {
        content = (
            <View>
                <TouchableOpacity onPress={getBarCodeScannerPermissions}>
                    <Ionicons
                        name="scan-circle-sharp"
                        size={80} color="#0170b9"
                        className="sha"
                    />
                </TouchableOpacity>
            </View >
        )
    }

    return (
        <View style={styles.container}>
            {content}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scannerContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ScanQr;