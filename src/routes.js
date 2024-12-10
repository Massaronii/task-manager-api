import { randomUUID } from "node:crypto"
import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      // const {search} = req.query
    
      let tasks =  database.get("tickets", null)

      // const tickets = this.database.get("tickets", search ? {
      //   name: search,
      //   id: search
      // } : null)
      if(!tasks){
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
      const {id} = req.params
      const data = req.body

      const updatedTicket = database.update("tickets", id, data)

      return res.end(JSON.stringify(updatedTicket))
    }
  }
]