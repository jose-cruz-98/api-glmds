const ProUsers = require('../models/pro_users.models');
const secret = require('../configs/properties').SECRET;
const jwt = require('jsonwebtoken');

exports.singin = async (req, res, next) => {
    const {tEmail, tPassword} = req.body;
    console.log(tEmail)
    try{
        let user = await ProUsers.findOne({tEmail});

        if(!user){
            return res.status(404).json({msg : "El correo no existe"});
        }

        let isValidPassword = await user.validatePassword(tPassword);

        if(!isValidPassword){
            return res.status(404).json({msg : "La contraseña es incorrecta"});
        }

        let token = jwt.sign({
            _id : user._id
            }, secret,{
                expiresIn : 60 * 60 * 24
            });

        res.status(200).json({
            token : token,
            dataUser : {
                tName : user.tName + " " + user.tSurname,
                tTypeUser : user.tTypeUser,
                tRole : user.tRole,
                tImage : user.tImage
            },
            msg : `¡Bienvenido ${user.tName}!`
        })   
    }catch(err){
        console.error("Error in users controller - login : ", err);
    }

}

exports.singup = async (req ,res ,next) => {
    const {tName, tSurname, tEmail, tPassword, tTypeUser, tRole, isActive} = req.body;

    try{
        let proUser = new ProUsers({tName,tSurname,tEmail,tPassword,tTypeUser,tRole,isActive});

        proUser.tPassword = await proUser.encryptPassword(proUser.tPassword);
        
        let saved = await proUser.save();

        console.log(saved);
        res.json({"msg":"good"});
    }catch(err){
        console.log("Error in singup : ", err);
    }
}