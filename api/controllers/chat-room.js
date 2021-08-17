const { ChatRoom, ChatMessage } = require('./../helpers/db');
const { validationResult } = require('express-validator');

async function createRoom(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
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

async function getAllRooms(req, res){
  try{
    const rooms = await ChatRoom.find({});
    if(rooms && !!rooms.length){
      return res.status(200).json({ message: "Rooms list", rooms });
    }
    return res.status(400).json({ message: "Rooms are absent", rooms: [] });
  }catch(e){
    return res.status(400).json({ message: "Rooms are absent", room: [] });
  }
}
// Admin section
async function getAllRoomsWithMessages(req, res){
  try{
    // allMessages - [ {user: 'id', room: 'id', ..}, .. ]
    let allMessages = await ChatMessage.find({});
    //Get only room ids as strings
    allMessages = allMessages.map(message => message.room.toString());
    const allRooms = await ChatRoom.find({});
    //If no rooms
    if(!allRooms.length){
      return res.status(200).json({ message: "Rooms are absent 1", rooms: [] });
    }
      //Object where keys - rooms with ids and value - object.
      // { 'ds23dfd434' : {default data} }
      let roomsObject = {};
      for(let i = 0; i < allRooms.length;i++){
				roomsObject[ allRooms[i]._id.toString() ] = {
          id: allRooms[i]._id.toString(), //Room id
          roomName: allRooms[i].name,
          roomDescription: allRooms[i].description,
          totalMessages: 0, //Messages initialized by zero
          deleteRoom: false,
          switchBtn:false
        };
			}
      ////Count messages in each room. Compare id rooms from ChatMessage (Model) with ids ChatRoom (Model)
      for(let i = 0; i < allMessages.length; i++){
				if(!(allMessages[i] in roomsObject)){
				  roomsObject[ allMessages[i] ].totalMessages = 1;
				}else{
				  roomsObject[ allMessages[i] ].totalMessages += 1;
				}
			}
      const rooms = [];
      //Add to the array only values
      for(let key in roomsObject){
				rooms.unshift(roomsObject[key]);
			}
      return res.status(200).json({ message: "All rooms", rooms});
  }catch(e){
    console.log(e);
    return res.status(400).json({ message: "Rooms are absent 3", room: [] });
  }
}

async function deleteRoomWithMessages(req, res){
  let rooms = req.body;
  try{
    //Delete one room
    if(rooms.length === 1){
      const deleteOneRoom = await ChatRoom.deleteOne({ _id: rooms[0] });
      if(deleteOneRoom){
        //Delete all messages
        const deleteManyMsg = await ChatMessage.deleteMany({ room: {$in: rooms} });
        return res.status(200).json({ message: "All rooms deleted", rooms: true});
      }
      return res.status(400).json({ message: "Rooms are absent", rooms: [] });
    }
    //Delete many rooms
    if(rooms.length > 1){
      const deleteManyRooms = await ChatRoom.deleteMany({ _id: {$in: rooms} });
      if(deleteManyRooms){
        //Delete all messages
        const deleteManyMsg = await ChatMessage.deleteMany({ room: {$in: rooms} });
        return res.status(200).json({ message: "All rooms deleted", rooms: true});
      }
      return res.status(400).json({ message: "Rooms are absent", rooms: [] });
    }
    return res.status(400).json({ message: "Rooms are absent", rooms: [] });
  }catch(e){
    return res.status(400).json({ message: "Rooms are absent", room: [] });
  }
}

module.exports = {
  createRoom,
  getAllRooms,
  getAllRoomsWithMessages,
  deleteRoomWithMessages
};
