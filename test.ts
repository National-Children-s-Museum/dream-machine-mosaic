const colors = [
    0xff0000,
    0x00ffff,
    0x0000ff
]
control.runInBackground(function () {
    dreamMachine.pod0.setColor(0xff0000)
    dreamMachine.pod1.setColor(0x00ff00)
    dreamMachine.pod1.setColor(0x0000ff)
})
