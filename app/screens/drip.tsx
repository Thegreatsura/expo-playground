import {
    Canvas,
    Group,
    RoundedRect,
    Rect,
    Skia,
    TileMode,
} from '@shopify/react-native-skia';
import { View, Pressable, Text, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useDerivedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing,
} from 'react-native-reanimated';
import { useState } from 'react';
import { router } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';

// ── Drip configs: x% of screen width, width, duration, delay ──
const DRIPS = [
    { xPct: 0.04, w: 18, dur: 1300, delay: 0 },
    { xPct: 0.11, w: 10, dur: 950, delay: 200 },
    { xPct: 0.18, w: 15, dur: 1600, delay: 60 },
    { xPct: 0.25, w: 8, dur: 850, delay: 380 },
    { xPct: 0.32, w: 17, dur: 1500, delay: 100 },
    { xPct: 0.39, w: 11, dur: 1100, delay: 280 },
    { xPct: 0.46, w: 13, dur: 1250, delay: 30 },
    { xPct: 0.53, w: 9, dur: 900, delay: 320 },
    { xPct: 0.60, w: 16, dur: 1400, delay: 140 },
    { xPct: 0.67, w: 12, dur: 1050, delay: 400 },
    { xPct: 0.74, w: 14, dur: 1300, delay: 80 },
    { xPct: 0.81, w: 8, dur: 800, delay: 300 },
    { xPct: 0.88, w: 16, dur: 1500, delay: 120 },
    { xPct: 0.94, w: 11, dur: 980, delay: 360 },
];

// ── Gooey paint: larger sigma = longer connected neck ──────────
const SIGMA = 8;
const gooeyPaint = (() => {
    const paint = Skia.Paint();
    const blur = Skia.ImageFilter.MakeBlur(SIGMA, SIGMA, TileMode.Clamp, null, null);
    const colorFilter = Skia.ColorFilter.MakeMatrix([
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 60, -30,  // high multiplier = sharp edges
    ]);
    const colorEffect = Skia.ImageFilter.MakeColorFilter(colorFilter, null, null);
    paint.setImageFilter(Skia.ImageFilter.MakeCompose(colorEffect, blur));
    return paint;
})();

export default function DripScreen() {
    const { width: W, height: H } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    const BAR_H = insets.top;

    const [isDark, setIsDark] = useState(false);

    // One shared value per drip (hooks must be unconditional)
    const l0 = useSharedValue(0); const l1 = useSharedValue(0);
    const l2 = useSharedValue(0); const l3 = useSharedValue(0);
    const l4 = useSharedValue(0); const l5 = useSharedValue(0);
    const l6 = useSharedValue(0); const l7 = useSharedValue(0);
    const l8 = useSharedValue(0); const l9 = useSharedValue(0);
    const l10 = useSharedValue(0); const l11 = useSharedValue(0);
    const l12 = useSharedValue(0); const l13 = useSharedValue(0);
    const lengths = [l0, l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13];

    // Bar rect descends from above screen — invisible at rest (height=0)
    const rectH = useSharedValue(0);

    // Rising fill from bottom — starts after first drips arrive (~1400ms)
    const fillHeight = useSharedValue(0);
    const fillY = useDerivedValue(() => H - fillHeight.value);

    const handleToggle = () => {
        if (!isDark) {
            setIsDark(true);
            // Bar descends from above — slow enough to feel like it's being pulled down
            rectH.value = withTiming(BAR_H + SIGMA * 2, {
                duration: 800,
                easing: Easing.out(Easing.quad),
            });
            lengths.forEach((l, i) => {
                l.value = withDelay(DRIPS[i].delay, withTiming(H + 50, {
                    duration: DRIPS[i].dur,
                    easing: Easing.in(Easing.quad),
                }));
            });
            fillHeight.value = withDelay(750, withTiming(H + SIGMA * 2, {
                duration: 1200,
                easing: Easing.out(Easing.quad),
            }));
        } else {
            setIsDark(false);
            rectH.value = withTiming(0, { duration: 300 });
            fillHeight.value = withTiming(0, { duration: 300 });
            lengths.forEach((l) => {
                l.value = withTiming(0, { duration: 300 });
            });
        }
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Canvas style={{ position: 'absolute', top: 0, left: 0, width: W, height: H }}>
                <Group layer={gooeyPaint}>
                    {/* Bar rect: hidden at rest (rectH=0), descends as dripping starts */}
                    <Rect x={-SIGMA * 2} y={-SIGMA * 2} width={W + SIGMA * 4} height={rectH} color="black" />
                    {/* Drip streams — emerge from top edge of screen (y=0) */}
                    {DRIPS.map((cfg, i) => (
                        <RoundedRect
                            key={i}
                            x={cfg.xPct * W - cfg.w / 2}
                            y={0}
                            width={cfg.w}
                            height={lengths[i]}
                            r={cfg.w / 2}
                            color="black"
                        />
                    ))}
                    {/* Rising fill from bottom — merges with drips gooey-style */}
                    <Rect x={-SIGMA * 2} y={fillY} width={W + SIGMA * 4} height={fillHeight} color="black" />
                </Group>
            </Canvas>

            {/* Back button — white + difference = auto-inverts over black 
            <Pressable
                onPress={() => router.back()}
                className="absolute left-6 z-30"
                style={{ top: insets.top + 10, mixBlendMode: 'difference' }}
            >
                <Feather name="arrow-left" size={22} color="white" />
            </Pressable>*/}
            

            {/* Trigger button */}
            <View className="flex-1 items-center justify-end" style={{ paddingBottom: insets.bottom + 40 }}>
                <Pressable
                    onPress={handleToggle}
                    className="px-8 py-3.5 rounded-full"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}
                >
                    <Text
                        className="text-sm"
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
                    >
                        {isDark ? 'Reset' : 'Drip'}
                    </Text>
                </Pressable>
                <Pressable onPress={() => router.back()}>
                <Text
                        className="text-sm mt-10"
                        style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}
                    >
                        Back
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
