import Route from '@ioc:Adonis/Core/Route'

Route.resource('/posts', 'Post/Main')
  .apiOnly() // all routes from a REST api
  .except(['show']) // except show()
  .middleware({
    index: ['auth'],
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  })

Route.post('/posts/:id/media', 'Post/MediaController.store').middleware('auth')
Route.put('/posts/:id/media', 'Post/MediaController.update').middleware('auth')
