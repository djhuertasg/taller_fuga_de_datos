// seed.js
const mongoose = require('mongoose');

// Usar la variable de entorno o localhost por defecto
const dbURI = process.env.MONGO_URI |

| 'mongodb://localhost:27017/taller_db';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('MongoDB conectado para seeding...'))
 .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'patient' }
});

const User = mongoose.model('User', UserSchema);

const seedUsers =;

const seedDB = async () => {
  try {
    await User.deleteMany({}); // Limpiar usuarios viejos
    await User.insertMany(seedUsers);
    console.log("✅ Base de datos poblada con éxito: Dr. Smith, Admin y Paciente creados.");
  } catch (err) {
    console.error("❌ Error poblando la base de datos:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
