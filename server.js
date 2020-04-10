const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

const connectionString = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to remote Atlas MongoDB Server'))
  .catch((err) => {
    console.log('Database connection error !');
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`APIProvider is running on port ${port}...`);
});
