import Header from "@/components/Header";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, FlatList, Dimensions, Image, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { AntDesign } from '@expo/vector-icons';
import useThemeColors from '../contexts/ThemeColors';
import Feather from '@expo/vector-icons/Feather';
import LottieView from 'lottie-react-native';
import React from "react";
import { shadowPresets } from "@/utils/useShadow";
const { width } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

const slides = [
    {
        id: '1',
        title: 'Simple onboarding',
        image: require('@/assets/lottie/welcome-3.json'),
        description: 'Complete shopping experience',
    },
    {
        id: '2',
        title: 'Copy and paste',
        image: require('@/assets/lottie/welcome-2.json'),
        description: 'Elegant design for your shopping app',
    },
    {
        id: '3',
        title: 'Free to use',
        image: require('@/assets/lottie/welcome-1.json'),
        description: 'Easily modify themes, layouts, and state management for your app.',
    },
];

export default function OnboardingScreen() {
    const insets = useSafeAreaInsets();
    const colors = useThemeColors();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleScroll = (event: { nativeEvent: { contentOffset: { x: number; }; }; }) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    return (
        <>
            <Header showBackButton />
            <View className="flex-1 relative bg-background" style={{ paddingBottom: insets.bottom }}>
                <FlatList
                    ref={flatListRef}
                    data={slides}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    snapToInterval={windowWidth} // 👈 Ensures snapping works perfectly
                    renderItem={({ item }) => (
                        <View style={{ width: windowWidth }} className="items-center justify-center p-6">
                            <LottieView autoPlay source={item.image} style={{ width: windowWidth / 1.1, height: windowWidth / 1.1 }} />
                            <Text className="text-3xl font-bold mt-4 text-text">{item.title}</Text>
                            <Text className="text-center w-2/3 text-text mt-2 opacity-50">{item.description}</Text>
                        </View>
                    )}
                    ListFooterComponent={() => (
                        <View className='w-full h-28' />
                    )}
                    keyExtractor={(item) => item.id}
                />

                <View className="flex-row justify-center mb-20  w-full">
                    {slides.map((_, index) => (
                        <View
                            key={index}
                            className={`h-[2px] mx-px ${index === currentIndex ? 'bg-highlight w-4' : 'bg-neutral-300 w-4'}`}
                        />
                    ))}
                </View>

                <View className="w-full px-6 mb-global flex flex-col space-y-2">
                    <Pressable 
                    style={shadowPresets.card}
                    className='w-full bg-white rounded-full flex flex-row items-center justify-center py-4'>
                        <Feather name="mail" size={20} color="black" />
                        <Text className='text-black ml-3'>Use email</Text>
                    </Pressable>
                    <View className='flex flex-row items-center justify-center gap-2 mt-3'>
                        <Pressable className='flex-1 bg-black rounded-full flex flex-row items-center justify-center py-4 border border-border'>
                            <AntDesign name="google" size={22} color="white" />
                            <Text className='ml-3 text-white'>Google login</Text>
                        </Pressable>
                        <Pressable className='flex-1 relative bg-black rounded-full flex flex-row items-center justify-center py-4 border border-border'>
                            <AntDesign name="apple" size={22} color="white" />
                            <Text className='ml-3 text-white'>Apple ID</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </>
    );
}
