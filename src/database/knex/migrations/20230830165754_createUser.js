exports.up = knex =>knex.schema.createTable("user", table =>{
    table.increments("id");
    table.text("name");
    table.text("email");
    table.text("passwor");
    table.specificType("avatar", 'NULL');

    table.timestamp("creat_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

});

exports.down = knex =>knex.schema.dropTable("user");
