// Controlador del CRUD de publicaciones.
// Por el momento los datos se guardan en memoria (sin base de datos).

const { existeCategoria } = require("./categoria.controller");

const ESTADOS = ["activa", "pausada", "vendida"];

let publicaciones = [];
let ultimoId = 0;

const generarId = () => {
    ultimoId += 1;
    return ultimoId;
};

const parseId = (valor) => {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const buscarPublicacion = (id) => publicaciones.find((publicacion) => publicacion.id === id);

const validar = (datos, parcial = false) => {
    const errores = [];
    const { titulo, descripcion, precio, categoriaId, estado } = datos || {};

    if (!parcial || titulo !== undefined) {
        if (typeof titulo !== "string" || titulo.trim().length < 5) {
            errores.push("El campo 'titulo' es obligatorio y debe tener al menos 5 caracteres.");
        }
    }

    if (descripcion !== undefined && typeof descripcion !== "string") {
        errores.push("El campo 'descripcion' debe ser un texto.");
    }

    if (!parcial || precio !== undefined) {
        const valor = Number(precio);
        const invalido =
            precio === undefined ||
            precio === null ||
            precio === "" ||
            Number.isNaN(valor) ||
            valor < 0;

        if (invalido) {
            errores.push("El campo 'precio' es obligatorio y debe ser un numero mayor o igual a 0.");
        }
    }

    if (!parcial || categoriaId !== undefined) {
        const valor = Number(categoriaId);
        const invalido =
            categoriaId === undefined ||
            categoriaId === null ||
            categoriaId === "" ||
            !Number.isInteger(valor) ||
            valor <= 0;

        if (invalido) {
            errores.push("El campo 'categoriaId' es obligatorio y debe ser un entero positivo.");
        } else if (!existeCategoria(valor)) {
            errores.push(`No existe la categoria con id ${valor}.`);
        }
    }

    if (estado !== undefined && !ESTADOS.includes(estado)) {
        errores.push(`El campo 'estado' debe ser uno de: ${ESTADOS.join(", ")}.`);
    }

    return errores;
};

// GET /publicaciones?categoriaId=1&estado=activa&q=auto
const listar = (req, res) => {
    const { categoriaId, estado, q } = req.query;
    let resultado = [...publicaciones];

    if (categoriaId !== undefined) {
        const id = parseId(categoriaId);

        if (id === null) {
            return res.status(400).json({ mensaje: "El filtro 'categoriaId' debe ser un entero positivo." });
        }

        resultado = resultado.filter((publicacion) => publicacion.categoriaId === id);
    }

    if (estado !== undefined) {
        if (!ESTADOS.includes(estado)) {
            return res.status(400).json({ mensaje: `El filtro 'estado' debe ser uno de: ${ESTADOS.join(", ")}.` });
        }

        resultado = resultado.filter((publicacion) => publicacion.estado === estado);
    }

    if (q !== undefined) {
        const texto = String(q).toLowerCase();
        resultado = resultado.filter((publicacion) => publicacion.titulo.toLowerCase().includes(texto));
    }

    return res.status(200).json({
        total: resultado.length,
        publicaciones: resultado,
    });
};

// GET /publicaciones/:id
const obtener = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const publicacion = buscarPublicacion(id);

    if (!publicacion) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}.` });
    }

    return res.status(200).json(publicacion);
};

// POST /publicaciones
const crear = (req, res) => {
    const datos = req.body || {};
    const errores = validar(datos);

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Datos invalidos.", errores });
    }

    const ahora = new Date().toISOString();

    const publicacion = {
        id: generarId(),
        titulo: datos.titulo.trim(),
        descripcion: typeof datos.descripcion === "string" ? datos.descripcion.trim() : "",
        precio: Number(datos.precio),
        categoriaId: Number(datos.categoriaId),
        estado: datos.estado || "activa",
        createdAt: ahora,
        updatedAt: ahora,
    };

    publicaciones.push(publicacion);

    return res.status(201).json(publicacion);
};

// PUT /publicaciones/:id
const actualizar = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const publicacion = buscarPublicacion(id);

    if (!publicacion) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}.` });
    }

    const datos = req.body || {};
    const errores = validar(datos, true);

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Datos invalidos.", errores });
    }

    if (datos.titulo !== undefined) {
        publicacion.titulo = datos.titulo.trim();
    }

    if (datos.descripcion !== undefined) {
        publicacion.descripcion = datos.descripcion.trim();
    }

    if (datos.precio !== undefined) {
        publicacion.precio = Number(datos.precio);
    }

    if (datos.categoriaId !== undefined) {
        publicacion.categoriaId = Number(datos.categoriaId);
    }

    if (datos.estado !== undefined) {
        publicacion.estado = datos.estado;
    }

    publicacion.updatedAt = new Date().toISOString();

    return res.status(200).json(publicacion);
};

// DELETE /publicaciones/:id
const eliminar = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const publicacion = buscarPublicacion(id);

    if (!publicacion) {
        return res.status(404).json({ mensaje: `No existe la publicacion con id ${id}.` });
    }

    publicaciones = publicaciones.filter((item) => item.id !== id);

    return res.status(200).json({ mensaje: `Publicacion con id ${id} eliminada.` });
};

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
};
