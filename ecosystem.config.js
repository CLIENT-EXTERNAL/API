module.exports = {
    apps : [{
      name: 'MOON',
      script: 'app.js',
      instances: 1,
      watch: '.',
      ignore_watch: ['node_modules', 'public'],
    }],
    deploy : {
      test : {
        user : 'root',
        host : '180.149.196.70',
        ref  : 'origin/main',
        repo : 'https://github.com/CLIENT-EXTERNAL/API.git',
        path : '/root/API/MOON',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env test',
        'pre-setup': ''
      },
      development : {
        user : 'root',
        host : '180.149.196.70',
        ref  : 'origin/main',
        repo : 'https://github.com/CLIENT-EXTERNAL/API.git',
        path : '/root/API/MOON',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env development',
        'pre-setup': ''
      },
      production : {
        user : 'root',
        host : '180.149.196.70',
        ref  : 'origin/main',
        repo : 'https://github.com/CLIENT-EXTERNAL/API.git',
        path : '/root/API/MOON',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
        'pre-setup': ''
      }
    }
  };
    