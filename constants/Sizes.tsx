import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Sizes = {
    window: {
        width,
        height,
    },
    padding: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
    },
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        title: 28,
    },
    iconSize: {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
    },
};
