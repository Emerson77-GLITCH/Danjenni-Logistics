import React from 'react'
import { Text, View } from 'react-native';
import IconWrapper from './icon-wrapper';

const IconListItem = ({ icon, title, count }) => {
    return (
        <View className="flex flex-row items-center justify-between my-2">
            <View className="flex flex-row items-center">
                <IconWrapper icon={icon} />
                <Text className="mx-4 text-md text-gray-600 font-medium">
                    {title}
                </Text>
            </View>
            <Text className="px-4 text-md text-gray-600 font-medium">
                {count}
            </Text>
        </View>
    )
}

export default IconListItem;