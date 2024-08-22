function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { ContinousBaseGesture } from './gesture';

function changeEventCalculator(current, previous) {
  'worklet';

  let changePayload;

  if (previous === undefined) {
    changePayload = {
      rotationChange: current.rotation
    };
  } else {
    changePayload = {
      rotationChange: current.rotation - previous.rotation
    };
  }

  return { ...current,
    ...changePayload
  };
}

export class RotationGesture extends ContinousBaseGesture {
  constructor() {
    super();

    _defineProperty(this, "config", {});

    this.handlerName = 'RotationGestureHandler';
  }
  /**
   * @Platform Android
   * When `false`, the Handler will not finish when second Pointer Lifts,
   * allowing Gesture to continue when a new second Pointer arrives
   * (on iOS it's the default Behaviour)
   *
   * @param {boolean} value
   */


  secondPointerLiftFinishesGesture(value) {
    this.config.secondPointerLiftFinishesGesture = value;
    return this;
  }

  onChange(callback) {
    // @ts-ignore TS being overprotective, RotationGestureHandlerEventPayload is Record
    this.handlers.changeEventCalculator = changeEventCalculator;
    return super.onChange(callback);
  }

}
//# sourceMappingURL=rotationGesture.js.map