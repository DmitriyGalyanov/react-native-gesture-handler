/// <reference types="react" />
import { RotationGestureHandlerEventPayload } from './GestureHandlerEventPayload';
import { BaseGestureHandlerProps } from './gestureHandlerCommon';
export declare const rotationGestureHandlerProps: readonly ["secondPointerLiftFinishesGesture"];
export interface RotationGestureConfig {
    /**
     * @Platform Android
     *
     * When `false`, the Handler will not finish when second Pointer Lifts,
     * allowing Gesture to continue when a new second Pointer arrives
     * (on iOS it's the default Behaviour)
     */
    secondPointerLiftFinishesGesture?: boolean;
}
export interface RotationGestureHandlerProps extends BaseGestureHandlerProps<RotationGestureHandlerEventPayload>, RotationGestureConfig {
}
export declare const rotationHandlerName = "RotationGestureHandler";
export type RotationGestureHandler = typeof RotationGestureHandler;
export declare const RotationGestureHandler: import("react").ComponentType<RotationGestureHandlerProps & import("react").RefAttributes<any>>;
