import { cssInterop } from 'nativewind';
import { Image as ExpoImage } from 'expo-image';

export const Image = cssInterop(ExpoImage as any, { className: 'style' });
