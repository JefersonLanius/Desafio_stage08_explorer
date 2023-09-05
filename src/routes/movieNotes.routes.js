const { Router } = require("express");
const NotesController = require("../controller/notesController");

const movieNotesRoutes = Router();

const notesController = new NotesController();


movieNotesRoutes.post("/:user_id", notesController.create);
movieNotesRoutes.delete("/:id", notesController.delete);
movieNotesRoutes.put("/:id", notesController.update);


module.exports = movieNotesRoutes;