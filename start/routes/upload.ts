import Route from '@ioc:Adonis/Core/Route'

Route.get('/uploads/:fileName', 'Upload/MainController.show')
