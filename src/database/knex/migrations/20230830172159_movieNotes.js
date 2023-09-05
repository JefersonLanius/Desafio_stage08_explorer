exports.up = knex =>knex.schema.createTable("notes", table =>{
    table.increments("id");
    table.text("title");
    table.text("description");
    table.integer("note");
    table.integer("user_id").references("id").inTable("user");

    table.timestamp("creat_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());

});

exports.down = knex =>knex.schema.dropTable("notes");
