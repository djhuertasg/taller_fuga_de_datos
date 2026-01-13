// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

// Middleware
app.use(bodyParser.json());

// Conexión a MongoDB (Simulada para el taller o conectar a instancia real)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taller_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', { 
    username: String, 
    password: String, 
    role: { type: String, default: 'patient' } 
});

// VULNERABILIDAD 1: Prototype Pollution
// Función 'merge' insegura común en librerías legacy o helpers propios
const merge = (target, source) => {
    for (let key in source) {
        if (source[key] && typeof source[key] === 'object') {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
};

// Endpoint vulnerable a Prototype Pollution
// Un atacante envía: {"__proto__": {"isAdmin": true}}
app.put('/api/user/settings', (req, res) => {
    let userSettings = { theme: 'light', notifications: true };
    
    // El merge recursivo contamina el Object.prototype
    merge(userSettings, req.body);
    
    res.json({ message: "Configuración actualizada", settings: userSettings });
});

// Endpoint de verificación de privilegios (Gadget)
app.get('/api/admin', (req, res) => {
    // Si el prototipo fue contaminado, req.user (o un objeto vacío) tendrá isAdmin: true
    const currentUser = req.user |

| {}; 
    if (currentUser.isAdmin) {
        res.json({ message: "ACCESO CONCEDIDO: Datos sensibles..." });
    } else {
        res.status(403).json({ message: "Acceso Denegado" });
    }
});

// VULNERABILIDAD 2: Inyección NoSQL
// Endpoint de Login vulnerable
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // FALTA VALIDACIÓN: Se pasa el objeto req.body directamente a la query
        // Atacante envía: { "username": "admin", "password": { "$ne": null } }
        const user = await User.findOne({ 
            username: username, 
            password: password 
        });

        if (user) {
            res.json({ token: "fake-jwt-token-for-workshop", role: user.role });
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    } catch (e) {
        res.status(500).send('Error interno');
    }
});

app.listen(3000, () => console.log('Taller ejecutándose en puerto 3000'));
