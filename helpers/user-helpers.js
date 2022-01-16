const collection = require('../config/collection')
var db=require('../config/connection')
var {ObjectId}=require('mongodb')
var bcrypt = require('bcrypt')
const { response } = require('express')
module.exports={

    adduser:(userDetails)=>{
        return new Promise(async(resolve,reject)=>{
            userDetails.permission=true
            userDetails.password=await bcrypt.hash(userDetails.password,10)
        db.get().collection('users').insertOne(userDetails).then((response)=>{
        console.log(response);
            resolve(response)
            
        })

        })
        
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let user= await db.get().collection(collection.SIGNIN_COLLECTION).find().toArray()
            resolve(user)
        })
    },
    
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SIGNIN_COLLECTION).deleteOne({_id:ObjectId(userId)}).then(()=>{
                resolve()
            })
        })
    },
    getUsersdetials:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.SIGNIN_COLLECTION).findOne({_id:ObjectId(userId)}).then((user)=>{
                resolve(user)
            })
        })
    },
    updateUser:(userId,userData)=>{
        return new Promise((resolve,reject)=>{
            console.log(userId);
            console.log(userData);
            db.get().collection(collection.SIGNIN_COLLECTION).updateOne({_id:ObjectId(userId)},{
                $set:{
                    Name:userData.Name,
                    Email:userData.Email,
                    Place:userData.Place,
                    Age:userData.Age
                }
            }).then((user)=>{
                console.log(user);
                resolve(user)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(userData);
            let user=await db.get().collection("admin").findOne({Email:userData.Email,password:userData.password})
            console.log(user);
            if(user){
                resolve(true);
                return;
            }
            resolve(false)
        
        })
    },
   blockUser:(userId)=>{
        return new Promise(async (resolve,reject)=>{
             let blkUser= await db.get().collection(collection.SIGNIN_COLLECTION).findOne({_id:ObjectId(userId)})
            if(blkUser.permission){
                value=blkUser.permission=false
            }else{
                value=blkUser.permission=true
            }
            db.get().collection(collection.SIGNIN_COLLECTION).updateOne({_id:ObjectId(userId)},{$set:{permission:(value)}}).then((response)=>{
                resolve();
            })
        })
    },
    checkuser:(userData)=>{
        return new Promise(async (resolve,reject)=>{
            let user=await db.get().collection(collection.SIGNIN_COLLECTION).findOne({Email:userData.Email})
            resolve(user)
    })
}

}