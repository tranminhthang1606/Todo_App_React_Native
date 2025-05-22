import { useState, useEffect } from 'react';

export function useAsyncStorage<T>(
    key: string,
    initialValue: T,
    serialize: (value: T) => string = JSON.stringify,
    deserialize: (value: string) => T = JSON.parse
) {
    const [storedValue, setStoredValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredValue();
    }, []);

    const loadStoredValue = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const item = await AsyncStorage.getItem(key);
            if (item) {
                setStoredValue(deserialize(item));
            }
        } catch (error) {
            console.error(`Error loading ${key}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const setValue = async (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);

            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            await AsyncStorage.setItem(key, serialize(valueToStore));
        } catch (error) {
            console.error(`Error saving ${key}:`, error);
        }
    };

    return [storedValue, setValue, loading] as const;
}