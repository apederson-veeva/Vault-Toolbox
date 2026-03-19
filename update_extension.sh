#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Vault Toolbox Update..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR/frontend"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install Node.js and npm."
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies (this may take a minute)..."
    npm install
fi

# Build the extension
echo "🛠️ Building extension..."
npm run build

echo "✅ Build complete! The unpacked extension is in: frontend/dist"

# Mac specific reload
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Mac detected. Attempting to refresh Chrome extensions page..."
    # This AppleScript finds any tab starting with chrome://extensions and reloads it
    osascript -e 'tell application "Google Chrome"
        set extensionTabFound to false
        repeat with w in windows
            repeat with t in tabs of w
                if URL of t starts with "chrome://extensions" then
                    reload t
                    set extensionTabFound to true
                end if
            end repeat
        end repeat
        if not extensionTabFound then
            display notification "Extension built, but chrome://extensions tab not found to reload." with title "Vault Toolbox"
        end if
    end tell' 2>/dev/null || echo "⚠️ Could not refresh Chrome. Is it running?"

    echo "✨ If you have chrome://extensions open, it has been refreshed."
    echo "ℹ️ Note: If this is your first time, you still need to 'Load unpacked' from the 'frontend/dist' folder in Chrome."
else
    echo "ℹ️ Please go to chrome://extensions and reload the extension manually."
fi
