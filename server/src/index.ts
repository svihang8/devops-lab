import { app } from './utils/app';
import { mongo } from './utils/mongo';
import { constants } from './constants';
//const authRoutes = require('./routes/auth')


async function bootstrap() {
  await mongo.connect()

  app.get('/', (req, res) => res.status(200).json({ message: 'Hello World!' }))
  //app.use('/auth', authRoutes)

  app.listen(constants['PORT'], () => {
    console.log(`Server is listening on port: ${constants['PORT']}`)
  })
}

bootstrap()
