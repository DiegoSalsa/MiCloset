# Script para ejecutar la migración de BD en Windows
# Requiere tener PostgreSQL instalado y psql en PATH

Write-Host "🔄 Ejecutando migración de BD..." -ForegroundColor Cyan
Write-Host "Conexión a: miCloset_db" -ForegroundColor Cyan

$dbName = "miCloset_db"
$dbUser = "postgres"
$migrationFile = Join-Path (Split-Path $PSCommandPath) "migration_001_intelligent_matching.sql"

if (-not (Test-Path $migrationFile)) {
    Write-Host "❌ Archivo de migración no encontrado: $migrationFile" -ForegroundColor Red
    exit 1
}

try {
    # Ejecutar el script SQL
    psql -U $dbUser -d $dbName -f $migrationFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migración completada exitosamente" -ForegroundColor Green
        Write-Host "`n📊 Tablas y campos agregados:" -ForegroundColor Green
        Write-Host "   - garments.style" -ForegroundColor White
        Write-Host "   - garments.season" -ForegroundColor White
        Write-Host "   - outfit_ratings (nueva tabla)" -ForegroundColor White
        Write-Host "   - learned_incompatibilities (nueva tabla)" -ForegroundColor White
    } else {
        Write-Host "❌ Error ejecutando migración (código de salida: $LASTEXITCODE)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Excepción: $_" -ForegroundColor Red
    exit 1
}
