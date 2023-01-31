const collection = require('../config/collection')
var db=require('../config/connection')
const bcrypt=require('bcrypt')
const { log } = require('npmlog')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.permission=true
            userData.password=await bcrypt.hash(userData.password,10)
            db.get().collection(collection.SIGNIN_COLLECTION).insertOne(userData).then((response)=>{
                resolve(response)
            })
        })
    },


doLogin:(userData)=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let response={}
        let user=await db.get().collection(collection.SIGNIN_COLLECTION).findOne({Email:userData.Email})
        if(user){
            console.log(user);
            console.log(userData.password);
            console.log(user.password);
            bcrypt.compare(userData.password,user.password).then((status)=>{
                if(status){
                    console.log("done")
                    response.user=user
                    response.status=true
                    resolve(response)
                }else{
                    console.log('failed')
                    resolve({status:false})
                }
            })


        }else{
            console.log('login failed')
            resolve({status:false})
        }
    })
},
   check:(userData)=>{
    return new Promise(async (resolve,reject)=>{
        let user=await db.get().collection(collection.SIGNIN_COLLECTION).findOne({Email:userData.Email})
        resolve(user)
         })
        }
}
