import Route from '@ioc:Adonis/Core/Route'
import './auth'
import './user'
import './upload'
import './post'
import './comment'
import './reaction'

Route.get('/', async () => {
  return { hello: 'world' }
})
