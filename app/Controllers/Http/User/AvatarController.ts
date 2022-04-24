import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UpdateValidator } from 'App/Validators/User/Avatar'
import { FileCategory } from 'App/Utils'
import { faker } from '@faker-js/faker'
import Application from '@ioc:Adonis/Core/Application'
import Database from '@ioc:Adonis/Lucid/Database'
import fs from 'fs'
import { promisify } from 'util'

export default class AvatarController {
  public async update({ request, auth }: HttpContextContract) {
    const { file } = await request.validate(UpdateValidator)
    const user = auth.user!

    // transaction needed (saving file path in DB + storing file physically)
    const response = await Database.transaction(async (trx) => {
      user.useTransaction(trx) // if file saving fails, then operations on the user must be rolled back

      // const searchPayload = { ownerId: user.id } // <<< not needed as we're querying on the relation user.related('avatar'), so Adonis knows that the ownerId should be compared against the user.id
      const searchPayload = {}
      const savePayload = {
        fileCategory: 'avatar' as FileCategory,
        fileName: `${new Date().getTime()}_${faker.datatype.uuid()}.${file.extname}`,
      }

      // search for the user avatar or create a new one if it doesn't exist
      const avatar = await user.related('avatar').firstOrCreate(searchPayload, savePayload)

      // save file to temp folder 'uploads', overwrite it in case the avatar image was found
      await file.move(Application.tmpPath('uploads'), {
        name: avatar.fileName,
        overwrite: true,
      })

      return avatar
    })

    return response
  }

  public async destroy({ auth }: HttpContextContract) {
    const user = auth.user!
    const avatar = await user
      .related('avatar')
      .query()
      .where({
        fileCategory: 'avatar',
      })
      .firstOrFail()

    // transaction needed (delete row in DB + delete file from storage)
    await Database.transaction(async (trx) => {
      avatar.useTransaction(trx)

      await avatar.delete()

      const unlink = promisify(fs.unlink)
      await unlink(Application.tmpPath('uploads', avatar.fileName))
    })
  }
}
