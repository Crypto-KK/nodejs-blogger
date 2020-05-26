const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('./public'))

// 路由


//listen
app.listen(8000, (req, res) => {
    console.log("running at http://127.0.0.1:8000")
})