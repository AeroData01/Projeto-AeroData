#!/bin/bash

START_TIME=$(date +%s)

echo "
 ___    __________  ____  ____  ___  _________       
   /   |  / ____/ __ \/ __ \/ __ \/   |/_  __/   |    
  / /| | / __/ / /_/ / / / / / / /| | / / / /| |    
 / ___ |/ /___/ _, _/ /_/ / /_/ / ___ |/ / / ___ |
/_/  |_/_____/_/ |_|\\____/_____/_/  |_/_/ /_/  |_|  

                            ___________                          
                                 |                               
                            _   _|_   _                          
                           (_)-/   \-(_)                         
    _                         /\___/\                         _  
   (_)_______________________( ( . ) )_______________________(_) 
                              \_____/                            
"



echo "Iniciando Aero Data..."
echo "Verificação de dependências do sistema..."
sudo apt update -y

# -----------------------------------------------------
# Função: verificar e instalar Java
# -----------------------------------------------------
verificar_java() {
    echo -n "✔️  Java: "
    if java -version &>/dev/null; then
        echo "já instalado."
    else
        echo "não encontrado. Instalando openjdk-21-jdk..."
        sudo apt install -y openjdk-21-jdk
        echo "✅ Java instalado."
    fi
}

# -----------------------------------------------------
# Função: verificar e instalar Docker
# -----------------------------------------------------
verificar_docker() {
    echo -n "✔️  Docker: "
    if docker --version &>/dev/null; then
        echo "já instalado."
    else
        echo "não encontrado. Instalando docker.io..."
        sudo apt install -y docker.io
        echo "✅ Docker instalado."
    fi
    echo "▶️  Iniciando serviço Docker..."
    sudo systemctl enable --now docker
}

# -----------------------------------------------------
# Função: iniciar container de BD
# -----------------------------------------------------
start_banco() {
    echo "── Iniciando container do Banco de Dados ──"
    if sudo docker ps -a -q -f name=container-bd | grep -q .; then
        echo "Container 'container-bd' já existe."
        if sudo docker ps -q -f name=container-bd | grep -q .; then
            echo "  → 'container-bd' já está em execução."
        else
            echo "  → Iniciando 'container-bd'..."
            sudo docker start container-bd
        fi
    else
        echo "  → Criando imagem e rodando 'container-bd'..."
        sudo docker build -t imagem-bd-aero-data "./Banco de Dados/BD definitivo"
        sudo docker run -d --name container-bd -p 3306:3306 imagem-bd-aero-data
    fi
    echo "────────────────────────────────────────────"
}

# -----------------------------------------------------
# Função: iniciar container da aplicação
# -----------------------------------------------------
start_site() {
    echo "── Iniciando container do Site Aero Data ──"
    if sudo docker ps -a -q -f name=container_aero_data | grep -q .; then
        echo "Container 'container_aero_data' já existe."
        if sudo docker ps -q -f name=container_aero_data | grep -q .; then
            echo "  → 'container_aero_data' já está em execução."
        else
            echo "  → Iniciando 'container_aero_data'..."
            sudo docker start container_aero_data
        fi
    else
        echo "  → Criando imagem e rodando 'container_aero_data'..."
        sudo docker build -t aero_data "./DockerSite"
        # mapeamos 8080:3333 pois seu Node escuta na 3333
        sudo docker run -d --name container_aero_data -p 8080:3333 aero_data
    fi
    echo "────────────────────────────────────────────"
}

# -----------------------------------------------------
# Executa checagens e sobe containers em paralelo
# -----------------------------------------------------
verificar_java &
verificar_docker &
start_banco &
start_site &
wait
echo "✅ Containers e dependências prontos!"
echo "==============================================================================="

# -----------------------------------------------------
# Cria e conecta a rede 'aerodata-net'
# -----------------------------------------------------
echo "🔧 Criando/validando rede Docker 'aerodata-net'..."
if ! sudo docker network ls --format '{{.Name}}' | grep -q '^aerodata-net$'; then
  sudo docker network create aerodata-net
  echo "✅ Rede 'aerodata-net' criada."
else
  echo "ℹ️  Rede 'aerodata-net' já existe."
fi

echo "🔗 Conectando containers à rede..."
for c in container-bd container_aero_data; do
  if ! sudo docker network inspect aerodata-net | grep -q "$c"; then
    sudo docker network connect aerodata-net "$c"
    echo "  → Container '$c' conectado."
  else
    echo "  → Container '$c' já está na rede."
  fi
done

echo "🚀 Todos os containers na rede 'aerodata-net'."
echo "==============================================================================="

# -----------------------------------------------------
# Processo de ETL via JAR
# -----------------------------------------------------
echo "Iniciando o processo de ETL via JAR..."
# nome correto do JAR
JAR_PATH="./Java/aerodata/target/aerodata-integrado-1.0-SNAPSHOT.jar"

if [ ! -f "$JAR_PATH" ]; then
  echo "❌ JAR não encontrado em $JAR_PATH"
  exit 1
fi

echo "✔️  Executando: java -jar $JAR_PATH"
java -jar "$JAR_PATH"
echo "==============================================================================="

# -----------------------------------------------------
# Validação final de conectividade HTTP
# -----------------------------------------------------
echo "✅ Sua aplicação está rodando com sucesso!"
IP=$(curl -s http://checkip.amazonaws.com)
echo "🌐 Acesse em: http://$IP:8080"
echo -n "🔍 Aguardando a aplicação responder"
until curl -s -o /dev/null http://localhost:8080; do
  echo -n "."
  sleep 5
done
echo " ✅"
echo ""
echo "
 ___    __________  ____  ____  ___  _________
   /   |  / ____/ __ \/ __ \/ __ \/   |/_  __/   |
  / /| | / __/ / /_/ / / / / / / /| | / / / /| |
 / ___ |/ /___/ _, _/ /_/ / /_/ / ___ |/ / / ___ |
/_/  |_/_____/_/ |_|\\____/_____/_/  |_/_/ /_/  |_|
"
echo "⏱️ Tempo total: $(( $(date +%s) - START_TIME )) segundos."
echo "==============================================================================="
