import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


const ActivityIndicatorWrapper = ({ loading, children }) => {
    return (
        <View>
            {
                loading ? (<ActivityIndicator animating={true} />)
                    : (children)
            }
        </View>
    )
}

export default ActivityIndicatorWrapper;