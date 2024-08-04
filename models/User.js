const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Please enter an Email"],
        unique:true,
        lowercase:true,
        validate:[isEmail,"Please enter an email"]
    },
    password:{
        type:String,
        required:[true,"Please enter an Password"],
        minlength:[6,"Minimum password length is 6"]
        
    }
})

//fire a function after doc saved
userSchema.post('save',function(doc,next){
    
    console.log("new user is created and saved",doc)
    next();
})
//fire a function after doc saved
userSchema.pre('save',async function(next){
    // console.log("user about to get created",this)
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password,salt)
    next();
})

userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email: email});
    if(user){
        const auth = await bcrypt.compare(password,user.password)
        if(auth){
            return user
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email')
}

const User = new mongoose.model('User',userSchema);
module.exports=User