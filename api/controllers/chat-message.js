const { ChatMessage } = require('./../helpers/db');

async function getRoomMessages(req, res){
  //const { id: userId } = req.user; //user: userId,
  const { room: roomId } = req.params;
  try{
    const result = await ChatMessage.find({ room: roomId }).exec();
    if(result){
      return res.status(200).json({ message: "Ok", messages: result });
    }
  }catch(e){
    return res.status(400).json({ message: "Bad" });
  }
}

module.exports = {
  getRoomMessages
};
