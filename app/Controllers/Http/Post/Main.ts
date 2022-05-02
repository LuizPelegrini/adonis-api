import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { User, Post } from 'App/Models'
import { StoreValidator, UpdateValidator } from 'App/Validators/Post/Main'
import Database from '@ioc:Adonis/Lucid/Database'
import { unlink } from 'fs/promises'
import Application from '@ioc:Adonis/Core/Application'

export default class PostsController {
  /*
    /posts?username=john%20doe >> returns posts from John Doe
    /posts >> returs posts from the logged in user
  */
  public async index({ request, auth }: HttpContextContract) {
    const { username } = request.qs()

    let user = auth.user!
    if (username) {
      user = (await User.findBy('username', username)) || auth.user!
    }

    // load the user posts
    await user.load('posts', (query) => {
      query.orderBy('created_at', 'desc')
      query.preload('user', (query) => {
        query.select(['id', 'name', 'username']) // preload info of the user who created the post
        query.preload('avatar') // ...and its avatar
      })
    })

    return user.posts
  }

  public async store({ request, auth }: HttpContextContract) {
    const data = await request.validate(StoreValidator)
    const post = await auth.user!.related('posts').create(data)

    return post
  }

  public async update({ request, response, params, auth }: HttpContextContract) {
    const data = await request.validate(UpdateValidator)
    const post = await Post.findOrFail(params.id)

    // only user who created the post is allowed to update it
    if (auth.user!.id !== post.userId) {
      return response.unauthorized()
    }

    post.merge(data)
    await post.save()

    return post
  }

  public async destroy({ response, params, auth }: HttpContextContract) {
    const post = await Post.findOrFail(params.id)

    // only user who created the post is allowed to delete it
    if (post.userId !== auth.user!.id) {
      return response.unauthorized()
    }

    // Transaction needed (Delete post + Delete file from storage + Delete row from File table)
    await Database.transaction(async (trx) => {
      post.useTransaction(trx)

      await post.load('media')
      if (post.media) {
        post.media.useTransaction(trx)
        await unlink(Application.tmpPath('uploads', post.media.fileName)) // delete file from storage
        await post.media.delete() // delete row in File table
      }

      // finally, delete the post
      await post.delete()
    })
  }
}
