//https://api.nasa.gov/neo/rest/v1/feed?start_date=START_DATE&end_date=END_DATE&api_key=API_KEY
//SPDX-License-Identifier: GPL - 3.0
pragma solidity ^0.8.0;

contract Oracle{

    address owner ;
    uint public  numeroAsteroids;

    constructor () public {
        owner = msg.sender;
    }

    //evento que avisa al recibir datos del oraculo
    event __calbackNewData();

    // solo el dueño puede modificar
    modifier onlyOwner (){
        require(owner == msg.sender,'Only owner');
        _;
    }

    function update() public onlyOwner{
        emit __calbackNewData();

    }

    function setNumberAsteroids(uint _numeroAsteroids) public onlyOwner{
        numeroAsteroids = _numeroAsteroids;

    }

}