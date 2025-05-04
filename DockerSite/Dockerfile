# Usa a imagem oficial do Node.js
FROM node:latest

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 2) Copie só o package.json (e package-lock.json, se tiver)
COPY package*.json ./

# 3) Instale as dependências
RUN npm install

# 4) Copie todo o resto do seu código
COPY . .



# Cria o arquivo .env com as variáveis
RUN echo "AMBIENTE_PROCESSO=producao\n\
DB_HOST=container-bd\n\
DB_DATABASE=aerodata\n\
DB_USER=root\n\
DB_PASSWORD=urubu100\n\
DB_PORT=3306\n\
APP_PORT=3333\n\
APP_HOST=localhost" > /usr/src/app/.env


# Exponha a porta usada pela aplicação
EXPOSE 3333

# Define o comando padrão para iniciar a aplicação
CMD ["npm", "run", "dev"]
