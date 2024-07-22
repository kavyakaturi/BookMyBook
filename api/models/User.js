import {mongoose, Schema} from 'mongoose';


const UserSchema = mongoose.Schema(
    {
        firstName:{
            type:String, 
            required : true
        },
        lastName:{
            type:String,
            required : true     
        },
        username : {
            type:String,
            required : true , 
            unique : true
        },
        email : {
            type:String,
            required : true , 
            unique : true
        },
        password : {
            type:String,
            required : true 
        },
        profileImage: {
            type : String,
            required : false,
            default : "https://www.united-courier.net/wp-content/uploads/2020/05/pic.png" 

        },
        isAdmin:{
            type : Boolean,
            default: false
        },
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        }]
        

    },
    {
        timestamp: true
    }
);

export default mongoose.model("User",UserSchema);