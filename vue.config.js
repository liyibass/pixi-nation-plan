const { projectName } = require('./config')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? `${projectName}/` : '/',
}
