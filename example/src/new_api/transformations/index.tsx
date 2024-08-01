import React from 'react';
import { StyleSheet, View, Image, ColorValue } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useState } from 'react';

type Coordinate = { x: number; y: number };

function Pointer({
  coordinates,
  color,
}: {
  coordinates: SharedValue<Coordinate>;
  color?: ColorValue;
}) {
  const positionStyle = useAnimatedStyle(() => {
    const SIZE = 16;
    return {
      backgroundColor: color,
      position: 'absolute',
      width: SIZE,
      height: SIZE,
      borderRadius: SIZE,
      transform: [
        { translateX: coordinates.value.x - SIZE / 2 },
        { translateY: coordinates.value.y - SIZE / 2 },
      ],
    };
  }, [coordinates]);

  return <Animated.View style={positionStyle} />;
}

function identity4() {
  'worklet';
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

function multiply4(a: number[], b: number[]) {
  'worklet';
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
  ];
}

function scale4(sx: number, sy: number, sz: number) {
  'worklet';
  return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
}

function translate4(tx: number, ty: number, tz: number) {
  'worklet';
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
}

function rotate4(rad: number, x: number, y: number, z: number) {
  'worklet';
  const len = Math.hypot(x, y, z);
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const t = 1 - c;
  x /= len;
  y /= len;
  z /= len;
  return [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    0,
    t * x * y + s * z,
    t * y * y + c,
    t * y * z - s * x,
    0,
    t * x * z - s * y,
    t * y * z + s * x,
    t * z * z + c,
    0,
    0,
    0,
    0,
    1,
  ];
}

// function log4(m: number[]) {
//   'worklet';
//   let output = '\n';
//   for (let i = 0; i < m.length; i++) {
//     if (i % 4 === 0) {
//       output += '\n\n';
//     }
//     output += m[i].toFixed(1) + '  ';
//   }

//   console.log(output);
// }

function invert2(m: number[]) {
  'worklet';
  const a = m[0];
  const b = m[1];
  const c = m[2];
  const d = m[3];
  const det = a * d - b * c;

  return [d / det, -b / det, -c / det, a / det];
}

function toTransformedCoords(point: Coordinate, matrix: number[]) {
  'worklet';
  const sr_rs = [matrix[0], matrix[1], matrix[4], matrix[5]];
  const inv = invert2(sr_rs);
  const x = point.x;
  const y = point.y;
  const newX = inv[0] * x + inv[2] * y;
  const newY = inv[1] * x + inv[3] * y;

  return { x: newX, y: newY };
}

function createMatrix(
  translation: Coordinate,
  scale: number,
  rotation: number,
  origin: Coordinate
) {
  'worklet';
  let matrix = identity4();

  // scale adjusted matrix
  if (scale !== 1) {
    matrix = multiply4(matrix, translate4(origin.x, origin.y, 0));
    matrix = multiply4(matrix, scale4(scale, scale, 1));
    matrix = multiply4(matrix, translate4(-origin.x, -origin.y, 0));
  }

  // rotate adjusted matrix
  if (rotation !== 0) {
    matrix = multiply4(matrix, translate4(origin.x, origin.y, 0));
    matrix = multiply4(matrix, rotate4(-rotation, 0, 0, 1));
    matrix = multiply4(matrix, translate4(-origin.x, -origin.y, 0));
  }

  if (translation.x !== 0 || translation.y !== 0) {
    matrix = multiply4(matrix, translate4(translation.x, translation.y, 0));
  }

  // log4(matrix);

  return matrix;
}

function applyTransformations(
  translation: Coordinate,
  scale: number,
  rotation: number,
  origin: Coordinate,
  matrix: number[]
) {
  'worklet';
  const translationInViewCoords = toTransformedCoords(translation, matrix);
  const transform = createMatrix(
    translationInViewCoords,
    scale,
    rotation,
    origin
  );
  return multiply4(transform, matrix);
}

const SIGNET = require('../../ListWithHeader/signet.png');

