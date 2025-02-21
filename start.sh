#!/bin/sh

echo "Current Environment Variables:"
env

echo "Starting SSH daemon..."
/usr/sbin/sshd

echo "Starting Node.js server..."
exec node /app/dist/server
#exec pm2-runtime /app/dist/server -i max --no-daemon
