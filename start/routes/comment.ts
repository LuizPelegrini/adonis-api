import Route from '@ioc:Adonis/Core/Route'

Route.post('/comments', 'Comment/Main.store').middleware('auth')
Route.put('/comments/:id', 'Comment/Main.update').middleware('auth')
Route.delete('/comments/:id', 'Comment/Main.destroy').middleware('auth')
