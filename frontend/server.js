const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Sirve el index.html

// Conexión a PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'db', // Nombre del servicio en docker-compose
  database: 'cruzazul',
  password: 'postgres',
  port: 5432,
});

// Endpoint REST: Obtener productos (GET)
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint REST: Ingresar producto (POST)
app.post('/api/productos', async (req, res) => {
  const { nombre, precio, stock } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING *',
      [nombre, precio, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js corriendo en el puerto ${PORT}`);
});