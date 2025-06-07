# 🛫 AeroData: Análise de Cancelamentos e Atrasos em Voos Comerciais
O AeroData é um projeto que utiliza dados da ANAC sobre atrasos e cancelamentos de voos para auxiliar companhias aéreas na tomada de decisões estratégicas. Através de dashboards intuitivos e KPIs relevantes, o sistema permite uma análise clara e eficiente das informações, ajudando a minimizar impactos operacionais e otimizar processos.
<br> <br>

# 🚀 Funcionalidades

### 📊 Análise e Visualização
• Dashboard dinâmica com indicadores de atrasos e cancelamentos  
• KPIs estratégicos para apoio à decisão  
• Site institucional na nuvem AWS <br>
• Envio de notificações via Slack

### 🔄 Processamento de Dados
• Leitura automática da planilha no bucket AWS S3  
• Tratamento e limpeza dos dados brutos  
• Inserção dos dados em banco de dados (MySQL)  
• Logs em Java com detalhamento da carga e leitura salvando em BD

### ☁️ Infraestrutura e Deploy
• Instância EC2 Linux Ubuntu para execução do sistema <br>
• Site instucional com 3 CRUDs Web <br>
• Docker compose com 3 containers (Java, Node, MySQL)  
• Shell script de instalação do ambiente <br>
• Java (JAR) com execução automática via cron  

### 📁 Modelagem e Documentação
• BPMN – Processo de negócio detalhado  
• MER – Modelo lógico de dados  
• Digrama de classes (Java)
• Matriz de rastreabilidade de requisitos <br>
• Diagrama de solução (arquitetura de referência técnica) <br>
• Wireframes das telas do sistema <br>
• Diagrama de Sequência (HTTP) <br>
• Metodologia documentada  
• Documentação de visita/pesquisa  
• Backlog e planner 


# 🛠️ Ferramentas e Tecnologias Utilizadas

• **Linguagens:** HTML, CSS, JavaScript, Java e SQL  
• **Banco de Dados:** MySQL (em container) e H2 (para testes locais)  
• **Infraestrutura:**  AWS (EC2 Linux, S3), Docker e Docker Compose <br>
• **Gestão do Projeto:** Trello, Backlog e GitHub  
• **Automação:**  Shell Script e Crontab (Linux) para execução periódica do JAR  
• **Modelagem:** BPMN, MER, Matriz de Rastreabilidade e Diagrama de Classes 
