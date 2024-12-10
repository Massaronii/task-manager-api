import fs from "node:fs/promises"

const databasePath = new URL("../db.json", import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, "utf-8")
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

   get(table, search){
    let data = this.#database[table]
    console.log(data)

    return data
   }

   insert(table, data){
    
    if(!this.#database[table]){
      this.#database[table] = [data] 
      this.#persist()
      return data
    }

    this.#database[table].push(data)
    this.#persist()

    return 
   }

   update(table, id, data){

    const index = this.#database[table].findIndex(ticket => ticket.id === id)

    if(index === -1){
      return null
    }

    const updatedTask = {
      id,
      title: data?.title ? data?.title : this.#database[table][index].title,
      description: data?.description ? data?.description : this.#database[table][index].description,
      createdAt:this.#database[table][index].createdAt,
      completed_at: this.#database[table][index].completed_at,
      updatedAt: new Date().toISOString()
    }

    const task = this.#database[table][index] = {...updatedTask}

    return task
   }
}
