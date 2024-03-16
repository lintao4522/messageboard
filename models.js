const mongoose=require('mongoose');
const {Schema}=mongoose;
const date=new Date();
const replySchema=new Schema({
    text:String,
    created_on:{type:Date,default:date},
    delete_password:String,
    reported:{type:Boolean,default:false},
    thread_id:String

})
const Reply=mongoose.model('Reply',replySchema);
const threadSchema=new Schema({
    text:String,
    created_on:{type:Date,default:date},
    bumped_on:{type:Date,default:date},
    delete_password:String,
    reported:{type:Boolean,default:false},
    replies:[replySchema]

})
const Thread=mongoose.model('Thread',threadSchema);
const boardSchema=new Schema({
    name:String,
    threads:[threadSchema]
})
const Board=mongoose.model('Board',boardSchema);
exports.Board=Board;
exports.Thread=Thread;
exports.Reply=Reply;
