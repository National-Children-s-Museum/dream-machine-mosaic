/**
 * Functions to talk to the Dream Machine
 */
//% weight=100 icon="\uf0eb"
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

    //% fixedInstances
    export class Pod {
        private index: number;

        /**
         * The brightness from 0..255
         */
        private _brightness: number;
        /**
         * The color as an RGB value
         */
        private _color: number;

        private static pods: Pod[] = [];

        static updatePods() {
            for (const pod of Pod.pods) {
                pod.update();
            }
        }

        constructor(index: number) {
            this.index = index;
            this._brightness = 0xf0;
            this._color = 0xf000f0;

            // record in list of pods
            Pod.pods.push(this);
        }

        private update() {
            this.sendByte(this.encode(Channel.Intensity, this._brightness & 0xff));
            this.sendByte(this.encode(Channel.Red, this._color & 0xff));
            this.sendByte(this.encode(Channel.Green, (this._color >> 8) & 0xff));
            this.sendByte(this.encode(Channel.Blue, (this._color >> 16) & 0xff));
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

        /**
         * Sets the brightness of the pod, from 0..255
         *
         */
        //% brightness.min=0 brightness.max=255  
        //% blockId=dmpodsetbrightness
        //% block="set pod %pod brightness to %brightness"
        setBrightness(brightness: number) {
            this._brightness = brightness | 0;
        }

        /**
         * Sets the desired color of the pod
         */
        //% blockId=dmpodsetcolor
        //% block="set pod %pod color to %brightness"
        setColor(color: number) {
            this._color = color | 0;
        }
    }

    /**
     * The big pod
     */
    //% fixedInstance whenUsed block="pod 0"
    export const pod0 = new Pod(0);
    /**
     * The pod 1
     */
    //% fixedInstance whenUsed block="pod 0"
    export const pod1 = new Pod(1);
    /**
     * The pod 2
     */
    //% fixedInstance whenUsed block="pod 0"
    export const pod2 = new Pod(2);
    /**
     * The pod 3
     */
    //% fixedInstance whenUsed block="pod 3"
    export const pod3 = new Pod(3);

    // init system
    serial.setBaudRate(BAUD_RATE);
    setInterval(Pod.updatePods, PAUSE_PER_UPDATE)
}

