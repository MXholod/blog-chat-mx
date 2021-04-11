const { v4: uuidv4, v5: uuidv5 } = require('uuid');
const { HASH5 } = require('./../config/keys');

function createPageItemIdV4(){
  const id = uuidv4();
  return id;
}

function createReferenceV5(parent,item){
  //'parent' and 'item' are arrays
  let parentItem = parent === undefined ? item[0] : parent[1];
  let itemString = String(parentItem) + String(item[0]) + String(item[1]);
  const reference = uuidv5(itemString, HASH5);
  return reference;
}


module.exports = {
  createPageItemIdV4,
  createReferenceV5
}
