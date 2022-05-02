import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { User, File } from 'App/Models'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column({ serializeAs: null })
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where('fileCategory', 'post'),
  })
  public media: HasOne<typeof File>

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value.toFormat('yyyy-MM-dd HH:mm:ss'),
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value.toFormat('yyyy-MM-dd HH:mm:ss'),
  })
  public updatedAt: DateTime
}
