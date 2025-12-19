# ============================================
# WAREHOUSE SERVICE - Windows Deployment
# ============================================

# Colors
function Write-Color {
    param($Color, $Text)
    Write-Host $Text -ForegroundColor $Color
}

Write-Color Cyan "🐳 Warehouse Service - Windows Deployment"
Write-Host "=========================================="
Write-Host ""

# Check if Docker is running
Write-Color Yellow "Checking Docker..."
$dockerStatus = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Color Red "❌ Docker is not running!"
    Write-Host "Please start Docker Desktop and try again."
    exit 1
}
Write-Color Green "✅ Docker is running"
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Color Red "❌ .env file not found!"
    Write-Host ""
    Write-Host "Creating .env from template..."
    
    if (Test-Path ".env.production.example") {
        Copy-Item ".env.production.example" ".env"
        Write-Color Yellow "⚠️  Please edit .env file and update the values!"
        Write-Host "Press any key to open .env file..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        notepad .env
        Write-Host ""
        Write-Host "After editing, save and close the file, then run this script again."
        exit 0
    } else {
        Write-Color Red "❌ .env.production.example not found!"
        Write-Host "Please create .env file manually."
        exit 1
    }
}

Write-Color Green "✅ .env file found"
Write-Host ""

# Menu
Write-Color Yellow "Select an option:"
Write-Host "1) Deploy/Start containers"
Write-Host "2) Update (pull latest image and restart)"
Write-Host "3) Stop containers"
Write-Host "4) View logs"
Write-Host "5) Database backup"
Write-Host "6) Database restore"
Write-Host "7) Reset everything (⚠️  DANGER: Deletes all data!)"
Write-Host "8) Shell access to backend"
$choice = Read-Host "Enter choice (1-8)"

switch ($choice) {
    "1" {
        Write-Color Cyan "`n🚀 Deploying containers...`n"
        
        # Pull latest images
        Write-Color Yellow "📥 Pulling latest images..."
        docker-compose pull
        
        # Start containers
        Write-Color Yellow "▶️  Starting containers..."
        docker-compose up -d
        
        # Wait for database
        Write-Color Yellow "⏳ Waiting for database to be ready..."
        Start-Sleep -Seconds 10
        
        # Check if migrations exist
        Write-Host ""
        $runMigration = Read-Host "Run database migrations? (y/n)"
        if ($runMigration -eq "y") {
            Write-Color Yellow "📊 Running migrations..."
            docker-compose exec backend npx prisma migrate deploy
        }
        
        # Ask about seeding
        Write-Host ""
        $runSeed = Read-Host "Seed database with initial data? (y/n)"
        if ($runSeed -eq "y") {
            Write-Color Yellow "🌱 Seeding database..."
            docker-compose exec backend npm run seed
            Write-Host ""
            Write-Color Green "Default accounts:"
            Write-Host "   Admin:   admin@warehouse.com / admin123"
            Write-Host "   Manager: manager@warehouse.com / manager123"
            Write-Host "   Agent:   agent@warehouse.com / agent123"
        }
        
        Write-Host ""
        Write-Color Green "✅ Deployment complete!"
        Write-Host ""
        Write-Color Cyan "🔗 Service URLs:"
        Write-Host "   API:    http://localhost:3000"
        Write-Host "   Health: http://localhost:3000/health"
        Write-Host ""
    }
    
    "2" {
        Write-Color Cyan "`n🔄 Updating containers...`n"
        
        # Pull latest
        Write-Color Yellow "📥 Pulling latest images..."
        docker-compose pull
        
        # Restart
        Write-Color Yellow "🔄 Restarting containers..."
        docker-compose down
        docker-compose up -d
        
        # Wait
        Start-Sleep -Seconds 10
        
        # Migration
        Write-Host ""
        $runMigration = Read-Host "Run database migrations? (y/n)"
        if ($runMigration -eq "y") {
            docker-compose exec backend npx prisma migrate deploy
        }
        
        Write-Host ""
        Write-Color Green "✅ Update complete!"
    }
    
    "3" {
        Write-Color Cyan "`n🛑 Stopping containers...`n"
        docker-compose down
        Write-Color Green "✅ Containers stopped"
    }
    
    "4" {
        Write-Color Cyan "`n📋 Viewing logs (Ctrl+C to exit)...`n"
        docker-compose logs -f
    }
    
    "5" {
        Write-Color Cyan "`n💾 Creating database backup...`n"
        
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupDir = ".\backups"
        
        if (-not (Test-Path $backupDir)) {
            New-Item -ItemType Directory -Path $backupDir | Out-Null
        }
        
        $backupFile = "$backupDir\warehouse_db_$timestamp.sql"
        
        docker-compose exec postgres pg_dump -U warehouse_user warehouse_db > $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Color Green "✅ Backup created: $backupFile"
        } else {
            Write-Color Red "❌ Backup failed!"
        }
    }
    
    "6" {
        Write-Color Cyan "`n📥 Database restore...`n"
        
        $backupFiles = Get-ChildItem ".\backups\*.sql" -ErrorAction SilentlyContinue
        
        if ($backupFiles.Count -eq 0) {
            Write-Color Red "❌ No backup files found in .\backups\"
            exit 1
        }
        
        Write-Host "Available backups:"
        for ($i = 0; $i -lt $backupFiles.Count; $i++) {
            Write-Host "$($i + 1)) $($backupFiles[$i].Name)"
        }
        
        $selection = Read-Host "Select backup file (1-$($backupFiles.Count))"
        $selectedFile = $backupFiles[$selection - 1]
        
        Write-Color Yellow "⚠️  This will overwrite the current database!"
        $confirm = Read-Host "Are you sure? (yes/no)"
        
        if ($confirm -eq "yes") {
            Write-Color Yellow "Restoring from $($selectedFile.Name)..."
            Get-Content $selectedFile.FullName | docker-compose exec -T postgres psql -U warehouse_user -d warehouse_db
            
            if ($LASTEXITCODE -eq 0) {
                Write-Color Green "✅ Restore complete!"
            } else {
                Write-Color Red "❌ Restore failed!"
            }
        } else {
            Write-Host "Restore cancelled."
        }
    }
    
    "7" {
        Write-Color Red "`n⚠️  DANGER ZONE ⚠️"
        Write-Host "This will:"
        Write-Host "  - Stop all containers"
        Write-Host "  - Delete all volumes (DATABASE WILL BE LOST!)"
        Write-Host "  - Delete all data"
        Write-Host ""
        $confirm = Read-Host "Type 'DELETE' to confirm"
        
        if ($confirm -eq "DELETE") {
            Write-Color Yellow "🗑️  Deleting everything..."
            docker-compose down -v
            Write-Color Green "✅ Everything deleted"
            Write-Host ""
            Write-Host "Run option 1 to deploy fresh."
        } else {
            Write-Host "Cancelled."
        }
    }
    
    "8" {
        Write-Color Cyan "`n🐚 Opening shell in backend container...`n"
        Write-Host "Type 'exit' to leave the shell."
        Write-Host ""
        docker-compose exec backend sh
    }
    
    default {
        Write-Color Red "Invalid choice!"
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

