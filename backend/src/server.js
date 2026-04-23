import app from './app.js';
import { connectDb } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    await connectDb();
    const port = parseInt(env.port, 10) || 5000;

    const server = app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
      console.log(`Backend API: http://localhost:${port}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Stop the conflicting process or change PORT in backend/.env.`);
      } else {
        console.error('Fatal server start error', err);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('Failed to connect to database before starting server', error);
    process.exit(1);
  }
};

startServer();

