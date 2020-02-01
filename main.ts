/**
 * Functions to talk to the mosaic controller
 */
namespace dreamMachine {
    const PAUSE_PER_BYTE = 5
    const PAUSE_PER_UPDATE = 1000
    const BAUD_RATE = BaudRate.BaudRate9600

    enum Channel {
        Intensity,
        Red,
        Green,
        Blue
    }

    export class Pod {
        private index: number;

        /**
         * The brightness from 0..255
         */
        brightness: number;
        /**
         * The color as an RGB value
         */
        color: number;

        constructor(index: number) {
            this.index = index;
            this.brightness = 0;
            this.color = 0;
        }

        update() {
            this.sendByte(this.encode(Channel.Intensity, this.brightness & 0xff));
            this.sendByte(this.encode(Channel.Red, this.color & 0xff));
            this.sendByte(this.encode(Channel.Green, (this.color >> 8) & 0xff));
            this.sendByte(this.encode(Channel.Blue, (this.color >> 16) & 0xff));
        }

        private encode(channel: number, value: number) {
            const c = this.index
                | (channel << 2)
                | ((value >> 4) << 4);
            return c;
        }

        private sendByte(b: number) {
            const code = ~(b << 1);
            const buf = control.createBuffer(1)
            buf.setUint8(0, code)
            serial.writeBuffer(buf)
            pause(PAUSE_PER_BYTE)
        }
    }

    let _pods: Pod[];
    /**
     * Gets the pods
     */
    export function pods(): Pod[] {
        if (!_pods) {
            serial.setBaudRate(BAUD_RATE);
            _pods = [
                new Pod(0),
                new Pod(1),
                new Pod(2),
                new Pod(3)
            ]
            setInterval(updatePods, PAUSE_PER_UPDATE)
        }
        return _pods;
    }

    function updatePods() {
        for(const pod of pods()) {
            pod.update();
        }
    }
}

