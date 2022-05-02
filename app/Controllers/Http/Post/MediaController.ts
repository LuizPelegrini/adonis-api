import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Media'
import Database from '@ioc:Adonis/Lucid/Database'
import { Post } from 'App/Models'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { FileCategory } from 'App/Utils'

export default class MediaController {
  public async store({ request, response, params, auth }: HttpContextContract) {
    const { file } = await request.validate(StoreValidator)

    const media = await Database.transaction(async (trx) => {
      const post = await Post.findOrFail(params.id)

      if (post.userId !== auth.user!.id) {
        return response.unauthorized()
      }

      post.useTransaction(trx)

      // create media in DB that references the post
      const media = await post.related('media').create({
        fileCategory: 'post',
        fileName: `${cuid()}.${file.extname}`,
      })

      // save file on storage
      await file.move(Application.tmpPath('uploads'), {
        name: media.fileName,
      })

      return media
    })

    return media
  }

  public async update({ request, params, auth, response }: HttpContextContract) {
    const { file } = await request.validate(UpdateValidator)

    const media = await Database.transaction(async (trx) => {
      const post = await Post.findOrFail(params.id)

      if (post.userId !== auth.user!.id) {
        return response.unauthorized()
      }

      post.useTransaction(trx)

      const searchPayload = {}
      const savePayload = {
        fileCategory: 'post' as FileCategory,
        fileName: `${cuid()}.${file.extname}`,
      }

      const media = await post.related('media').firstOrCreate(searchPayload, savePayload)

      await file.move(Application.tmpPath('uploads'), {
        name: media.fileName,
        overwrite: true,
      })

      return media
    })

    return media
  }

  public async destroy({}: HttpContextContract) {}
}
