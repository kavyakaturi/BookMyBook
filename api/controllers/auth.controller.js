import Role from "../models/Role.js";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { CreateError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js";
import UserToken from "../models/UserToken.js";

dotenv.config();

export const register = async (req, res, next) => {
    try {
        // Check if user with the same email or username already exists
        const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.userName }] });

        if (existingUser) {
            // User with the same email or username already exists
           return next(CreateError(400,"You are already registered"))
        }

        // User is not already registered, proceed with registration
        const role = await Role.findOne({ role: "User" });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            roles: role
        });
        await newUser.save();
        return next(CreateSuccess(200,"User Registered Successfully!"));
    } catch (error) {
        return next(error);
    }
};


export const  registerAdmin = async (req,res,next)=>{

    const role = await Role.find({});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt)
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      isAdmin: true,
      roles: role
    });
    await newUser.save();
    return next(CreateSuccess(200,"User Registered Successfully"))
}

export const login = async (req,res,next)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        .populate("roles","role");

        const {roles} = user;
        if(!user){
            return res.status(404).send("User Not Found");
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return res.status(404).send("Password is Incorrect"); 
        }
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin, roles:roles},
            process.env.JWT_SECRET
            )
        // return next(CreateSuccess(200,"Login Successful"));
        res.cookie("access_token", token, {httpOnly: true} )
        .status(200)
        .json({
            status: 200,
            message: "Login Successful",
            data: user
        })

    }catch(error){
      return res.status(500).send("something went wrong");
    }
}

export const sendEmail = async (req,res,next)=>{
    const email = req.body.email;
    const user = await User.findOne({email: {$regex: '^'+email+'$', $options: "i"}});
    if(!user){
        return next(CreateError(404, "User not found to reset the mail"));
    }
    const payload={
        email:user.email
    }
    const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:expiryTime });

    const newToken = new UserToken({
        userId: user._id,
        token: token
    });

    const mailTransporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"kavyakaturi11@gmail.com",
            pass:"dyuiurwttvzdjrou"
        }
    });
    let mailDetails = {
        from:"kavyakaturi11@gmail.com",
        to:email,
        subject:"Reset Password",
        html:`
    <html>
    <head>
        <title>Password Reset Request</title>
    </head>
    <body>
        <h1>Password Reset Request</h1>
        <p> Dear ${user.username},</p>
        <p> We have recieved a request to reset your password for your account with BookMyBook. To complete the password reset process, please click on the button below:</p>
        <a href=${process.env.LIVE_URL}/reset/${token}/>
        <button style="background-color: #4CAF50; color: white; padding: 14px 20px; border:none; cursor: pointer; border-radius: 4px">Reset Password</button>
        <p>Please note that this link is only valid for 5mins. If you did not request a password reset, please disregard this message.</P>
        <p>Thank You</P>
        </body>
    </html>`,

    };
    mailTransporter.sendMail(mailDetails, async(err,data)=>{
        if(err){
            console.log(err);
            return next(CreateError(500,"something went wrong while sending a email"));
        }else{
            await newToken.save();
            return next(CreateSuccess(200,"Email Successfully Sent!"));
        }
    })


    
}

export const resetPassword = (req,res,next)=>{
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET,async(err, data)=>{
        if(err){
            return next(CreateSuccess(500,"Reset link is expired"));
        }else{
            const response = data;
            const user = await  User.findOne({email: {$regex: '^'+ response.email+'$', $options: "i"}});
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            try{
                const upadtedUser = await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set: user},
                    {new: true}
                )
                return next(CreateSuccess(200,"Password Reset Successfull"));
            }catch(error){
                return next(CreateError(500,"Something went wrong while reseting the password"));

            }
        }
    })
}