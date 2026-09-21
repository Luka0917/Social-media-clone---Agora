import "dotenv/config";
import { app } from './src/server.js';
import env from './src/config/env.js';

app.listen(env.PORT, () => {
    console.log(`Better Auth app listening on port ${env.PORT}`);
});