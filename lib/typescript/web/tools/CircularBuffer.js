export default class CircularBuffer {
    bufferSize;
    buffer;
    index;
    actualSize;
    constructor(size) {
        this.bufferSize = size;
        this.buffer = new Array(size);
        this.index = 0;
        this.actualSize = 0;
    }
    get size() {
        return this.actualSize;
    }
    push(element) {
        this.buffer[this.index] = element;
        this.index = (this.index + 1) % this.bufferSize;
        this.actualSize = Math.min(this.actualSize + 1, this.bufferSize);
    }
    get(at) {
        if (this.actualSize === this.bufferSize) {
            let index = (this.index + at) % this.bufferSize;
            if (index < 0) {
                index += this.bufferSize;
            }
            return this.buffer[index];
        }
        else {
            return this.buffer[at];
        }
    }
    clear() {
        this.buffer = new Array(this.bufferSize);
        this.index = 0;
        this.actualSize = 0;
    }
}
