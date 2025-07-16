const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const { OK } = require("./utils/response");
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocs = YAML.load('./swagger.yaml')

require('dotenv').config();

const PORT = process.env.PORT

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['https://faanglix.netlify.app/login'], // Ganti ini
    credentials: true,
}))

app.use(
    "/docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDocs)
)

// ✅ Koneksi ke MongoDB langsung di sini
mongoose.connect(process.env.MONGODB_URL, {
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routing
const routes = require("./routes/index.route");
app.use(routes);

// Health check
app.get("/", (req, res) => {
    OK(res, 201, {
        isRunning: true,
        serverVersion: "1.0.0"
    }, "success getting server main endpoint...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app