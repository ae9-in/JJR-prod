import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await connectDb();
    
    let currentPort = parseInt(env.port, 10) || 5000;
    
    const startListening = (port) => {
      const server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        console.log(`Backend API: http://localhost:${port}`);
      });
      
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`Port ${port} is in use, dynamically switching to ${port + 1}...`);
          startListening(port + 1);
        } else {
          console.error('Fatal server start error', err);
          process.exit(1);
        }
      });
    };

    startListening(currentPort);

  } catch (error) {
    console.error('Failed to connect to database before starting server', error);
    process.exit(1);
  }
};

startServer();
