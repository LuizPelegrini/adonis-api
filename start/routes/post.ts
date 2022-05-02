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
