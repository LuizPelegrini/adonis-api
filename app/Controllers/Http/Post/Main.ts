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
      query.preload('media')

      query.withCount('comments')

      query.preload('comments', (query) => {
        query.select(['id', 'userId', 'content', 'createdAt'])
        query.preload('user', (query) => {
          query.select(['id', 'name', 'username'])
          query.preload('avatar')
        })
      })

      query.preload('user', (query) => {
        query.select(['id', 'name', 'username']) // preload info of the user who created the post
        query.preload('avatar') // ...and its avatar
      })

      // this will be available in the property $extras of the Post model. It can be used in a computed property
      // count like reactions
      query.withCount('reactions', (query) => {
        query.where({ type: 'like' }).as('likeCount')
      })

      // count love reactions
      query.withCount('reactions', (query) => {
        query.where({ type: 'love' }).as('loveCount')
      })

      // count laugh reactions
      query.withCount('reactions', (query) => {
        query.where({ type: 'laugh' }).as('laughCount')
      })

      // count sad reactions
      query.withCount('reactions', (query) => {
        query.where({ type: 'sad' }).as('sadCount')
      })

      // count angry reactions
      query.withCount('reactions', (query) => {
        query.where({ type: 'angry' }).as('angryCount')
      })

      // attempts to get the post reaction where it's from the authenticated user
      // return an object of reaction that is passed to the reactions property of the Post model instance
      // it can be accessed via this.reactions in a computed property
      query.preload('reactions', (query) => {
        query.where({ userId: auth.user!.id }).first()
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

    // Transaction needed (Delete post + Delete row from File table + Delete file from storage)
    await Database.transaction(async (trx) => {
      post.useTransaction(trx)

      await post.load('media')
      let postMediaName: string | null = null
      if (post.media) {
        post.media.useTransaction(trx)
        postMediaName = post.media.fileName
        await post.media.delete() // delete row in File table
      }

      // delete the post
      await post.delete()

      // if there's a media to delete...
      if (postMediaName) {
        await unlink(Application.tmpPath('uploads', postMediaName))
      }
    })
  }
}
