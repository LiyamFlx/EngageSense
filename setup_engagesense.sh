#!/bin/bash

# Set the paths (updated for your project)
VENV_PATH="/Users/wix/Documents/GitHub/EngageSense/venv"  # Path to your virtual environment
APP_PATH="/Users/wix/Documents/GitHub/EngageSense"    # Path to your EngageSense app directory
GUNICORN_PATH="$VENV_PATH/bin/gunicorn"  # Path to Gunicorn in the virtual environment
APP_ENTRY_POINT="engagesense:app"  # Replace with your app entry point if different

# Define log paths
LOG_PATH="$APP_PATH/logs"
ERROR_LOG="$LOG_PATH/engagesense.err"
OUTPUT_LOG="$LOG_PATH/engagesense.out"

# Create the log directory if it doesn't exist
mkdir -p $LOG_PATH

# Create the plist file for launchd
cat <<EOF > ~/Library/LaunchAgents/com.yourcompany.engagesense.plist
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
    <dict>
        <key>Label</key>
        <string>com.yourcompany.engagesense</string>
        <key>ProgramArguments</key>
        <array>
            <string>$GUNICORN_PATH</string>
            <string>-w</string>
            <string>4</string> <!-- Number of workers -->
            <string>-b</string>
            <string>127.0.0.1:5001</string> <!-- Bind to localhost port 5001 -->
            <string>$APP_ENTRY_POINT</string> <!-- Your app entry point -->
        </array>
        <key>WorkingDirectory</key>
        <string>$APP_PATH</string>
        <key>StandardErrorPath</key>
        <string>$ERROR_LOG</string>
        <key>StandardOutPath</key>
        <string>$OUTPUT_LOG</string>
        <key>RunAtLoad</key>
        <true/> <!-- Automatically start the service on load -->
        <key>KeepAlive</key>
        <true/> <!-- Restart the service if it crashes -->
    </dict>
</plist>
EOF

# Load the service to launchd
launchctl load ~/Library/LaunchAgents/com.yourcompany.engagesense.plist

# Start the service
launchctl start com.yourcompany.engagesense

# Print success message
echo "EngageSense service has been set up and started successfully!"

# Optional: Tail the logs to monitor the service
echo "Monitoring logs:"
tail -f $OUTPUT_LOG
