import { Hono } from 'hono'
import { TodoController } from '../controllers/todo.controller'

const todoRouter = new Hono()
const todoController = new TodoController()


todoRouter.get('/', todoController.getTodos)

todoRouter.get('/:id', todoController.getTodoById)

todoRouter.post('/', todoController.createTodo)


todoRouter.put('/:id', todoController.updateTodo)

todoRouter.delete('/:id', todoController.deleteTodo)

export { todoRouter }
