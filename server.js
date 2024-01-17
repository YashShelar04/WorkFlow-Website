const express = require('express')
const path = require('path')
const app = express()

app.use('/static',express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'index.html'))
})


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})