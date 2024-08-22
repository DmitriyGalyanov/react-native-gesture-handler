import { ContinousBaseGesture, BaseGestureConfig } from './gesture';
import type { RotationGestureHandlerEventPayload } from '../GestureHandlerEventPayload';
import { GestureUpdateEvent } from '../gestureHandlerCommon';
import type { RotationGestureConfig } from '../RotationGestureHandler';
type RotationGestureChangeEventPayload = {
    rotationChange: number;
};
export declare class RotationGesture extends ContinousBaseGesture<RotationGestureHandlerEventPayload, RotationGestureChangeEventPayload> {
    config: BaseGestureConfig & RotationGestureConfig;
    constructor();
    /**
     * @Platform Android
     * When `false`, the Handler will not finish when second Pointer Lifts,
     * allowing Gesture to continue when a new second Pointer arrives
     * (on iOS it's the default Behaviour)
     *
     * @param {boolean} value
     */
    secondPointerLiftFinishesGesture(value: boolean): this;
    onChange(callback: (event: GestureUpdateEvent<RotationGestureHandlerEventPayload & RotationGestureChangeEventPayload>) => void): this;
}
export type RotationGestureType = InstanceType<typeof RotationGesture>;
export {};
