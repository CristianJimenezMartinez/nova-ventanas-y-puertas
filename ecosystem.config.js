module.exports = {
  apps: [
    {
      name: 'nova-ventanas-y-puertas',
      script: 'npx',
      args: 'serve -s dist/nova-ventanas-y-puertas/browser -l 4050',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4050
      }
    }
  ]
};
