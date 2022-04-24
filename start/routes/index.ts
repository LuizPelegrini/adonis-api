import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './user'
import './upload'

Route.get('/', async () => {
  return { hello: 'world' }
})
