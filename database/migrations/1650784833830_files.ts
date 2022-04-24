import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { fileCategories } from 'App/Utils'

export default class Files extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('owner_id').unsigned() // represents an id of an unknown table (might be Post, User, etc.)
      table.string('file_name').notNullable()
      table.enu('file_category', fileCategories)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
