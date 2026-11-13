import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const Alert = ({ type, text }) => {
    return (
        <View className={`${type === 'success' ? 'bg-green-300' : 'bg-red-200'} px-2 py-3 rounded-md my-1`}>
            <Text className={`${type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {text}
            </Text>
        </View>
    )
}

export default Alert;