const user = require('../models/user')
const user = require ('../models/user')

const index = (req,res,next) =>{
    user.find()
    .then(response=> {
        res.json({
            response
        })
    })
    .catch(error=>{
        res.json({
            message: 'An error Occured!'
        })
    })
}
const show = (req,res,next) =>{
    let username = req.body.name
    user.findById(username)
    .then(response=>{
        res.json({
            response
        })
        .catch(error=>{
            message:'An error Occured!'
        })
    })
}

const store = (req,res,next) =>{
    let user = new user({
        name:req.body.name
    })
    user.save()
    .then(response =>{
        res.json({
            message: 'user Added Successfully!'
        })
    }).catch(error => {
        res.json({
            message: 'An error Occured!'
        })
    })
}

module.exports ={
    index,show,store
}