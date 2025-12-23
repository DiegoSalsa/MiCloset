#!/bin/bash

# Script para ejecutar la migración de BD
# Conecta a PostgreSQL y ejecuta el SQL de migración

echo "🔄 Ejecutando migración de BD..."
echo "Conexión a: miCloset_db"

# Ejecutar el archivo SQL con psql
psql -U postgres -d miCloset_db -f "$(dirname "$0")/migration_001_intelligent_matching.sql"

if [ $? -eq 0 ]; then
    echo "✅ Migración completada exitosamente"
else
    echo "❌ Error ejecutando migración"
    exit 1
fi
