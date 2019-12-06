module.exports = {
  apps: [
    {
      name: "@grove-app-name",
      script: "node-app.js",
      cwd: "./middle-tier/",
      watch: true,
      restart_delay: 4000,
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production",
        GROVE_UI_BUILD_PATH: "../ui/build/"
      }
    }
  ],
  deploy: {}
};
