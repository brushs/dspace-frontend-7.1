#!/bin/sh

echo "Current Environment Variables:"
env

echo "Starting SSH daemon..."
/usr/sbin/sshd

echo "Starting Node.js server..."
exec node dist/server
