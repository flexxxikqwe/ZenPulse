import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types/UserProfile';

const STORAGE_KEY = '@zenpulse_user_profile';

export const saveProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(profile);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving profile', e);
  }
};

export const loadProfile = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading profile', e);
    return null;
  }
};
