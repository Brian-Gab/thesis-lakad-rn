import { Stack } from 'expo-router'
import React from 'react'

const ItineraryLayout = () => {
    return (
        <Stack>
            <Stack.Screen
                name='agam'
                options={{
                    headerTitle: ''
                }}
            />
            <Stack.Screen
                name='[id]/index'
                options={{
                    headerTitle: ''
                }}
            />
            <Stack.Screen
                name='[id]/add-stop'
                options={{
                    headerTitle: 'Add Stops'
                }}
            />

        </Stack>
    )
}

export default ItineraryLayout