import app from './app'
import { logger } from './lib/logger'
import './lib/seed'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})