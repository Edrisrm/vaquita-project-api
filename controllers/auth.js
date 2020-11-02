const { response } = require('express');
const { OAuth2Client } = require('google-auth-library');
const { createToken } = require('../helpers/jwt');

const speakeasy = require("speakeasy");
const nodemailer = require('nodemailer');
const User = require('../models/user');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SEND_MAIL_ACCOUNT,
        pass: process.env.SEND_MAIL_PASSWORD,
    }
    });

const oAuth2Client = new OAuth2Client( process.env.GOOGLE_ID );

const register_login_google = ( req, res = response ) => {
    
    const { idToken } = req.body;
    
    oAuth2Client.verifyIdToken ( { idToken: idToken, audience: process.env.GOOGLE_ID } ).then( response => {
                    
        const { email, email_verified, given_name, family_name, } = response.getPayload();

        if(email_verified) {

            try {

                User.findOne ({ email: email.toLowerCase() }, (err, get_user) => {

                    if (err) {
                        return res.status(500).send({
                            status: "error",
                            msg: "Error algo salio mal"
                        });
                    }
                    
                    if(get_user) {

                        const code =  speakeasy.totp({
                            secret: get_user.secret_key,
                            encoding: "base32",
                            step: 600, //10 min
                            window:0
                        });

                        sed_mail( get_user.email, code );

                        return res.status(200).send({
                            status: "success",
                            msg: 'Es un gusto tenerte de nuevo en Vaquita Web',
                            user: { 
                                id: get_user._id, 
                                email: get_user.email, 
                                given_name: get_user.given_name, 
                                family_name: get_user.family_name, 
                                role: get_user.role,
                                two_factors_activated: get_user.two_factors_activated,
                            },
                        });

                    } else {
                    
                        let user = new User();

                        user.email = email.toLowerCase();
                        user.given_name = given_name;
                        user.family_name = family_name;
                        user.role = 'ROLE_VIEWER';
                        user.secret_key = speakeasy.generateSecret({ length: 20 }).base32;
                        user.two_factors_activated = false;

                        user.save();

                        const code =  speakeasy.totp({
                            secret: user.secret_key,
                            encoding: "base32",
                            step: 600, //10 min
                            window:0
                        });

                        sed_mail( user.email, code );

                        res.status(200).json({
                            status: "success",
                            msg: 'Bienvenido a nuestra plataforma Vaquita Web',
                            user: { 
                                id: user._id, 
                                email: user.email, 
                                given_name: user.given_name, 
                                family_name: user.family_name, 
                                role: user.role,
                                two_factors_activated: user.two_factors_activated,
                            },
                        });
                    
                    }
                })
            
            } catch (error) {
                console.log(error)
                res.status(500).json({
                    status: "error",
                    msg: 'Por favor hable con el administrador',
                });
            }

        } else {
            return res.status(500).send({
                status: "error",
                msg: "Primero verifica tu correo",
            });
        }

    }).catch(() => {
        return res.status(400).json({
            status: 'error',
            msg: 'Error en la autenticacion con google',
        });
    });

}

const totp_generate = ( req, res = response ) => {

    const { id } = req.body;

    User.findOne ({ _id: id }, (err, get_user) => {
        
        if (err) {
            return res.status(500).send({
                status: "error",
                msg: "Error algo salio mal"
            });
        }
        
        if(get_user) {

            const code =  speakeasy.totp({
                secret: get_user.secret_key,
                encoding: "base32",
                step: 600, //10 min
                window:0
            });

            sed_mail( get_user.email, code );

            res.status(200).json({
                status: "success",
                msg: 'Revisa tu correo por favor',
            });

        } else {

            return res.status(400).json({
                status: 'error',
                msg: 'Por favor hable con el administrador',
            });

        }

    });

}

const totp_validate = ( req, res = response ) => {
    
    const { id, temp_token } = req.body;

    User.findOne ({ _id: id }, (err, get_user) => {
        
        if (err) {
            return res.status(500).send({
                status: "error",
                msg: "Error algo salio mal"
            });
        }
        
        if(get_user) {

            if(!speakeasy.totp.verify({
                secret: get_user.secret_key,
                encoding: "base32",
                token: temp_token,
                step: 600,
                window:0
            })) {

                return res.status(400).json({
                    status: "error",
                    msg: 'Codigo no valido',
                });
            }

                User.findOneAndUpdate({ _id: id }, { two_factors_activated: true }, { new: true }, (err, userUpdated) => {

                    if (err || !userUpdated) {

                        return res.status(500).send({
                            status: 'error',
                            msg: 'Por favor hable con el administrador',
                        });
                    }

                    const token = createToken( 
                        get_user._id, 
                        get_user.email, 
                        get_user.given_name, 
                        get_user.family_name, 
                        get_user.role,
                        get_user.two_factors_activated = true,
                    );
                
                    return res.status(200).json({
                        status: "success",
                        msg: 'Login correcto',
                        token: token,
                    });

                });
    
        } else {

            return res.status(400).json({
                status: 'error',
                msg: 'Por favor hable con el administrador',
            });

        }

    });

}

const logout = ( req, res = response ) => {

    const { uid } = req.user;

    User.findOneAndUpdate({ _id: uid }, { two_factors_activated: false }, (err, userUpdated) => {

        if (err || !userUpdated) {

            return res.status(500).send({
                status: 'error',
                msg: 'Por favor hable con el administrador',
            });
        }

        return res.status(200).json({
            status: "success",
            msg: 'Nos vemos pronto',
        });

    });

}

const sed_mail = ( email, code ) => {

    const message = {
        from: process.env.SEND_MAIL_ACCOUNT,
        to: email,
        subject: 'Se a iniciado sesion',
        html: `<h1>Tu codigo de seguridad es: ${ code }</h1><p> <b> expira en: 10 minutos!</b> </p>`
    };

    transport.sendMail(message, function(err, info) {
        
        if (err) {
          console.log(err);
        } else {
            console.log(info);
        }
    });

}

module.exports = {
    register_login_google,
    totp_generate,
    totp_validate,
    logout
}