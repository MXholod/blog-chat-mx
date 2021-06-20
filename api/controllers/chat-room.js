const { ChatRoom } = require('./../helpers/db');

async function createRoom(req, res){
  const newRoomData = req.body;
  try{
    const room = new ChatRoom(newRoomData);
    if(room){
      await room.save();
      return res.status(201).json({ message: "Room created", room });
    }
    return res.status(400).json({ message: "Room hasn't created", room: null });
  }catch(e){
    return res.status(400).json({ message: "Room hasn't created", room: null });
  }
}

module.exports = {
  createRoom
};
