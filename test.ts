const colors = [
    0xff0000,
    0x00ffff,
    0x0000ff
]
for(const pod of dreamMachine.pods()) {
    for(const color of colors) {
        pod.color = color;
    }
    pause(1000)
} 