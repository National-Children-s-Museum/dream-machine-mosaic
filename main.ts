/**
 * Control the colors of the Dream Machine
 */
//% weight=100 icon="\uf0eb"
namespace dreamMachine {
    const PAUSE_PER_BYTE = 40
    const BAUD_RATE = BaudRate.BaudRate9600
    let interval: number = 1000
    export let debug = false;

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
            this._brightness = 0;
            this._color = 0;

            // record in list of pods
            Pod.pods.push(this);
        }

        private update() {
            if (debug)
                console.log(`pod ${this.index} c ${Pod.toHex(this._color)} b ${Pod.toHex(this._brightness)}`)
            this.sendByte(this._brightness & 0xff, this.encode(Channel.Intensity, this._brightness & 0x70));
            this.sendByte(this._color & 0xff, this.encode(Channel.Red, (this._color >> 16) & 0x70));
            this.sendByte((this._color >> 8) & 0xff, this.encode(Channel.Green, (this._color >> 8) & 0x70));
            this.sendByte((this._color >> 16) & 0xff, this.encode(Channel.Blue, this._color & 0x70));
        }

        private static toHex(n: number) {
            if (n < 0xff) {
                const b = control.createBuffer(1);
                b[0] = n
                return b.toHex();
            } else {
                const b = control.createBuffer(4);
                b.setNumber(NumberFormat.UInt32LE, 0, n)
                return b.toHex();
            }
        }

        private encode(channel: number, value: number) {
            const c = this.index
                | (channel << 2)
                | ((value >> 4) << 4);
            return c;
        }

        private sendByte(value: number, encoded: number) {
            const code = ~(encoded << 1);
            const buf = control.createBuffer(1)
            buf.setUint8(0, code)
            if (debug)
                console.log(`${value}:${Pod.toHex(value)} > ${encoded}:${Pod.toHex(encoded)} > ${buf.toHex()}`)
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
            this._brightness = brightness;
        }

        /**
         * Sets the desired color of the pod
         */
        //% blockId=dmpodsetcolor
        //% block="set pod %pod color to %brightness"
        setColor(color: number) {
            this._color = color;
            if (debug)
                console.log(`pod ${this.index} c ${Pod.toHex(this._color)}`)
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

    /**
     * Sets the update interval in milliseconds
     */
    export function setUpdateInterval(millis: number) {
        interval = Math.max(500, millis | 0)
    }

    // init system
    serial.setBaudRate(BAUD_RATE);
    control.runInBackground(function() {
        while(true) {
            Pod.updatePods();
            pause(interval);
        }
    })
}

