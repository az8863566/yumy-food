import { cssInterop } from 'nativewind';
import { TouchableOpacity as RNTouchableOpacity } from 'react-native';

export const TouchableOpacity = cssInterop(RNTouchableOpacity as any, { className: 'style' });
