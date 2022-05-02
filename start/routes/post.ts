import Route from '@ioc:Adonis/Core/Route'

Route.resource('/posts', 'Posts/Main')
  .apiOnly() // all routes from a REST api
  .except(['show']) // except show()
  .middleware({
    store: ['auth'],
    update: ['auth'],
    destroy: ['auth'],
  })
