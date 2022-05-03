import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Post, Reaction } from 'App/Models'
import { UpdateValidator } from 'App/Validators/Reaction/Main'

export default class ReactionController {
  public async update({ request, auth }: HttpContextContract) {
    const { type, postId } = await request.validate(UpdateValidator)

    const post = await Post.findOrFail(postId)

    // if postId and userId already exists in the reactions table, simply update
    // otherwise, create a new row
    const reaction = await post
      .related('reactions')
      .updateOrCreate({ postId, userId: auth.user!.id }, { type })

    return reaction
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const reaction = await Reaction.findOrFail(params.id)

    if (reaction.userId !== auth.user!.id) {
      return response.unauthorized()
    }

    await reaction.delete()
  }
}
