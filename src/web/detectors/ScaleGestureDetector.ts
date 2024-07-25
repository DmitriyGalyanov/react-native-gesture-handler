import { DEFAULT_TOUCH_SLOP } from '../constants';
import { AdaptedEvent, EventTypes } from '../interfaces';

import PointerTracker from '../tools/PointerTracker';

export interface ScaleGestureListener {
  onScaleBegin: (detector: ScaleGestureDetector) => boolean;
  onScale: (detector: ScaleGestureDetector) => boolean;
  onScaleEnd: (detector: ScaleGestureDetector) => void;
}

export default class ScaleGestureDetector implements ScaleGestureListener {
  public onScaleBegin: (detector: ScaleGestureDetector) => boolean;
  public onScale: (detector: ScaleGestureDetector) => boolean;
  public onScaleEnd: (detector: ScaleGestureDetector) => void;

  private focusX!: number;
  private focusY!: number;

  private currentSpan!: number;
  private prevSpan!: number;
  private initialSpan!: number;

  private currentTime!: number;
  private prevTime!: number;

  private inProgress = false;

  private spanSlop: number;
  private minSpan: number;

  public constructor(callbacks: ScaleGestureListener) {
    this.onScaleBegin = callbacks.onScaleBegin;
    this.onScale = callbacks.onScale;
    this.onScaleEnd = callbacks.onScaleEnd;

    this.spanSlop = DEFAULT_TOUCH_SLOP * 2;
    this.minSpan = 0;
  }

  public onTouchEvent(event: AdaptedEvent, tracker: PointerTracker): boolean {
    this.currentTime = event.time;

    const action: EventTypes = event.eventType;

    const isAdditionalPointerUp = action === EventTypes.ADDITIONAL_POINTER_UP;

    const streamComplete: boolean =
      action === EventTypes.UP ||
      action === EventTypes.ADDITIONAL_POINTER_UP ||
      action === EventTypes.DOWN ||
      action === EventTypes.CANCEL;

    if (streamComplete) {
      if (this.inProgress) {
        this.onScaleEnd(this);
        this.inProgress = false;
        this.initialSpan = 0;
      }

      if (action !== EventTypes.DOWN) {
        return true;
      }
    }

    const configChanged: boolean =
      action === EventTypes.DOWN ||
      action === EventTypes.ADDITIONAL_POINTER_UP ||
      action === EventTypes.ADDITIONAL_POINTER_DOWN;

    const ignoredPointer: number | undefined = isAdditionalPointerUp
      ? event.pointerId
      : undefined;

    // Determine focal point

    const numOfPointers =
      tracker.getTrackedPointersCount() - (isAdditionalPointerUp ? 1 : 0);

    const focus = tracker.getAbsoluteCoordsAverage();

    // Determine average deviation from focal point

    const devSum = { x: 0, y: 0 };

    tracker.getData().forEach((value, key) => {
      if (key === ignoredPointer) {
        return;
      }

      devSum.x += Math.abs(value.abosoluteCoords.x - focus.x);
      devSum.y += Math.abs(value.abosoluteCoords.y - focus.y);
    });

    const devX: number = devSum.x / numOfPointers;
    const devY: number = devSum.y / numOfPointers;

    const spanX: number = devX * 2;
    const spanY: number = devY * 2;

    const span = Math.hypot(spanX, spanY);

    // Begin/end events

    const wasInProgress: boolean = this.inProgress;
    this.focusX = focus.x;
    this.focusY = focus.y;

    if (this.inProgress && (span < this.minSpan || configChanged)) {
      this.onScaleEnd(this);
      this.inProgress = false;
      this.initialSpan = span;
    }

    if (configChanged) {
      this.initialSpan = this.prevSpan = this.currentSpan = span;
    }

    if (
      !this.inProgress &&
      span >= this.minSpan &&
      (wasInProgress || Math.abs(span - this.initialSpan) > this.spanSlop)
    ) {
      this.prevSpan = this.currentSpan = span;
      this.prevTime = this.currentTime;
      this.inProgress = this.onScaleBegin(this);
    }

    // Handle motion

    if (action !== EventTypes.MOVE) {
      return true;
    }

    this.currentSpan = span;

    if (this.inProgress && !this.onScale(this)) {
      return true;
    }

    this.prevSpan = this.currentSpan;
    this.prevTime = this.currentTime;

    return true;
  }

  public getCurrentSpan(): number {
    return this.currentSpan;
  }

  public getFocusX(): number {
    return this.focusX;
  }

  public getFocusY(): number {
    return this.focusY;
  }

  public getTimeDelta(): number {
    return this.currentTime - this.prevTime;
  }

  public getScaleFactor(numOfPointers: number): number {
    if (numOfPointers < 2) {
      return 1;
    }

    return this.prevSpan > 0 ? this.currentSpan / this.prevSpan : 1;
  }
}
