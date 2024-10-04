const mongoose = require('mongoose');

require('dotenv').config();
// Replace with your actual MongoDB connection string
const uri = "mongodb+srv://aidarhunt:vy9fP3NO8WjQsqDn@cluster0.udteq.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0";
const jwtSecret = process.env.JWT_SECRET;
const mongoUri = process.env.MONGODB_URI;

console.log(jwtSecret);
console.log(mongoUri);


const testSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const TestModel = mongoose.model('Test', testSchema);

const connectToMongoDB = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connection successful');

        // Insert a test document
        const testDoc = new TestModel({ email: 'testuser', password: 'password123' });
        await testDoc.save();
        console.log('Test document inserted');

    } catch (error) {
        console.error('MongoDB connection error:', error);
    } finally {
        // Close the connection after testing
        await mongoose.connection.close();
    }
};

// Call the function to test the connection
connectToMongoDB();
