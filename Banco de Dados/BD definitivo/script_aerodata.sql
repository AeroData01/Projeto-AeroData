DROP DATABASE aerodata;
CREATE DATABASE aerodata;
USE aerodata;

SHOW TABLES;

CREATE TABLE Companhia_Aerea (
    cnpj CHAR(14) PRIMARY KEY,
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    sigla_companhia CHAR(3) UNIQUE,
    representante_legal VARCHAR(45)
);

CREATE TABLE Usuario (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(45),
    CONSTRAINT chk_cargo
        CHECK (cargo IN ('Gestor de Malha Aérea', 'Diretor de Companhia Aérea')),
    email VARCHAR(50) UNIQUE,
    senha VARCHAR(30), -- aplicar criptografia e hash de armazenamento posteriormente
    fk_companhia CHAR(14),
    CONSTRAINT fk_companhiaUsuario
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(cnpj)
);

CREATE TABLE Voos (
	id_Voo INT PRIMARY KEY AUTO_INCREMENT,
	numero_voo VARCHAR (10),
	dia_referencia DATE,
	aeroporto_partida VARCHAR (45),
	sigla_aeroporto_partida CHAR (3),
	aeroporto_destino VARCHAR (45),
	sigla_aeroporto_destino CHAR (3),
	situacao_voo VARCHAR (45),
	situacao_partida VARCHAR (45),
	situacao_chegada VARCHAR (45),
	fk_companhia CHAR (14),
    CONSTRAINT fk_companhiaVoos
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(cnpj)
);


CREATE TABLE Alertas (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    tipo VARCHAR(30),
    CONSTRAINT chk_tipo
		CHECK (tipo in ('Voo cancelado', 'Voo atrasado')),
    mensagem VARCHAR(100),
    fk_voo INT,
    CONSTRAINT fk_AlertasVoos
		FOREIGN KEY (fk_voo) 
			REFERENCES Voos(id_voo)
);
