import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { string } from '@ioc:Adonis/Core/Helpers'

/**
 * Globally changes the body properties to be camel case instead of snake case
 */

BaseModel.namingStrategy.serializedName = (model, key) => {
  return string.camelCase(key)
}
