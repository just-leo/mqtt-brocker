module.exports = {
  apps : [{
    name: "worker",
    cwd: 'src/',
    script: "index.js",
    watch: true,
    env: {
      "NODE_ENV": "development",
      "NODE_CONFIG_DIR": "config"
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
};
