import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  HasMany,
  hasMany,
  hasOne,
  HasOne,
} from '@ioc:Adonis/Lucid/Orm'
import { UserKey, File } from 'App/Models'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string

  @hasMany(() => UserKey)
  public userKeys: HasMany<typeof UserKey>

  // try to find a match where users.id === files.ownerId && files.fileCategory === 'avatar'
  // since ownerId can be treated as a post id as well
  @hasOne(() => File, {
    foreignKey: 'ownerId',
    onQuery: (query) => query.where({ fileCategory: 'avatar' }),
  })
  public avatar: HasOne<typeof File>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
