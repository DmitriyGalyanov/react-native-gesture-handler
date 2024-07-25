import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

function Pointer(props: { x: number; y: number }) {
  return (
    <View
      style={{
        position: 'absolute',
        left: props.x,
        top: props.y,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'red',
        transform: [{ translateX: -8 }, { translateY: -8 }],
      }}
    />
  );
}

export default function EmptyExample() {
  const translation = useSharedValue({ x: 0, y: 0 });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translation.value.x },
        { translateY: translation.value.y },
      ],
    };
  });

  const [pointerPos, setPointerPos] = React.useState({ x: 100, y: 100 });
  const [pointerVisible, setPointerVisible] = React.useState(false);

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onChange((e) => {
      translation.value = {
        x: translation.value.x + e.changeX,
        y: translation.value.y + e.changeY,
      };
    });

  const pinch = Gesture.Pinch()
    .onStart((e) => {
      setPointerVisible(true);
      setPointerPos({ x: e.focalX, y: e.focalY });
    })
    .onEnd(() => {
      setPointerVisible(false);
    })
    .runOnJS(true);

  const rotation = Gesture.Rotation()
    .onStart((e) => {
      setPointerVisible(true);
      setPointerPos({ x: e.anchorX, y: e.anchorY });
    })
    .onEnd(() => {
      setPointerVisible(false);
    })
    .runOnJS(true);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(pan, rotation, pinch)}>
        <Animated.View
          style={[style, { width: 200, height: 200, backgroundColor: 'blue' }]}>
          {pointerVisible && <Pointer x={pointerPos.x} y={pointerPos.y} />}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
