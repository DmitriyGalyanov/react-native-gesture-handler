"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RotationGesture = void 0;

var _gesture = require("./gesture");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

class RotationGesture extends _gesture.ContinousBaseGesture {
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

exports.RotationGesture = RotationGesture;
//# sourceMappingURL=rotationGesture.js.map