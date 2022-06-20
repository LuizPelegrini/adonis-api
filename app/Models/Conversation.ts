import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Message, User } from 'App/Models'

export default class Conversation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public userIdOne: number

  @column({ serializeAs: null })
  public userIdTwo: number

  @belongsTo(() => User, { foreignKey: 'userIdOne' })
  public userOne: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'userIdTwo' })
  public userTwo: BelongsTo<typeof User>

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>
}
