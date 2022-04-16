import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './user'

Route.get('/', async () => {
  return { hello: 'world' }
})
