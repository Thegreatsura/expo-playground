import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

export default function NativeSheetScreen() {
    const insets = useSafeAreaInsets();

    return (
        <>

            <View className='flex-1 relative bg-black/10 px-10' style={{ paddingBottom: insets.bottom }}>
                <BlurView
                    intensity={10}
                    tint="dark"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,

                    }}
                />
                <View className='flex flex-row w-full justify-end items-center p-3 absolute top-0 right-0'>
                    <Pressable className='p-3 rounded-full bg-white/5' onPress={() => router.back()}>
                        <Feather name="x" size={20} color="white" />
                    </Pressable>
                </View>
                <View className='flex-1 justify-center items-center pt-4'>
                    <View className='w-20 h-20 rounded-full mb-7 bg-white/10 flex items-center justify-center'>
                        <Feather name="check" size={40} color="white" />
                    </View>
                    <Text className='text-white text-3xl font-bold'>
                        Added to cart
                    </Text>
                    <Text className='text-white/60 text-lg'>
                        You have 1 item in your cart.
                    </Text>
                </View>

                {/* Bottom button */}
                <Pressable
                    onPress={() => router.back()}
                    className='bg-white rounded-full py-4 flex items-center justify-center'
                >
                    <Text className='text-black text-lg font-semibold'>
                        Go to checkout
                    </Text>
                </Pressable>
            </View>
        </>
    );
}
