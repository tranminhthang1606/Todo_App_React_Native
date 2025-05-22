import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    padding?: keyof typeof Sizes.padding;
}

export function Card({ children, style, padding = 'md' }: CardProps) {
    return (
        <View style={[styles.card, { padding: Sizes.padding[padding] }, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: Sizes.borderRadius.lg,
        shadowColor: Colors.light.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
});