const { fstat } = require("fs")

module.exports = function(dataArr) {
    const fs = require('fs')
    fs.writeFileSync('./pn532.ino', '')
    fs.appendFileSync('./pn532.ino', codeHeader)
}

var codeHeader = `#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

#define READ_AS_NDEF (1)

Adafruit_PN532 nfc(PN532_SCK, PN532_MISO, PN532_MOSI, PN532_SS);\n`