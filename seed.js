// seed.js
const mongoose = require('mongoose');

// Conexión a la base de datos (usa la variable de entorno o localhost)
const dbURI = process.env.MONGO_URI |

| 'mongodb://localhost:27017/taller_db';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String, // En un caso real, esto estaría hasheado. Aquí es texto plano para el taller.
    role: { type: String, default: 'patient' },
    // Campos extra para simular datos médicos
    medicalHistory: { type: Array, default: }
});

const User = mongoose.model('User', UserSchema);

// Datos semilla
const users =
    },
    {
        username: "dr.smith",
        password: "MedicalPassword123", // Objetivo de la Inyección NoSQL
        role: "doctor",
        medicalHistory:
    },
    {
        username: "patient_zero",
        password: "password",
        role: "patient",
        medicalHistory: ["Alergia a la Penicilina", "Hipertensión"]
    }
];

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(async () => {
        console.log('🌱 Conectado a MongoDB...');
        
        // Limpiar base de datos previa
        await User.deleteMany({});
        console.log('🧹 Usuarios antiguos eliminados.');

        // Insertar nuevos usuarios
        await User.insertMany(users);
        console.log('✅ Base de datos poblada: Admin, Dr. Smith y Paciente creados.');
        
        process.exit(0);
    })
   .catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
