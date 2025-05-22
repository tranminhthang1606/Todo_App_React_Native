import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface InputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    multiline?: boolean;
    numberOfLines?: number;
    style?: ViewStyle;
    inputStyle?: TextStyle;
    autoFocus?: boolean;
    onSubmitEditing?: () => void;
    returnKeyType?: 'done' | 'next' | 'search' | 'send';
}

export function Input({
                          value,
                          onChangeText,
                          placeholder,
                          label,
                          error,
                          multiline = false,
                          numberOfLines = 1,
                          style,
                          inputStyle,
                          autoFocus = false,
                          onSubmitEditing,
                          returnKeyType = 'done',
                      }: InputProps) {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    multiline && styles.multiline,
                    error && styles.inputError,
                    inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.light.textSecondary}
                multiline={multiline}
                numberOfLines={numberOfLines}
                autoFocus={autoFocus}
                onSubmitEditing={onSubmitEditing}
                returnKeyType={returnKeyType}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Sizes.padding.md,
    },
    label: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: Sizes.padding.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.light.border,
        borderRadius: Sizes.borderRadius.md,
        paddingHorizontal: Sizes.padding.md,
        paddingVertical: Sizes.padding.md,
        fontSize: Sizes.fontSize.md,
        color: Colors.light.text,
        backgroundColor: Colors.light.background,
        minHeight: 48,
    },
    multiline: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputError: {
        borderColor: Colors.light.error,
    },
    errorText: {
        fontSize: Sizes.fontSize.xs,
        color: Colors.light.error,
        marginTop: Sizes.padding.xs,
    },
});