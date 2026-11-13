import React from 'react'
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const IconWrapper = ({icon}) => {
    return (
        <View style={styles.wrapper}>
            {icon}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        width: 45,
        height: 45,
        borderRadius: 30,
        padding: 8,
        backgroundColor: '#ffffff',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 1,
    }
});

export default IconWrapper;