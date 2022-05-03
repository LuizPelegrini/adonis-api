import Route from '@ioc:Adonis/Core/Route'

Route.post('/comments', 'Comment/Main.store').middleware('auth')
