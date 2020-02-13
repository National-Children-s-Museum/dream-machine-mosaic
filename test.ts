dreamMachine.debug = true;
game.consoleOverlay.setVisible(true)
console.log(`mosaic test`)
control.runInBackground(function () {
   dreamMachine.setUpdateInterval(100000)
    dreamMachine.pod0.setColor(0x203040)
    dreamMachine.pod0.setBrightness(0x50)
    dreamMachine.pod1.setColor(0x506070)
    dreamMachine.pod1.setBrightness(0x70)
})
