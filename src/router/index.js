const express = require("express");

const Route = express.Router();

const categoriaController = require("../controllers/categoria.controller");
const publicacionController = require("../controllers/publicacion.controller");

// CRUD API categoria sin BD
Route.get("/categorias", categoriaController.listar);
Route.get("/categorias/:id", categoriaController.obtener);
Route.post("/categorias", categoriaController.crear);
Route.put("/categorias/:id", categoriaController.actualizar);
Route.delete("/categorias/:id", categoriaController.eliminar);

// CRUD API publicacion sin BD
Route.get("/publicaciones", publicacionController.listar);
Route.get("/publicaciones/:id", publicacionController.obtener);
Route.post("/publicaciones", publicacionController.crear);
Route.put("/publicaciones/:id", publicacionController.actualizar);
Route.delete("/publicaciones/:id", publicacionController.eliminar);

module.exports = Route;
