/**
 * Setup script for Todo App Server
 * This script helps verify the MongoDB connection and creates necessary collections
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

async function setupDatabase() {
  try {
    console.log('🔍 Checking MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Successfully connected to MongoDB!');
    console.log(`📍 Database: ${MONGODB_URI}`);

    // Check if collections exist
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);

    console.log('\n📊 Current collections:');
    if (collectionNames.length === 0) {
      console.log('   No collections found (this is normal for a new database)');
    } else {
      collectionNames.forEach(name => {
        console.log(`   - ${name}`);
      });
    }

    // Check if users collection exists, if not it will be created automatically
    if (!collectionNames.includes('users')) {
      console.log('\n📝 Users collection will be created when first user registers');
    }

    // Check if todos collection exists, if not it will be created automatically
    if (!collectionNames.includes('todos')) {
      console.log('📝 Todos collection will be created when first todo is added');
    }

    console.log('\n🎯 Database setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: npm run dev');
    console.log('2. Test the API endpoints');
    console.log('3. Open MongoDB Compass to view your data');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure MongoDB is running on localhost:27017');
    console.log('2. Check if MongoDB Compass is installed');
    console.log('3. Verify your .env file configuration');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Run setup if this script is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
