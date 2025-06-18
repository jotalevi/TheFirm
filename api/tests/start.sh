#!/bin/bash

# Colores
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Script para iniciar TheFirm con Docker Compose
echo -e "${CYAN}Iniciando TheFirm...${NC}"

# Verificar si Docker está en ejecución
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker no está en ejecución. Por favor, inicia Docker y vuelve a ejecutar este script.${NC}"
    exit 1
fi

# Ejecutar docker-compose
echo -e "${YELLOW}Construyendo y levantando contenedores...${NC}"
cd TheFirmApi
docker-compose up -d --build

# Verificar si los contenedores están en ejecución
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}Aplicación iniciada correctamente!${NC}"
    echo -e "${CYAN}Frontend: http://localhost:3000${NC}"
    echo -e "${CYAN}Backend API: http://localhost:5100${NC}"
    echo -e "${CYAN}Swagger: http://localhost:5100/swagger${NC}"
    echo -e "\n${YELLOW}Para detener la aplicación ejecuta: docker-compose down${NC}"
else
    echo -e "${RED}Error al iniciar la aplicación. Revisa los logs con: docker-compose logs${NC}"
fi 