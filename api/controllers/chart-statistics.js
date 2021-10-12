const { Post, ChatMessage, SystemMessage } = require('./../helpers/db');

module.exports.getAllStatistics = async function(req, res){
  try{
    const posts = await Post.find({});
    const chatMessagesWithRooms = await ChatMessage.find({}).populate('room');
    const systemMessages = await SystemMessage.find({});
    //Get post information: post titles, comments amount for each post, post views amount
    const postLabels = posts.map(post => post.title);
    const commentsAmount = posts.map(post => post.comments.length);
    const postViewsAmount = posts.map(post => post.views);
    //Get chat information: each message with a room turn into room with a message
    let roomsAndMessages = {
      label: "Messages in chat room",
      labels: [],
      data: []
    };
    let roomsWithCountedMessages = {};
    if(chatMessagesWithRooms.length > 0){
      //Hash map with unique keys. Room name - key and amount of messages - value
      for(let i = 0; i < chatMessagesWithRooms.length;i++){
        if(chatMessagesWithRooms[i].room.name in roomsWithCountedMessages){
          roomsWithCountedMessages[chatMessagesWithRooms[i].room.name] = (roomsWithCountedMessages[chatMessagesWithRooms[i].room.name] += 1);
        }else{
          roomsWithCountedMessages[chatMessagesWithRooms[i].room.name] = 1;
        }
      }
      //Create structure for Vue chart
      for(let room in roomsWithCountedMessages){
        roomsAndMessages.labels.push(room);
        roomsAndMessages.data.push(roomsWithCountedMessages[room]);
      }
    }
    //Get system messages
    const systemMessagesAnalytics = {
      label: "System messages in chat room",
      labels:[],
      data: []
    };
    if(systemMessages.length > 0){
      const countSystemMessages = {};
      for(let i = 0; i < systemMessages.length; i++){
        if(systemMessages[i].roomName in countSystemMessages){
          countSystemMessages[systemMessages[i].roomName] = (countSystemMessages[systemMessages[i].roomName] +=1) ;
        }else{
          countSystemMessages[systemMessages[i].roomName] = 1;
        }
      }
      for(let systemMsg in countSystemMessages){
        systemMessagesAnalytics.labels.push(systemMsg);
        systemMessagesAnalytics.data.push(countSystemMessages[systemMsg]);
      }
    }
    //Prepare the statistics data
    const allStatistics = {
      comments: {
        label: "Amount of comments",
        labels: postLabels,
        data: commentsAmount
      },
      views: {
        label: "Post views",
        labels: postLabels,
        data: postViewsAmount
      },
      roomsAndMessages,
      systemMessagesAnalytics
    };

    res.status(200).json({ message: "All statistics", allStatistics });
  }catch(e){
    res.status(500).json(e);
  }
}
