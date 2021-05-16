const { param } = require('express-validator');

function validationParamPageContent(){
  return [
    param('reference').custom((value)=>{
      const reg = /^[A-Za-z0-9-]{0,36}$/g;
      if(!reg.test(value)){
        throw new Error('Page that you are looking for not found');
      }
      // Indicates the success of this synchronous custom validator
      return true;
    })
  ];
}

module.exports = validationParamPageContent;
