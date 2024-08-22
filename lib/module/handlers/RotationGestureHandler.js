import createHandler from './createHandler';
import { baseGestureHandlerProps } from './gestureHandlerCommon';
export const rotationGestureHandlerProps = ['secondPointerLiftFinishesGesture'];
export const rotationHandlerName = 'RotationGestureHandler';
// eslint-disable-next-line @typescript-eslint/no-redeclare -- backward compatibility; see description on the top of gestureHandlerCommon.ts file
export const RotationGestureHandler = createHandler({
  name: rotationHandlerName,
  allowedProps: baseGestureHandlerProps,
  config: {}
});
//# sourceMappingURL=RotationGestureHandler.js.map