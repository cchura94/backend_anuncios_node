const express = require("express");

const Route = require("./router");

const app = express();

const PORT = process.env.PORT || 3000;

// Permite leer JSON en el cuerpo de las peticiones (req.body).
app.use(express.json());

app.get("/", function(req, res){
    return res.json({mensaje: "Bienvenido a mi Proyecto backend API"});
});

app.use("/api", Route);

// Ruta no encontrada.
app.use(function(req, res){
    return res.status(404).json({mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}`});
});

// Manejador de errores (JSON mal formado, errores inesperados, etc.).
app.use(function(err, req, res, next){
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({mensaje: "El cuerpo de la peticion no es un JSON valido."});
    }

    console.error(err);

    return res.status(500).json({mensaje: "Error interno del servidor."});
});

app.listen(PORT, function(){
    console.log(`Servidor iniciado en: http://127.0.0.1:${PORT}`);
});
