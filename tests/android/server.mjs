import { createWebPreview } from '../../scripts/serve-web.mjs';

createWebPreview().listen(8084, '127.0.0.1', () => console.log('Isolated Android contract browser fixture on localhost:8084'));
