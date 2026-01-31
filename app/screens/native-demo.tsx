import { View, Text, Pressable, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Header from '@/components/Header';
import { Feather, Feather as FeatherIcons } from '@expo/vector-icons';

type FeatherIconName = keyof typeof FeatherIcons.glyphMap;

export default function NativeDemoScreen() {
    const insets = useSafeAreaInsets();

    return (
        <ImageBackground source={require("@/assets/img/scify.jpg")} className="w-full h-full relative" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>

            <View className='flex flex-row w-full justify-between items-center px-global mt-4'>
                <Pressable onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="white" />
                </Pressable>
                <Pressable className='bg-white rounded-2xl py-3 px-4 border border-white/20' onPress={() => router.push('/screens/native-sheet')}>
                    <Text className='text-black'>Open Sheet</Text>
                </Pressable>
            </View>


        </ImageBackground>
    );
}
