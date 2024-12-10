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

    if (!this.#database[table]) {
      throw new Error(`Table "${table}" does not exist.`);
    }

    const index = this.#database[table].findIndex(ticket => ticket.id === id)

    if(index === -1){
      throw new Error(`ticket "${table}" does not exist.`);
    }

    const currentTask = this.#database[table][index];
    const updatedTask = {
      ...currentTask,
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.#database[table][index] = updatedTask;

    this.#persist()

    return updatedTask;
   }

   patch(table, id){

    if(!this.#database[table]){
      throw new Error(`Table "${table}" does not exist.`);
    }

    const findTask = this.#database[table].find(ticket => ticket.id === id)

    console.log(findTask)

    if(!findTask){
      throw new Error(`ticket "${table}" does not exist.`);
    }

    const updatedTask = {
      ...findTask,
      updatedAt: new Date().toISOString(),
      completed_at: new Date().toISOString(),
    };

    this.#persist();

    return updatedTask;
   }
}
