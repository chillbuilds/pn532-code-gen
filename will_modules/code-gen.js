module.exports = function(dataArr) {
    console.log(dataArr)
    var sectorArr = []
    var writeDataArr = []
    var err = false
    for(var i = 0; i < dataArr.length; i++){
        if(dataArr[i].sector < 1 || dataArr[i].sector > 15){
          console.log('Parsing error A.. Code generation aborted')
          err = true
        }
        sectorArr.push(dataArr[i].sector)
        writeDataArr.push(dataArr[i].writeData)
    }
    if(sectorArr.length != dataArr.length){
      console.log('Parsing error B.. Code generation aborted')
      err = true
    }
    const fs = require('fs')

    var template = `#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_SCK  (2)
#define PN532_MOSI (3)
#define PN532_SS   (4)
#define PN532_MISO (5)

#define READ_AS_NDEF (1)

Adafruit_PN532 nfc(PN532_SCK, PN532_MISO, PN532_MOSI, PN532_SS);
int sectors[${dataArr.length}] = { ${sectorArr} };
const char * writeData[${dataArr.length}] = { ${writeDataArr} };
uint8_t ndefprefix = 0;
void setup(void) {
  Serial.begin(115200);
  delay(10); // buffer

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {Serial.print("Didn't find PN532 board");while (1); // halt
  }else{Serial.println("scan chip to update..");}
  
  nfc.SAMConfig();
}

void loop(void) {
  uint8_t success;                          // Flag to check if there was an error with the PN532
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
  bool authenticated = false;               // Flag to indicate if the sector is authenticated

  uint8_t key[6] = { 0xD3, 0xF7, 0xD3, 0xF7, 0xD3, 0xF7 };
//  uint8_t key[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

      // check length to prevent corruption
    if (strlen(writeData) > 38){
      Serial.println("Write data is limited to 38 characters, so hurry tf up and sort that out");
      return;}
    
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  
  if (success && sector != 0) 
  {
    nfc.PrintHex(uid, uidLength);
    Serial.println("");

    success = nfc.mifareclassic_AuthenticateBlock (uid, uidLength, (sector*4), 0, key);
    if (!success)
    {
      Serial.println("Unable to authenticate block...");
      delay(3000);
      return;
    }

    success = nfc.mifareclassic_WriteNDEFURI(sector, ndefprefix, writeData);
    if (success){
      Serial.println("Data written to sector \n");
    }else{
      Serial.println("Write failed \n");
    }
  }
  delay(5000);
}`
  if(err == false){
    fs.writeFileSync('./pn532-node/pn532-node.ino', '')
    fs.appendFileSync('./pn532-node/pn532-node.ino', template)}
}