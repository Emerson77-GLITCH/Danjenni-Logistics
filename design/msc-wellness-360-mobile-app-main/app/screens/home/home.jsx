import { View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    AntDesign,
    MaterialCommunityIcons,
    MaterialIcons,
    FontAwesome,
} from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
    ActivityIndicatorWrapper,
    IconListItem,
    IconWrapper,
} from '../../components/ui';


const HomeScreenDashboard = ({navigation}) => {
    return (
        <View>
            <Text>HomeScreenDashboard</Text>
        </View>
    )
}

export default HomeScreenDashboard