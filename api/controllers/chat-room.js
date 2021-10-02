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
    return res.status(200).json({ message: "Rooms are absent", rooms: [] });
  }catch(e){
    return res.status(400).json({ message: "Rooms are absent", rooms: [] });
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

async function getAllRoomsWithChatMessages(req, res){
  try{
    //Get all rooms [ {name:'', description: ''} ]
    const allRooms = await ChatRoom.find({});
    //If rooms are absent
    if(allRooms && (allRooms.length === 0)){
      return res.status(200).json({ message: "Rooms are absent", rooms: [] });
    }
    // allMessagesWithRooms - [ {user: 'id', room: 'id', ..}, .. ] Get rooms that have messages
    const allMessagesWithRooms = await ChatMessage.find({}).populate('room');
    //Result of rooms with their messages and amount of messages
    let rooms = [];
    //1. Get all rooms from messages with duplicates
    let roomsWithDuplicates = [];
    for(let i = 0; i < allMessagesWithRooms.length; i++){
      //Current message
      const room = {
        "id": allMessagesWithRooms[i].room._id,
        "roomName": allMessagesWithRooms[i].room.name,
        "currentPage": 1,
        "totalMessages": 0,
        "messages": []
      };
      roomsWithDuplicates.push(room);
    }
    //2. Delete rooms duplications
    const uniqueRooms = roomsWithDuplicates.reduce((acc, item)=>{
      return acc.find(e => e.id === item.id) ? acc : [...acc, item];
    },[]);
    //3. Add messages to unique rooms and count those messages. Create object
    let mapRooms = {};
    //Create object where key is room 'id', value is an object 'message'
    for(let i = 0; i < uniqueRooms.length; i++){
      //Key as room 'id' and value 'message' object
      mapRooms[uniqueRooms[i].id.toString()] = uniqueRooms[i];
    }
    //
    if(allMessagesWithRooms.length > 0){
      //Add message to the room and count messages
      for(let j = 0;j < allMessagesWithRooms.length; j++){
        //"totalMessages": 0, "messages": []
        let roomId = allMessagesWithRooms[j].room._id.toString();
        //Room 'id' in message is equal to room 'id'
        if(roomId in mapRooms){
          //Increase by one 'totalMessages'
          mapRooms[roomId].totalMessages += 1;
          //Add message without 'room' property to the parent room
          //const { room, ...message } = allMessagesWithRooms[j];
          const { userName, role, text, date, _id: id } = allMessagesWithRooms[j];
          if(!Array.isArray(mapRooms[roomId].messages)){
            mapRooms[roomId].messages = new Array();
          }
          //Add room message into the array of messages
          mapRooms[roomId].messages.push({ id, userName, role, text, date });
        }
      }
    }
    //Add into the array only values which are rooms. Keys are skipped
    for(let key in mapRooms){
      rooms.unshift(mapRooms[key]);
    }
    return res.status(200).json({ message: "Room list with messages", rooms });
  }catch(e){
    return res.status(400).json({ message: "Rooms are absent", err: e });
  }
}

async function deleteChatMessage(req, res){
  const { messageId } = req.body;
  if(!messageId) return res.status(400).json({ message: "Room is absent", deleted: false });
  try{
    const result = await ChatMessage.findByIdAndDelete(messageId);
    return res.status(204).json({ message: "Room has been deleted", deleted: result });
  }catch(e){
    return res.status(400).json({ message: "Room can't be deleted", deleted: false });
  }
}

module.exports = {
  createRoom,
  getAllRooms,
  getAllRoomsWithMessages,
  deleteRoomWithMessages,
  getAllRoomsWithChatMessages,
  deleteChatMessage
};
