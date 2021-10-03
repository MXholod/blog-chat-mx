const  { SystemMessage } = require('./../helpers/db');
const { createPageItemIdV4 } = require('./../helpers/uuid');

async function allSystemMessages(req, res){
  try{
    const allSystemMsg = await SystemMessage.find({});
    //If messages are absent
    if(allSystemMsg && allSystemMsg.length == 0){
      return res.status(200).json({ message: "Messages are absent", rooms: [] });
    }
    //Result of rooms with their messages and amount of messages
    let rooms = {};
    //1. Get all rooms from messages with duplicates
    let roomsWithMessages = [];
    for(let i = 0; i < allSystemMsg.length; i++){
      if(allSystemMsg[i].roomName in rooms){
        rooms[allSystemMsg[i].roomName] = {
          "id": createPageItemIdV4(),
          "roomName": allSystemMsg[i].roomName,
          "currentPage": 1,
          "totalMessages": rooms[allSystemMsg[i].roomName].totalMessages +=1,
          "messages": [
            ...rooms[allSystemMsg[i].roomName].messages,
            {
              id: allSystemMsg[i]._id,
              userName: allSystemMsg[i].userName,
              title: allSystemMsg[i].title,
              text: allSystemMsg[i].text,
              date: allSystemMsg[i].date
            }
          ]
        };
      }else{
        rooms[allSystemMsg[i].roomName] = {
          "id": createPageItemIdV4(),
          "roomName": allSystemMsg[i].roomName,
          "currentPage": 1,
          "totalMessages": 1,
          "messages": [
            {
              id: allSystemMsg[i]._id,
              userName: allSystemMsg[i].userName,
              title: allSystemMsg[i].title,
              text: allSystemMsg[i].text,
              date: allSystemMsg[i].date
            }
          ]
        };
      }
    }
    //From object to array
    for(let room in rooms){
      roomsWithMessages.push(rooms[room]);
    }
    return res.status(200).json({ message: "All messages", rooms: roomsWithMessages });
  }catch(e){
    return res.status(400).json({ message: "Messages are absent", rooms: [] });
  }
}

async function deleteSystemMessage(req, res){
  const { messageId } = req.body;
  if(!messageId) return res.status(400).json({ message: "Message is absent", deleted: false });
  try{
    const result = await SystemMessage.findByIdAndDelete(messageId);
    return res.status(204).json({ message: "Room has been deleted", deleted: result });
  }catch(e){
    return res.status(400).json({ message: "Room can't be deleted", deleted: false });
  }
}

module.exports = {
  allSystemMessages,
  deleteSystemMessage
}
