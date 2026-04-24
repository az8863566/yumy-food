import { cssInterop } from 'nativewind';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';

export const LinearGradient = cssInterop(ExpoLinearGradient as any, { className: 'style' });
