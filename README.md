# 🛫 AeroData: Análise de Cancelamentos e Atrasos em Voos Comerciais
O AeroData é um projeto que utiliza dados da ANAC sobre atrasos e cancelamentos de voos para auxiliar gestores de companhias aéreas na tomada de decisões estratégicas. Através de dashboards intuitivos e KPIs relevantes, o sistema permite uma análise clara e eficiente das informações, ajudando a minimizar impactos operacionais e otimizar processos.
<br> <br>

# 🚀 Funcionalidades

### 📊 Análise e Visualização
• Dashboard estático com indicadores de atrasos e cancelamentos  
• KPIs estratégicos para apoio à decisão  
• Wireframes das telas do sistema  
• Site institucional publicado na nuvem AWS  

### 🔄 Processamento de Dados
• Leitura automática de arquivos via AWS S3 (Data Lake)  
• Tratamento e limpeza dos dados brutos  
• Inserção dos dados em banco de dados relacional (MySQL)  
• Logs em Java (versão 2) com detalhamento da carga e leitura  

### ☁️ Infraestrutura e Deploy
• Execução do sistema em EC2 com ambiente Linux  
• Container de banco de dados configurado na nuvem  
• Script de instalação do ambiente (Java, libs, variáveis)  
• Prototipação Java (JAR) com execução automática via `cron`  
• Deploy do site institucional na AWS S3  

### 📁 Modelagem e Documentação
• BPMN – Processo de negócio detalhado  
• MER – Modelo lógico de dados com base na SP1  
• Matriz de rastreabilidade de requisitos  
• Diagrama de solução (arquitetura de referência técnica)  
• Metodologia documentada  
• Documentação de visita/pesquisa  
• Backlog e planner atualizados no GitHub  


# 🛠️ Ferramentas e Tecnologias Utilizadas

• **Ferramentas:** Visual Studio Code, IntelliJ, Node.js, AWS (EC2, S3), Excel  
• **Gestão do Projeto:** Trello, Backlog, GitHub  
• **Linguagens e Tecnologias:** HTML, CSS, JavaScript, Java, Shell Script, SQL  
• **Banco de Dados:** MySQL (em container), H2 (para testes locais)  
• **Automação:** Crontab (Linux) para execução periódica do JAR  
• **Modelagem:** BPMN, MER, Matriz de Rastreabilidade  
