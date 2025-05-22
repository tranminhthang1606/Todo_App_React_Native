import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function Button({
                           title,
                           onPress,
                           variant = 'primary',
                           size = 'md',
                           disabled = false,
                           loading = false,
                           style,
                           textStyle,
                       }: ButtonProps) {
    const buttonStyle = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        disabled && styles.disabled,
        style,
    ];

    const titleStyle = [
        styles.text,
        styles[`text_${variant}`],
        styles[`textSize_${size}`],
        disabled && styles.textDisabled,
        textStyle,
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'primary' ? Colors.light.background : Colors.light.primary}
                    size="small"
                />
            ) : (
                <Text style={titleStyle}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: Sizes.borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    primary: {
        backgroundColor: Colors.light.primary,
    },
    secondary: {
        backgroundColor: Colors.light.surface,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    disabled: {
        opacity: 0.5,
    },
    size_sm: {
        paddingHorizontal: Sizes.padding.md,
        paddingVertical: Sizes.padding.sm,
        minHeight: 36,
    },
    size_md: {
        paddingHorizontal: Sizes.padding.lg,
        paddingVertical: Sizes.padding.md,
        minHeight: 48,
    },
    size_lg: {
        paddingHorizontal: Sizes.padding.xl,
        paddingVertical: Sizes.padding.lg,
        minHeight: 56,
    },
    text: {
        fontWeight: '600',
    },
    text_primary: {
        color: Colors.light.background,
    },
    text_secondary: {
        color: Colors.light.text,
    },
    text_outline: {
        color: Colors.light.primary,
    },
    text_ghost: {
        color: Colors.light.primary,
    },
    textDisabled: {
        opacity: 0.5,
    },
    textSize_sm: {
        fontSize: Sizes.fontSize.sm,
    },
    textSize_md: {
        fontSize: Sizes.fontSize.md,
    },
    textSize_lg: {
        fontSize: Sizes.fontSize.lg,
    },
});