import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => 
      {
        const { search } = req.query

        const tasks = database.select('tasks', search ? {
          title: search,
          description: search,
        } : null)

        return res.end(JSON.stringify(tasks))
      }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => 
      {
        const { title, description } = req.body

        const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Intl.DateTimeFormat("pt-BR").format(new Date()),
            updated_at: null
        }

        database.insert('tasks', task)

       // console.log(req.params)
        

        return res.writeHead(201).end()
      }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      if (req.body)
      {
        const { title, description } = req.body
        database.update('tasks', id, 
          {
              title,
              description
          })

          return res.writeHead(204).end()
      }

      return res.writeHead(404).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      database.complete('tasks', id)

      return res.writeHead(204).end()
    }
  }
]