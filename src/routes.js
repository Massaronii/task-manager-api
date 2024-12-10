import { randomUUID } from "crypto"
import { Database } from "./database"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      const {search} = req.query
    
      const tickets = this.database.get("tickets", search ? {
        name: search,
        id: search
      } : null)

      return res.end(JSON.stringify(tickets))
    }
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const data = req.body

      const ticket = {
        id: randomUUID(),
        name: data.name
      }

      const newTickets = this.database.insert("tickets", data)

      return res.end(JSON.stringify(newTickets))
    }
  }
]