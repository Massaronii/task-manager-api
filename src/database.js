import fs from "node:fs/promises"

const databasePath = new URL("../db;.json", import.meta.url)

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
    let data = this.#database[table] ?? []

    if(search){
      const getData = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    return data
  }

  insert(table , data){

    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    }else {
      this.#database[table] = data
    }

    this.#persist()

    return data
  }

  delete(table, id){
    const searchItem = this.#database[table].filterIndex(item => id ===item.id)

    if(searchItem > -1){
      searchItem.slice(searchItem, 1)
      this.#persist()
      return true
    }
    return false
  }

  update(table, id, data){
    const searchItem = this.#database[table].filterIndex(item => item.id === id)

    if(searchItem > -1){
      this.#database[table][searchItem] = {id, ...data}
      this.#persist()
      return true
    }

    return false
  }
}
