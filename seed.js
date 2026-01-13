const mongoose = require('mongoose');

// Usar la variable de entorno o localhost como fallback
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/taller_db';

const UserSchema = new mongoose.Schema({
    username: String,
    password: String, // Texto plano para el taller (vulnerabilidad didáctica)
    role: { type: String, default: 'patient' },
    medicalHistory: { type: Array, default: }
});

const User = mongoose.model('User', UserSchema);

const seedUsers = [
    {
        username: "admin",
        password: "SuperSecretPassword123",
        role: "admin",
        medicalHistory: []
    },
    {
        username: "dr.smith",
        password: "MedicalPassword123", 
        role: "doctor",
        medicalHistory: []
    },
    {
        username: "patient_zero",
        password: "password",
        role: "patient",
        medicalHistory: ["Alergia a la Penicilina", "Hipertensión"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(dbURI, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log("🌱 Conectado a MongoDB...");
        
        await User.deleteMany({}); 
        console.log("🧹 Base de datos limpia.");

        await User.insertMany(seedUsers);
        console.log("✅ Usuarios creados: Admin, Doctor y Paciente.");
        
        process.exit(0);
    } catch (err) {
        console.error("❌ Error en el seeding:", err);
        process.exit(1);
    }
};

seedDB();
