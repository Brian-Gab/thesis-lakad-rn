import { Stack } from 'expo-router'
import React from 'react'

const LandmarkLayout = () => {
    return (
        <Stack>
            <Stack.Screen options={{ headerTitle: "Places" }}
                name='all'
            />
            <Stack.Screen options={{ headerShown: false }}
                name='[id]/view'
            />
        </Stack>
    )
}

export default LandmarkLayout