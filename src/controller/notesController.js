const { request } = require("http");
const knex = require("../../src/database/knex/index");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");
const { response } = require("express");

class MovieNotesController {
  async create(request, response) {
    const { title, description, note, tags } = request.body;
    const { user_id } = request.params;
    const database = await sqliteConnection();

    let checkNote = note;

    if (checkNote >5 || checkNote<1) {
        console.log("entrou no erro");
        throw new AppError ("Nota informada é inválida");
      }

    const [note_id] = await knex("notes").insert({
      title,
      description,
      note,
      user_id,
    });

    const tagsInsert = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knex("tags").insert(tagsInsert);

    return response.json();
  }
  async delete(request, response){
    const{id} = request.params;

    await knex("notes").where({id}).delete();

    return response.json();
  }
  async update(request,response){
    const {title, description, note, tags} = request.body;
    const {id} = request.params;

    const database = await sqliteConnection();
    const movieNote = await database.get("SELECT * FROM notes WHERE id =(?)", [id]);

    if(!movieNote){
        throw new AppError("Avaliação de filme não encontrada");
    }
    movieNote.title = title;
    movieNote.description = description;
    movieNote.note = note;
    await database.run(
        `UPDATE notes SET
        title = ?,
        description = ?,
        note = ?,
        user_id = ?,
        updated_at = DATETIME('now')
        WHERE id = ?
        `,
        [movieNote.title, movieNote.description, movieNote.note, movieNote.user_id, id]
    );
    return response.json();
  }
}

module.exports = MovieNotesController;
