import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { StoreValidator } from 'App/Validators/Comment/Main'
import { Comment } from 'App/Models'

export default class CommentController {
  public async store({ request, auth }: HttpContextContract) {
    const { content, postId } = await request.validate(StoreValidator)

    const comment = await Comment.create({
      content,
      postId,
      userId: auth.user!.id,
    })

    return comment
  }

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
