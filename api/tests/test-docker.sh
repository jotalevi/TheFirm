#!/bin/bash

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${CYAN}Probando configuración de Docker para TheFirm API...${NC}"

# Verificar que Docker está instalado
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker instalado: $DOCKER_VERSION${NC}"
else
    echo -e "${RED}❌ Docker no está instalado o no está disponible en PATH${NC}"
    exit 1
fi

# Verificar que docker-compose está instalado
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    echo -e "${GREEN}✅ Docker Compose instalado: $COMPOSE_VERSION${NC}"
else
    echo -e "${RED}❌ Docker Compose no está instalado o no está disponible en PATH${NC}"
    exit 1
fi

# Construir y levantar los contenedores
echo -e "${CYAN}🔨 Construyendo y levantando contenedores...${NC}"
docker-compose build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al construir los contenedores${NC}"
    exit 1
fi

echo -e "${CYAN}🚀 Iniciando contenedores...${NC}"
docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al iniciar los contenedores${NC}"
    exit 1
fi

# Esperar a que los servicios estén disponibles
echo -e "${CYAN}⏳ Esperando a que los servicios estén disponibles...${NC}"
sleep 15

# Verificar que los contenedores están corriendo
CONTAINERS=("oracle-xe" "thefirm-api" "thefirm-admin")
for CONTAINER in "${CONTAINERS[@]}"; do
    STATUS=$(docker ps --filter "name=$CONTAINER" --format "{{.Status}}")
    if [[ $STATUS == Up* ]]; then
        echo -e "${GREEN}✅ Contenedor $CONTAINER está corriendo${NC}"
    else
        echo -e "${RED}❌ Contenedor $CONTAINER no está corriendo${NC}"
    fi
done

echo -e "\n${CYAN}📋 Información de servicios:${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3000${NC}"
echo -e "${YELLOW}Backend API: http://localhost:5100${NC}"
echo -e "${YELLOW}Base de datos Oracle: localhost:1521/FREEPDB1${NC}"
echo -e "${YELLOW}Usuario BD: system${NC}"
echo -e "${YELLOW}Contraseña BD: oracle${NC}"

echo -e "\n${MAGENTA}🛑 Para detener los servicios, ejecuta: docker-compose down${NC}"

# Hacer el script ejecutable
chmod +x test-docker.sh 