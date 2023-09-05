const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const knex = require("../../src/database/knex/index");
const sqliteConnection = require("../database/sqlite");
const { response } = require("express");

class userController {
  async create(request, response) {
    const { id, name, email, password } = request.body;
    const database = await sqliteConnection();
    if (!name) {
      throw new AppError("nome é obrigatório");
    }
    const hashedPassword = await hash(password, 8);
    const newUserWithEmail = await database.get(
      "SELECT * FROM user WHERE email =(?)",
      [email]
    );

    if (newUserWithEmail) {
      throw new AppError("Este e-mail já está em uso");
    }
    await database.run(
      "INSERT INTO user (name, email, passwor) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    response.json({ id, name, email, hashedPassword });
  }

  async update(request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM user WHERE id =(?)", [id]);

    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const userToUpdateEmail = await database.get(
      "SELECT * FROM user WHERE email =(?)",
      [email]
    );

    if (userToUpdateEmail && userToUpdateEmail.id !== user.id) {
      throw new AppError("Esse e-mail já está em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova"
      );
    }
    console.log(user.password);
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.passwor);

      if (!checkOldPassword) {
        throw new AppError("A senha antiga não confere");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `
        UPDATE user SET
        name = ?,
        email = ?,
        passwor = ?,
        updated_at = DATETIME('now')
        WHERE id = ?
      `,
      [user.name, user.email, user.password, id]
    );

    return response.json();
  }
}

module.exports = userController;
