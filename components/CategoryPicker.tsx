import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '@/types/Todo';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Sizes';

interface CategoryPickerProps {
    categories: Category[];
    selectedCategory?: string;
    onSelectCategory: (categoryId: string) => void;
}

export function CategoryPicker({
                                   categories,
                                   selectedCategory,
                                   onSelectCategory,
                               }: CategoryPickerProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Danh mục</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
                {categories.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.categoryItem,
                            { borderColor: category.color },
                            selectedCategory === category.id && {
                                backgroundColor: category.color,
                            },
                        ]}
                        onPress={() => onSelectCategory(category.id)}
                    >
                        <Ionicons
                            name={category.icon as any}
                            size={16}
                            color={
                                selectedCategory === category.id
                                    ? Colors.light.background
                                    : category.color
                            }
                        />
                        <Text
                            style={[
                                styles.categoryText,
                                {
                                    color:
                                        selectedCategory === category.id
                                            ? Colors.light.background
                                            : category.color,
                                },
                            ]}
                        >
                            {category.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
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
    scrollView: {
        flexGrow: 0,
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.padding.md,
        paddingVertical: Sizes.padding.sm,
        borderRadius: Sizes.borderRadius.md,
        borderWidth: 1,
        marginRight: Sizes.padding.sm,
    },
    categoryText: {
        fontSize: Sizes.fontSize.sm,
        fontWeight: '600',
        marginLeft: Sizes.padding.xs,
    },
});