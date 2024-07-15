import mongoose,{ Schema,model,Types } from "mongoose";

const schema=new Schema({

    content:String,

    attachments:[{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    }
    ],
    sender:{
        type:Types.ObjectId,
        ref:"User",
        require:true,
    },
    Chat:{
    type:Types.ObjectId,
    ref:"Chat",
    require:true,
    },
},{
    timestamps:true,
});

export const Message= mongoose.models.Message || model("Message",schema);