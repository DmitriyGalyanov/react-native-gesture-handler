import { State } from '../../State';
import GestureHandler from './GestureHandler';
const DEFAULT_MIN_DURATION_MS = 500;
const DEFAULT_MAX_DIST_DP = 10;
const SCALING_FACTOR = 10;
export default class LongPressGestureHandler extends GestureHandler {
    minDurationMs = DEFAULT_MIN_DURATION_MS;
    defaultMaxDistSq = DEFAULT_MAX_DIST_DP * SCALING_FACTOR;
    maxDistSq = this.defaultMaxDistSq;
    startX = 0;
    startY = 0;
    startTime = 0;
    previousTime = 0;
    activationTimeout;
    init(ref, propsRef) {
        if (this.config.enableContextMenu === undefined) {
            this.config.enableContextMenu = false;
        }
        super.init(ref, propsRef);
    }
    transformNativeEvent() {
        return {
            ...super.transformNativeEvent(),
            duration: Date.now() - this.startTime,
        };
    }
    updateGestureConfig({ enabled = true, ...props }) {
        super.updateGestureConfig({ enabled: enabled, ...props });
        if (this.config.minDurationMs !== undefined) {
            this.minDurationMs = this.config.minDurationMs;
        }
        if (this.config.maxDist !== undefined) {
            this.maxDistSq = this.config.maxDist * this.config.maxDist;
        }
    }
    resetConfig() {
        super.resetConfig();
        this.minDurationMs = DEFAULT_MIN_DURATION_MS;
        this.maxDistSq = this.defaultMaxDistSq;
    }
    onStateChange(_newState, _oldState) {
        clearTimeout(this.activationTimeout);
    }
    onPointerDown(event) {
        if (!this.isButtonInConfig(event.button)) {
            return;
        }
        this.tracker.addToTracker(event);
        super.onPointerDown(event);
        this.tryBegin(event);
        this.tryActivate();
        this.checkDistanceFail(event);
        this.tryToSendTouchEvent(event);
    }
    onPointerMove(event) {
        super.onPointerMove(event);
        this.tracker.track(event);
        this.checkDistanceFail(event);
    }
    onPointerUp(event) {
        super.onPointerUp(event);
        this.tracker.removeFromTracker(event.pointerId);
        if (this.currentState === State.ACTIVE) {
            this.end();
        }
        else {
            this.fail();
        }
    }
    tryBegin(event) {
        if (this.currentState !== State.UNDETERMINED) {
            return;
        }
        this.previousTime = Date.now();
        this.startTime = this.previousTime;
        this.begin();
        this.startX = event.x;
        this.startY = event.y;
    }
    tryActivate() {
        if (this.minDurationMs > 0) {
            this.activationTimeout = setTimeout(() => {
                this.activate();
            }, this.minDurationMs);
        }
        else if (this.minDurationMs === 0) {
            this.activate();
        }
    }
    checkDistanceFail(event) {
        const dx = event.x - this.startX;
        const dy = event.y - this.startY;
        const distSq = dx * dx + dy * dy;
        if (distSq <= this.maxDistSq) {
            return;
        }
        if (this.currentState === State.ACTIVE) {
            this.cancel();
        }
        else {
            this.fail();
        }
    }
}
