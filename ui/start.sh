#!/bin/bash
cd "$(dirname "$0")"

echo "Starting Marketing UI..."
echo

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  echo
fi

echo "Starting server..."
npm run dev &
SERVER_PID=$!

# Wait for server to start
sleep 3

# Open browser
echo "Opening browser..."
if command -v open &> /dev/null; then
  open http://localhost:3000
elif command -v xdg-open &> /dev/null; then
  xdg-open http://localhost:3000
else
  echo "Open http://localhost:3000 in your browser"
fi

echo
echo "UI is running at http://localhost:3000"
echo "Press Ctrl+C to stop."

# Wait for interrupt
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
wait $SERVER_PID
