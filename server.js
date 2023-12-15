const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors")
const morgan = require("morgan");
const { sequelize } = require("./models");
const route = require('./routers/index')

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

app.use(morgan('tiny'))
app.use("/api", route)

const PORT = process.env.PORT || 8080;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`)
    await sequelize.authenticate()
    console.log('Database connected!!')
});