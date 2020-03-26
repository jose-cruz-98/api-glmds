const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const schema = new Schema({
    tName : {
        type : String,
        required : true,
    },
    tSurname : {
        type : String,
        required : true
    },
    tEmail : {
        type : String,
        unique : true,
        required : true
    },
    tPassword : {
        type : String,
        required : true
    },
    tTypeUser : {
        type : String,
        enum : ["ADMINISTRADOR","LOCAL","EXTERNO"],
        required : true
    },
    tRole : [{
        type : String,
        enum : ["DIRECCION","ADMINISTRACION","OPERACIONES","RECURSOS HUMANOS","FACTURACION","SISTEMAS"],
        required : true
    }],
    tImage : String,
    isActive : Boolean
})

schema.methods.encryptPassword = async (tPassword) => {
    try{
        const salt = await bcrypt.genSalt(15);
        return bcrypt.hash(tPassword, salt);
    }catch(err){
        console.log("Error in pro user model : ", err)
    }
}

schema.methods.validatePassword = function (tPassword) {
    return bcrypt.compare(tPassword, this.tPassword);
}

const model = mongoose.model('pro_users', schema);

module.exports = model;

// {
    //         "tName" : "Jose Ernesto", 
    //         "tSurname" : "Cruz Miranda",
    //         "tEmail" : "sistema@gmail.com",
    //         "tPassword" : "cc97819347e032ecdff9b52d4a7c1bc09dbc6d2b",
    //         "tTypeUser" : "ADMINISTRADOR",
    //         "tRole" : "SISTEMAS",
    //         "tStatus" : true 
    //     }
    
    // {
    // 	"tEmail" : "comercial@logisticamaresdelsur.com",
    // 	"tPassword" : "Guadalajara1!"
    // }