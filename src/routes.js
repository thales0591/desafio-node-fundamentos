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
      const { title, description } = req.query

      const search = {
        title,
        description
      }

      const tasks = database.select('tasks', (search.title || search.description) ? search : null)
     
      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => 
    {
      if (req.body.title && req.body.description)
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

        return res.writeHead(201).end()
      }
      
      return res.writeHead(400).end("Propriedades incorretas, utilizar 'title' e 'description' como chaves.")        
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => 
    {
      const { id } = req.params
      if (req.body)
      {
        const { title, description } = req.body

        const idFound = database.update('tasks', id, 
        {
            title,
            description
        })

        if (!idFound)
        {
          return res.writeHead(400).end("ID não encontrado no banco de dados.") 
        }

        return res.writeHead(204).end()
      }

      return res.writeHead(400).end("Propriedades incorretas, utilizar 'title' e/ou 'description' como chaves.")
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => 
    {
      const { id } = req.params

      const idFound = database.delete('tasks', id)

      if (!idFound)
      {
        return res.writeHead(400).end("ID não encontrado no banco de dados.") 
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => 
    {
      const { id } = req.params

      const idFound = database.complete('tasks', id)

      if (!idFound)
      {
        return res.writeHead(400).end("ID não encontrado no banco de dados.") 
      }

      return res.writeHead(204).end()
    }
  }
]