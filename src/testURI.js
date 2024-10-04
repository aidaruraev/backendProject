require('dotenv').config();


const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;

console.log(jwtSecret);
console.log(mongoUri);