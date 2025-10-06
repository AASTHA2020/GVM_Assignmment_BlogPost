import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/gvm_task';

const connectDB = async () => {
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Mongodb connected !!!')
       
    } catch (err) {
        console.error('Mongodb not connected');
        process.exit(1);
    }
}

mongoose.connection.on('connected', () => {
    console.log(' Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error(' Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log(' Mongoose disconnected');
});

export default connectDB;


