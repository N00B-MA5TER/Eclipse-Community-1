#!/bin/bash

set -e

# ==========================================
# Eclipse Community - Laravel Deployment
# ==========================================

PROJECT_DIR="$HOME/Eclipse-Community-1"
BACKEND_DIR="$PROJECT_DIR/backend-laravel"
PHP="/opt/cpanel/ea-php84/root/usr/bin/php"
COMPOSER="$HOME/composer.phar"

echo ""
echo "=========================================="
echo "   Eclipse Community - Deployment"
echo "=========================================="
echo ""

# ------------------------------------------
# 1. Check project directory
# ------------------------------------------

if [ ! -d "$PROJECT_DIR" ]; then
    echo "ERROR: Project directory not found:"
    echo "$PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"

echo "[1/7] Pulling latest code..."
git pull origin main

echo ""
echo "[2/7] Entering Laravel backend..."
cd "$BACKEND_DIR"

# ------------------------------------------
# 2. Verify PHP 8.4
# ------------------------------------------

echo ""
echo "[3/7] Checking PHP version..."

"$PHP" -v | head -n 1

# ------------------------------------------
# 3. Install Composer dependencies
# ------------------------------------------

echo ""
echo "[4/7] Installing Composer dependencies..."

if [ -f "$COMPOSER" ]; then
    "$PHP" "$COMPOSER" install \
        --no-dev \
        --optimize-autoloader \
        --no-interaction
else
    echo "WARNING: composer.phar not found."
    echo "Skipping Composer installation."
fi

# ------------------------------------------
# 4. Run database migrations & storage link
# ------------------------------------------

echo ""
echo "[5/7] Running database migrations & storage link..."

"$PHP" artisan migrate --force
"$PHP" artisan storage:link --force

# ------------------------------------------
# 5. Clear Laravel caches
# ------------------------------------------

echo ""
echo "[6/7] Clearing Laravel caches..."

"$PHP" artisan config:clear
"$PHP" artisan cache:clear
"$PHP" artisan route:clear
"$PHP" artisan view:clear

# ------------------------------------------
# 6. Rebuild production configuration
# ------------------------------------------

echo ""
echo "[7/7] Rebuilding Laravel configuration..."

"$PHP" artisan config:cache

echo ""
echo "=========================================="
echo "   DEPLOYMENT SUCCESSFUL"
echo "=========================================="
echo ""
echo "Backend:"
echo "https://api.csediatm.in"
echo ""
echo "Frontend:"
echo "https://www.csediatm.in"
echo ""