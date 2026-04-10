
const mongoose = require('mongoose');
const uri = "mongodb://shikhar5775_db_user:RqfyldJjZZRoBR7A@ac-f2f1v89-shard-00-00.yua93wd.mongodb.net:27017,ac-f2f1v89-shard-00-01.yua93wd.mongodb.net:27017,ac-f2f1v89-shard-00-02.yua93wd.mongodb.net:27017/jaya_janardhana?ssl=true&replicaSet=atlas-w75brf-shard-0&authSource=admin";

async function test() {
  try {
    console.log("Connecting to MONGODB...");
    await mongoose.connect(uri);
    console.log("SUCCESS: MONGODB ATLAS CONNECTED");
    await mongoose.connection.close();
  } catch (err) {
    console.error("FAILED to connect to MongoDB Atlas:", err.message);
    if (err.message.includes('querySrv')) {
        console.error("DNS issue with SRV record. Try standard connection string.");
    }
  }
}
test();