type Point = {
  x: number;
  y: number;
};
interface PhotoProps {
  pointerTwo: SharedValue<Point>;
  pointerOne: SharedValue<Point>;
  pointerRot: SharedValue<Point>;
  pointerScale: SharedValue<Point>;
  pointerOrigin: SharedValue<Point>;
}
function Photo({
  pointerScale,
  pointerOne,
  pointerRot,
  pointerTwo,
  pointerOrigin,
}: PhotoProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const translation = useSharedValue({ x: 0, y: 0 });
  const origin = useSharedValue({ x: size.width / 2, y: size.height / 2 });
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const isRotating = useSharedValue(false);
  const isScaling = useSharedValue(false);

  const transform = useSharedValue(identity4());

  const style = useAnimatedStyle(() => {
    const matrix = applyTransformations(
      translation.value,
      scale.value,
      rotation.value,
      origin.value,
      transform.value
    );

    return {
      transform: [
        { translateX: matrix[12] },
        { translateY: matrix[13] },
        { scale: Math.hypot(matrix[0], matrix[1]) },
        { rotateZ: `${Math.atan2(matrix[1], matrix[0])}rad` },
      ],
    };
  });

  const rotationGesture = Gesture.Rotation()
    .onStart((event) => {
      'worklet';
      pointerRot.value = { x: event.anchorX, y: event.anchorY };

      if (!isRotating.value && !isScaling.value) {
        pointerOrigin.value = {
          x: size.width / 2 - event.anchorX,
          y: size.height / 2 - event.anchorY,
        };
        origin.value = {
          x: size.width / 2 - event.anchorX,
          y: size.height / 2 - event.anchorY,
        };
      }
      isRotating.value = true;
    })
    .onChange((event) => {
      rotation.value = event.rotation;
    })
    .onEnd(() => {
      'worklet';
      transform.value = applyTransformations(
        translation.value,
        scale.value,
        rotation.value,
        origin.value,
        transform.value
      );

      rotation.value = 0;
      translation.value = { x: 0, y: 0 };
      scale.value = 1;
      isRotating.value = false;
    });

  const scaleGesture = Gesture.Pinch()
    .onTouchesMove((event) => {
      'worklet';
      pointerOne.value = {
        x: event.allTouches[0]?.x ?? 0,
        y: event.allTouches[0]?.y ?? 0,
      };

      pointerTwo.value = {
        x: event.allTouches[1]?.x ?? 0,
        y: event.allTouches[1]?.y ?? 0,
      };
    })
    .onStart((event) => {
      'worklet';
      if (!isRotating.value && !isScaling.value) {
        pointerScale.value = { x: event.focalX, y: event.focalY };
        pointerOrigin.value = {
          x: size.width / 2 - event.focalX,
          y: size.height / 2 - event.focalY,
        };
        origin.value = {
          x: size.width / 2 - event.focalX,
          y: size.height / 2 - event.focalY,
        };
        // --- logging
        console.log('f:', event.focalX, event.focalY);
        console.log('o:', origin.value.x, origin.value.y);
      }
      isScaling.value = true;
    })
    .onChange((event) => {
      'worklet';
      scale.value = event.scale;
    })
    .onEnd(() => {
      'worklet';
      transform.value = applyTransformations(
        translation.value,
        scale.value,
        rotation.value,
        origin.value,
        transform.value
      );
      rotation.value = 0;
      translation.value = { x: 0, y: 0 };
      scale.value = 1;
      isScaling.value = false;
    });

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onChange((event) => {
      'worklet';
      translation.value = {
        x: translation.value.x + event.changeX,
        y: translation.value.y + event.changeY,
      };
    })
    .onEnd(() => {
      'worklet';
      transform.value = applyTransformations(
        translation.value,
        scale.value,
        rotation.value,
        origin.value,
        transform.value
      );

      rotation.value = 0;
      translation.value = { x: 0, y: 0 };
      scale.value = 1;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_e, success) => {
      'worklet';
      if (success) {
        scale.value *= 1.25;
      }
    });

  const gesture = Gesture.Simultaneous(
    rotationGesture,
    scaleGesture,
    panGesture,
    doubleTapGesture
  );

  return (
    <View>
      <GestureDetector gesture={gesture}>
        <Animated.View
          onLayout={({ nativeEvent }) => {
            setSize({
              width: nativeEvent.layout.width,
              height: nativeEvent.layout.height,
            });
          }}
          style={[styles.container, style]}>
          <Image source={SIGNET} style={styles.image} resizeMode="contain" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default function Example() {
  const pointerScale = useSharedValue({ x: 0, y: 0 });
  const pointerTwo = useSharedValue({ x: 0, y: 0 });
  const pointerOne = useSharedValue({ x: 0, y: 0 });
  const pointerRot = useSharedValue({ x: 0, y: 0 });
  const pointerOrigin = useSharedValue({ x: 0, y: 0 });

  return (
    <View style={styles.home}>
      <Photo
        pointerOne={pointerOne}
        pointerTwo={pointerTwo}
        pointerRot={pointerRot}
        pointerScale={pointerScale}
        pointerOrigin={pointerOrigin}
      />
      <Pointer coordinates={pointerScale} color={'#a0a'} />
      <Pointer coordinates={pointerRot} color={'#a00'} />
      <Pointer coordinates={pointerOne} color={'#aa0'} />
      <Pointer coordinates={pointerTwo} color={'#aa0'} />
      <Pointer coordinates={pointerOrigin} color={'#00f'} />
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 240,
    height: 240,
    backgroundColor: '#eef0ff',
    padding: 16,
    elevation: 8,
    borderRadius: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  image: {
    width: 208,
    height: 208,
  },
  infobox: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    height: 70, // magic - minimum height for 4 lines of text on all platforms
  },
});
