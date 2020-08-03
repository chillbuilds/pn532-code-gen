const inquirer = require('inquirer')
const codeGen = require('./will_modules/code-gen')
var dataArr = []
var writeData = ''
var sector = ''

function dataPrompt(){
inquirer.prompt({
    name: 'writeData',
    type: 'input',
    message: 'Enter data (38 character limit per sector)'})
    .then(function(data){
        if(data.writeData.length > 38){
            console.log('Data limit exeeded');dataPrompt()}
        else{writeData = data.writeData;sectorPrompt()}
    })
}

function sectorPrompt() {
    inquirer.prompt({
        name: 'sector',
        type: 'number',
        message: 'Enter sector to write data to (1 - 15)'
    }).then(function(data){
        if(data.sector < 1 || data.sector > 15){
            console.log('Provided sector out of bounds');sectorPrompt()}
        else{sector = data.sector;addQuery()
        let obj = {writeData: writeData, sector: sector}
        dataArr.push(obj);}
    })
}

function addQuery() {
    inquirer.prompt({
        name:'add',
        type: 'confirm',
        message: 'Update new sector?'
    }).then(function(data){
        if(data.add == true){
            dataPrompt()}
        else{codeGen(dataArr)}
        })
}

dataPrompt()