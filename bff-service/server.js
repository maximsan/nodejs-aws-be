const { PORT } = require('./config');
const app = require('./app');

app.listen(PORT, () => console.log(`App is running on http://localhost:${PORT}`));
