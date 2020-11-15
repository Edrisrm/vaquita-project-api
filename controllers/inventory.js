'use strict'
const current_inventory = require('../models/inventory');
const { response } = require('express');

const save = ( req, res = response) => {
    const { breed, weight, age_in_months, division } = req.body;
    console.log(req.body);
    try {
        
                let inventario = new current_inventory();

                inventario.breed = breed;
                inventario.weight = weight;
                inventario.age_in_months = age_in_months;
                inventario.division = division;
                inventario.state = "En Finca";
                inventario.image = "Sin contenido";
                inventario.save();

                return res.status(200).json({
                    status: "success",
                    msg: "Agregado correctamente",
                    inventario: inventario,
                });            
      
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: "error",
            msg: 'Por favor hable con el administrador',
        });
    }

}

module.exports = {
    save,
}