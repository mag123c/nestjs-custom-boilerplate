module.exports = {
    apps: [
        {
            name: 'APP_NAME',
            script: './dist/src/main.js',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: ['node_modules'],
            watch_options: {
                followSymlinks: false,
            },
            env: {
                NODE_ENV: 'production',
                TZ: 'Asia/Seoul',
                PORT: 3000,
            },
            kill_timeout: 3000,
        },
    ],
};
