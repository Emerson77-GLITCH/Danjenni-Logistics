import React from 'react';
import { View } from 'react-native';

const PageWrapper = ({ children }) => {
    return (
        <View className="px-2">
            {children}
        </View>
    )
}

export default PageWrapper;