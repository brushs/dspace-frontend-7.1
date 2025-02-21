#!/bin/sh

echo "Current Environment Variables:"
env
echo "NODE_ENV is set to: $NODE_ENV"

echo "Starting SSH daemon..."
/usr/sbin/sshd

echo "Starting Node.js server..."
export NODE_ENV=production
echo "NODE_ENV is set to: $NODE_ENV"
exec node /app/dist/server
#exec pm2-runtime /app/dist/server -i max --no-daemon
