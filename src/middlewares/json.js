export async function json(req, res){
  const buffers = []

  for await(chunk of req){
    buffers.push(chunk)
  }
    try{
      req.body = JSON.parse(Buffer.concat(buffers).toString())
    }catch{
      req.body = null
    }


res.setHeader("Content-type", "application/json")

}