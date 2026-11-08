const express = require("express");

const app = express();

const PORT = 3000;

app.get("/", function(req, res){
    return res.json({mensaje: "Bienvenido a mi Proyecto backend API"});
});

app.listen(PORT, function(){
    console.log(`Servidor iniciado en: http://127.0.0.1:${PORT}`);
});