//dependencias del proyecto
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const fetch = require('node-fetch')

//llamada a los archivos.json
const contractJson =  require('../build/contracts/Oracle.json')

//Instancia de web3 con la direcciòn de ganache
const web3 = new Web3('ws://127.0.0.1:7545')
//direccion del contrato
const addressContract= '0x5f8Dd60aF126E8e29459534910c749555CD6dC27'
//abi del contrato
const contractInstance = new web3.eth.Contract(contractJson.abi,addressContract)
//cuenta en la que correra el contrato
const privateKey = Buffer.from('23b54246c35bbd57fcae2c049fdc9da7416ade65f91cce55bc77ee9f1bbc554f','hex')
const address = '0x8f2234121Dc2D28B3175a13448F7Eda60608CCA4'

//obtener el numero de bloque
 web3.eth.getBlockNumber()
         .then(n => listenEvent(n-1))

//Función listenEvent, llamada al ultimo bloque
function listenEvent(lastBlock){
     contractInstance.events.__calbackNewData({},{fromBlock : lastBlock, toBlock : 'latest'},(err,event) => 
     {
         event ? updateData():null
         err ? console.log(err) : null
     })
 }

//Función: updateData()

function updateData(){
    //start_date = 2015-09-07
    //end_date = 2015-09-08
    const url = 'https://api.nasa.gov/neo/rest/v1/feed?start_date=2015-09-07&end_date=2015-09-08&api_key=DEMO_KEY'
    
    fetch(url)
    .then(response => response.json())
    .then(json => setDataContract(json.element_count))
}

//Función: setDataContrac(_value)
function setDataContract(_value)
{
    web3.eth.getTransactionCount(address, (err,txNum) => 
    {
        contractInstance.methods.setNumberAsteroids(_value).estimateGas({},(err,gasAmount) => 
        {  
            let rawTx = 
            {
                nonce :  web3.utils.toHex(txNum),
                gasPrice : web3.utils.toHex(web3.utils.toWei('1.4','gwei')),
                gasLimit : web3.utils.toHex(gasAmount),
                to : addressContract,
                value : '0x00',
                data : contractInstance.methods.setNumberAsteroids(_value).encodeABI()
            }
            const tx = new Tx(rawTx);
            tx.sign(privateKey);
            const serializedTX = tx.serialize().toString('hex');
            web3.eth.sendSignedTransaction('0x'+ serializedTX);
        })
    })
}







