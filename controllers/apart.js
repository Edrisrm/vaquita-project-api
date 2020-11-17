const Apart = require("../models/apart");
const {response} = require("express");
const { ObjectId } = require("mongodb");

const save = async (req, res = response) => {
    const {square_meter,apart_number} = req.body;
    try {
        let apart = new Apart();
        console.log("consola del apartado "+apart);
        apart.square_meter = square_meter;
        apart.apart_number = apart_number;
        await apart.save();
    
        await Apart.findById(ObjectId(apart._id))
         .then((get_apart) => {
             console.log(get_apart);
             return res.status(200).json({
                 status: "success",
                 msg: "Agregado correctamente",
                 apart: get_apart,
             });
         })
         .catch((err) => {
             console.log(err);
             return res.status(500).send({
                 msg: "Por favor hable con el administrador",
             });
         });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            msg: "Por favor hable con el administrador",
        });
    }
};

const getAparts = (req, res = response) => {
    
    Apart.find().exec((err, aparts) => {
        if (err || !aparts) {
            return res.status(404).send({
                status: "error",
                msg: "No hay apartados actualmente"
            });
        }

        return res.status(200).json({
            status: "success",
            aparts: aparts
        });
    });
};
const deleteOneApart = (req, res = response) => {
    let apartId = req.body._id;
    console.log(apartId)
    Apart.findOneAndDelete({_id: apartId}, (err, apart) =>{
        if (err) {
            return res.status(500).send({
                status: "error",
                msg: "Error al solicitar la peticion"
            });
        }
        if (!apart) {
                return res.status(404).send({
                    status: "error",
                    msg: "No se ha borrado el aparto",
                });
        }
        return res.status(200).json({
            status: "success",
            msg: "Borrado de forma exitosa",
            apart: apart
        });
    })
}

module.exports = {
    save,
    getAparts,
    deleteOneApart,
};