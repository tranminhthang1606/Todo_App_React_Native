import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ExpoRoot } from 'expo-router';

export default function App() {
    return (
        <>
            <ExpoRoot context={require.context('./app')} />
            <StatusBar style="auto" />
        </>
    );
}