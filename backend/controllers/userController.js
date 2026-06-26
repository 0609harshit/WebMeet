import User from '../models/user.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const userRegister=async (req, res)=>{
    let {name, userName, password} = req.body;
    try{
        let userNameExist = await User.findOne({userName});
        if(userNameExist){
            return res.status(400).json({message:"User name already taken"})
        }
        let hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            userName,
            hashPassword
        })
        await user.save();
        res.status(201).json({message:'User saved successfully'})
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
export const userLogin = async (req, res)=>{
    let {userName, password} = req.body;
    try{
        let user = await User.findOne({userName});
        if(!user){
            return res.status(404).json({meaage:'User not found'})
        }
        let userHashPassword = user.hashPassword;
        let passMatch = await bcrypt.compare(password, userHashPassword);
        if(!passMatch){
            return res.status(401).json({message:'Invalid password'})
        }
        return res.status(200).json({
            message:'User found',
            user:{
                id:user._id,
                name:user.name,
                userName:user.userName,
                history:user.history
            }
        })
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}