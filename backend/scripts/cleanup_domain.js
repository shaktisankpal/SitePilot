import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Domain from '../src/modules/domain/domain.model.js';

dotenv.config({ path: './.env' });

async function run() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        const domainToDelete = 'blockchain.localhost';
        console.log(`Searching for domain: ${domainToDelete}`);
        
        const result = await Domain.deleteMany({ domain: domainToDelete.toLowerCase() });
        
        console.log(`Success! Deleted ${result.deletedCount} domain(s).`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

run();
