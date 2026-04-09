#!/bin/bash
# Setup script for Mac/Linux cron job automation
# This creates a cron task to generate 15 articles daily at 2:00 AM

echo ""
echo "================================================"
echo "InfoDaily - Daily Article Auto-Generation Setup"
echo "================================================"
echo ""

# Get the project directory
PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "Project directory: $PROJECT_DIR"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again"
    exit 1
fi

echo "Node.js found: $(which node)"
echo ""

# Check for API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "WARNING: ANTHROPIC_API_KEY is not set in your environment"
    echo ""
    echo "Before the cron job can run, you must set your API key:"
    echo ""
    echo "1. Add to your ~/.bashrc or ~/.zshrc:"
    echo "   export ANTHROPIC_API_KEY='your-api-key-here'"
    echo ""
    echo "2. Or add to ~/.bash_profile for Mac"
    echo ""
    echo "3. Reload your shell: source ~/.bashrc"
    echo ""
fi

# Create the cron job
CRON_COMMAND="0 2 * * * cd $PROJECT_DIR && $(which node) automate-daily-articles.js >> /tmp/infodaily-cron.log 2>&1"

echo "Setting up cron job..."
echo "Schedule: Daily at 2:00 AM"
echo "Command: $CRON_COMMAND"
echo ""

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "automate-daily-articles.js"; then
    echo "Cron job already exists. Updating..."
    # Remove old job
    crontab -l | grep -v "automate-daily-articles.js" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_COMMAND") | crontab -

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Cron job created successfully!"
    echo ""
    echo "Details:"
    echo "- Schedule: Daily at 2:00 AM"
    echo "- Action: Generate 15 articles with relevant images"
    echo "- Logs: $PROJECT_DIR/logs/articles-YYYY-MM-DD.log"
    echo "- Cron log: /tmp/infodaily-cron.log"
    echo ""
    echo "To view your cron jobs:"
    echo "  crontab -l"
    echo ""
    echo "To edit:"
    echo "  crontab -e"
    echo ""
    echo "To remove:"
    echo "  crontab -r"
    echo ""
else
    echo "ERROR: Failed to create cron job"
    exit 1
fi
