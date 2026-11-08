// Controlador del CRUD de categorias.
// Por el momento los datos se guardan en memoria (sin base de datos).

let categorias = [];
let ultimoId = 0;

const generarId = () => {
    ultimoId += 1;
    return ultimoId;
};

const parseId = (valor) => {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
};

const buscarCategoria = (id) => categorias.find((categoria) => categoria.id === id);

// Se exporta para que el controlador de publicaciones valide la categoria.
const existeCategoria = (id) => Boolean(buscarCategoria(id));

const validar = (datos, parcial = false) => {
    const errores = [];
    const { nombre, descripcion } = datos || {};

    if (!parcial || nombre !== undefined) {
        if (typeof nombre !== "string" || nombre.trim().length < 3) {
            errores.push("El campo 'nombre' es obligatorio y debe tener al menos 3 caracteres.");
        }
    }

    if (descripcion !== undefined && typeof descripcion !== "string") {
        errores.push("El campo 'descripcion' debe ser un texto.");
    }

    return errores;
};

// GET /categorias
const listar = (req, res) => {
    return res.status(200).json({
        total: categorias.length,
        categorias: categorias,
    });
};

// GET /categorias/:id
const obtener = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const categoria = buscarCategoria(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}.` });
    }

    return res.status(200).json(categoria);
};

// POST /categorias
const crear = (req, res) => {
    const datos = req.body || {};
    const errores = validar(datos);

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Datos invalidos.", errores });
    }

    const nombre = datos.nombre.trim();
    const duplicada = categorias.some(
        (categoria) => categoria.nombre.toLowerCase() === nombre.toLowerCase()
    );

    if (duplicada) {
        return res.status(409).json({ mensaje: `Ya existe una categoria con el nombre '${nombre}'.` });
    }

    const ahora = new Date().toISOString();

    const categoria = {
        id: generarId(),
        nombre,
        descripcion: typeof datos.descripcion === "string" ? datos.descripcion.trim() : "",
        createdAt: ahora,
        updatedAt: ahora,
    };

    categorias.push(categoria);

    return res.status(201).json(categoria);
};

// PUT /categorias/:id
const actualizar = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const categoria = buscarCategoria(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}.` });
    }

    const datos = req.body || {};
    const errores = validar(datos, true);

    if (errores.length > 0) {
        return res.status(400).json({ mensaje: "Datos invalidos.", errores });
    }

    if (datos.nombre !== undefined) {
        const nombre = datos.nombre.trim();
        const duplicada = categorias.some(
            (otra) => otra.id !== id && otra.nombre.toLowerCase() === nombre.toLowerCase()
        );

        if (duplicada) {
            return res.status(409).json({ mensaje: `Ya existe una categoria con el nombre '${nombre}'.` });
        }

        categoria.nombre = nombre;
    }

    if (datos.descripcion !== undefined) {
        categoria.descripcion = datos.descripcion.trim();
    }

    categoria.updatedAt = new Date().toISOString();

    return res.status(200).json(categoria);
};

// DELETE /categorias/:id
const eliminar = (req, res) => {
    const id = parseId(req.params.id);

    if (id === null) {
        return res.status(400).json({ mensaje: "El id debe ser un numero entero positivo." });
    }

    const categoria = buscarCategoria(id);

    if (!categoria) {
        return res.status(404).json({ mensaje: `No existe la categoria con id ${id}.` });
    }

    categorias = categorias.filter((item) => item.id !== id);

    return res.status(200).json({ mensaje: `Categoria con id ${id} eliminada.` });
};

module.exports = {
    listar,
    obtener,
    crear,
    actualizar,
    eliminar,
    existeCategoria,
};
