import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { ReactionsType } from 'App/Utils'

export default class Reaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public postId: number

  @column()
  public type: ReactionsType
}
