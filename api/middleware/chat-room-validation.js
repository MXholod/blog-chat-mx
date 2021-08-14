const { body } = require('express-validator');
const { ChatRoom } = require('./../helpers/db');

module.exports = ()=>{
  let reg = /^([а-яА-Яa-zA-Z_0-9-\s])*$/i;
  return [
    body('description').custom( (value, { req })=>{
      //Checking 'name' from client side
      let regRes = value.search(reg);
      if(regRes === -1){
        throw new Error('The room description format has limited characters');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    } ),
    body('name').custom((value, { req } )=> {
      //Checking 'name' from client side
		  let regRes = value.search(reg);
      if(regRes === -1){
        throw new Error('The room name format is incorrect');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    }),
    body('name').custom(async (value, { req } )=> {
      //Remove empty spaces
      value = value.trim();
      //Find all documents named john and at least 18
       const res = await ChatRoom.findOne({ name: value }).exec();
      //Compare name from DB and incoming value
      if(res !== null && value === res.name){
        throw new Error('The room already exists');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
  ]
}
