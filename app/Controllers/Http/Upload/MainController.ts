import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class MainController {
  public async show({ params, response }: HttpContextContract) {
    // if file does not exist, this method will automatically returns not found error
    return response.download(Application.tmpPath('uploads'), params.fileName)
  }
}
