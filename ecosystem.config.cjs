module.exports = {
  apps: [{
    name: 'worldtimez',
    script: 'node_modules/.bin/vite',
    args: '--port 4242',
    watch: false,
    env: {
      NODE_ENV: 'development'
    }
  }]
}
