import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const {search} = req.query

      let tasks = database.get("tickets", search ? {
        description: search,
        title: search
      } : null)

      if (!tasks) {
        return res.end(JSON.stringify("Não há tarefas"))
      }

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const data = req.body

      const ticket = {
        id: randomUUID(),
        title: data.title,
        description: data.description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed_at: null
      }

      const newTickets = database.insert("tickets", ticket)

      return res.end(JSON.stringify(newTickets))
    }
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const data = req.body

      const updatedTicket = database.update("tickets", id, data)

      if (!updatedTicket) {
        return res.writeHead(404).end(JSON.stringify({
          message: "Task not found",
        }));
      }

      return res.writeHead(204).end()
    }
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params

      const patchTask = database.patch("tickets", id)

      return res.writeHead(200).end(JSON.stringify(patchTask));
    }
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {

      const { id } = req.params

      const deletedTask = database.delete("tickets", id)

      return res.writeHead(204).end()
    }
  }
]