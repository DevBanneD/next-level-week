const express = require("express")
const app = express()

// Database
const db = require("./database/db.js")

// Configurar página pública
app.use(express.static("public"))

// Habilitar uso de req.body
app.use(express.urlencoded({ extended: true }))

// Template Engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: app,
    noCache: true
})

// Página inicial
app.get("/", (req, res) => {
    return res.render("index.html", { title: "Carai cuzao" })
})

app.get("/create-point", (req, res) => {

    console.log(req.query)

    return res.render("create-point.html")
})

app.post("/savepoint", (req, res) => {
    // console.log(req.body)

    // Inserir dados no banco de dados
    const query = `
        INSERT INTO places (
            name,
            image,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?, ?, ?, ?, ?, ?, ?);
    `
    
    const values = [
        req.body.name,
        req.body.image,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if(err) {
            return console.log(err)
        }

        console.log("Cadastrado com sucesso!")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

    db.run(query, values, afterInsertData)
})

app.get("/search", (req, res) => {
    const search = req.query.search

    if(search == "") {
        return res.render("search-results.html", {total: 0})
    }

    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length

        return res.render("search-results.html", {places: rows, total})
    })
})

// Start servers
app.listen(3000)