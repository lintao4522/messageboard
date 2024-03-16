'use strict';
const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const boardModel=require('../models').Board;
const threadModel=require('../models').Thread;
const replyModel=require('../models').Reply;

module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .post(async(req,res)=>{
    console.log(req.body);
    const {text,delete_password}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    const thread=await threadModel.create({text,delete_password,replies:[]});
    if(findBoard==null){
      
      const newBorad=await boardModel.create({name:board,threads:[]});
      await newBorad.threads.push(thread);
      await newBorad.save();
      
    }
    else{
      findBoard.threads.push(thread);
      await findBoard.save();
    }
    res.json(thread);

  })
  .get(async (req,res)=>{
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      const threads=findBoard.threads;
      
      const ans=threads.map(thread=>{
        return {text:thread.text,
        created_on:thread.created_on,
      bumped_on:thread.bumped_on,
    replies:thread.replies.map(
        reply=>{
          return {_id:reply._id,text:reply.text,created_on:reply.created_on};  }
      
      ),
  _id:thread._id}

      })
      
        
        res.json(ans);
    }

  })
  .put(async (req,res)=>{
    
    const {thread_id}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      const thread=findBoard.threads.id(thread_id);
      if(thread){
        thread.reported=true;
      thread.bumped_on=new Date();
      await findBoard.save();      
      res.send("reported");
      }
      
    }

  })
  .delete(async(req,res)=>{
    
    const {thread_id,delete_password}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      const thread=findBoard.threads.id(thread_id);
      if(thread){
        if(thread.delete_password==delete_password){
        findBoard.threads.pull(thread);
        await findBoard.save();
       

        res.send('success');
      }
      else{
        res.send('incorrect password');
      }
      }
      
      
    }

  });
    
  app.route('/api/replies/:board')
  .post(async(req,res)=>{
    // console.log(req.body);
    const {text,delete_password,thread_id}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
  
    const findThread=await findBoard.threads.id(thread_id);
    const reply=await replyModel.create({text,delete_password,thread_id});
    if(findThread==null){
      res.json('no thread for that id')
      
    }
    else{
      findThread.replies.push(reply);
      findThread.bumped_on=reply.created_on
      await findBoard.save();
      res.json(reply);
    }
    

  })
  .get(async (req,res)=>{
    const board=req.params.board;
    const thread_id=req.query.thread_id;
    const findBoard=await boardModel.findOne({name:board});
    const thread=findBoard.threads.id(thread_id);
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      if (thread){
        let replies;
        if (thread.replies.length!=0){
          replies=thread.replies.map(
          reply=>{
            return {_id:reply._id,text:reply.text,created_on:reply.created_on}  }

          )
        }
        else{
          replies=[];
        }
              const ans={text:thread.text,
              created_on:thread.created_on,
            bumped_on:thread.bumped_on,
          replies,
        _id:thread._id}
              
              res.json(ans);
      }


    }

  })
  .put(async (req,res)=>{
    
    const {reply_id,thread_id}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      const thread=findBoard.threads.id(thread_id);
      if(thread){
        const reply=thread.replies.id(reply_id);
      reply.reported=true;
      
      findBoard.save();
      res.send("reported");
      }
      
    }

  })
  .delete(async(req,res)=>{
    
    const {thread_id,delete_password,reply_id}=req.body;
    const board=req.params.board;
    const findBoard=await boardModel.findOne({name:board});
    if(findBoard==null){
      res.json("no such board");
    }
    else{
      
        const thread=findBoard.threads.id(thread_id);
        if (thread){
      const reply=thread.replies.id(reply_id);
      if(reply.delete_password==delete_password){
        reply.text='[deleted]';
        
        await findBoard.save();
        res.send('success');
      }
      else{
        res.send('incorrect password');
      }
      
      }
     
      
    }

  });
  

};
