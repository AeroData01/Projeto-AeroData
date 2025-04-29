-- Arquivo de apoio, caso você queira criar tabelas como as aqui criadas para a API funcionar.
-- Você precisa executar os comandos no banco de dados para criar as tabelas,
-- ter este arquivo aqui não significa que a tabela em seu BD estará como abaixo!

/*
comandos para mysql server
*/

CREATE DATABASE aerodata;
USE aerodata;

CREATE TABLE Companhia_Aerea (
	id_companhia INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14),
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    sigla_companhia CHAR(3) UNIQUE,
    representante_legal VARCHAR(45)
);

-- Tabela Usuario com senha como SHA-256 (64 caracteres)
CREATE TABLE Usuario (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(45),
    CONSTRAINT chk_cargo
        CHECK (cargo IN ('Gestor de Malha Aérea', 'Diretor de Companhia Aérea')),
    email VARCHAR(50) UNIQUE,
    senha CHAR(64), -- Armazena hash SHA-256
    telefone CHAR (11),
    fk_companhia INT,
    CONSTRAINT fk_companhiaUsuario
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(id_companhia)
);


INSERT INTO Companhia_Aerea (cnpj, razao_social, nome_fantasia, sigla_companhia, representante_legal)
VALUES 
('03420957000130', 'VRG Linhas Aéreas S.A.', 'GOL', 'GLO', 'Celso Ferrer'),
('09490781000156', 'Azul Linhas Aéreas Brasileiras S.A.', 'Azul', 'AZU', 'John Rodgerson'),
('02405658000162', 'TAM Linhas Aéreas S.A.', 'LATAM', 'LAN', 'Jerome Cadier');

SELECT * FROM Companhia_Aerea;