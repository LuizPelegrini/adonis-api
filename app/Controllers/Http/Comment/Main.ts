import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator, UpdateValidator } from 'App/Validators/Comment/Main'
import { Comment } from 'App/Models'

export default class CommentController {
  public async store({ request, auth }: HttpContextContract) {
    const { content, postId } = await request.validate(StoreValidator)
    const comment = await auth.user!.related('comments').create({
      content,
      postId,
    })

    return comment
  }

  public async update({ request, auth, params, response }: HttpContextContract) {
    const { content } = await request.validate(UpdateValidator)
    const comment = await Comment.findOrFail(params.id)

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }

    comment.merge({ content })
    await comment.save()
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const comment = await Comment.findOrFail(params.id)

    if (auth.user!.id !== comment.userId) {
      return response.unauthorized()
    }

    await comment.delete()
  }
}
