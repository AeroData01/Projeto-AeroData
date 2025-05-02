-- DROP DATABASE aerodata;
USE aerodata;
SHOW TABLES;

CREATE TABLE Companhia_Aerea (
	id_companhia INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14),
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
    senha CHAR(64), -- Armazena hash SHA-256
    telefone CHAR (11),
    fk_companhia INT,
    CONSTRAINT fk_companhiaUsuario
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(id_companhia)
);

CREATE TABLE Voos (
	id_Voo INT PRIMARY KEY AUTO_INCREMENT,
	numero_voo VARCHAR (10),
	dia_referencia DATE,
	aeroporto_partida VARCHAR (255),
	sigla_aeroporto_partida CHAR (3),
	aeroporto_destino VARCHAR (255),
	sigla_aeroporto_destino CHAR (3),
	situacao_voo VARCHAR (45),
	situacao_partida VARCHAR (45),
	situacao_chegada VARCHAR (45),
	fk_companhia INT,
    CONSTRAINT fk_companhiaVoos
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(id_companhia)
);

CREATE TABLE Alertas (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    tipo VARCHAR(30),
    CONSTRAINT chk_tipo
		CHECK (tipo IN ('Voo cancelado', 'Voo atrasado')),
    mensagem VARCHAR(100),
    fk_voo INT,
    CONSTRAINT fk_AlertasVoos
		FOREIGN KEY (fk_voo) 
			REFERENCES Voos(id_voo)
);


SHOW TABLES;

INSERT INTO Companhia_Aerea (cnpj, razao_social, nome_fantasia, sigla_companhia, representante_legal)
VALUES 
('03420957000130', 'VRG Linhas Aéreas S.A.', 'GOL', 'GLO', 'Celso Ferrer'),
('09490781000156', 'Azul Linhas Aéreas Brasileiras S.A.', 'Azul', 'AZU', 'John Rodgerson'),
('02405658000162', 'TAM Linhas Aéreas S.A.', 'LATAM', 'LAN', 'Jerome Cadier');

SELECT * FROM Companhia_Aerea;

SHOW COLUMNS FROM Voos LIKE 'sigla_aeroporto_partida';

SELECT * FROM Voos;


-- desabilita validação de FK
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Voos;

-- habilita novamente
SET FOREIGN_KEY_CHECKS = 1;


SELECT 
  v.fk_companhia,
  COUNT(*) AS total_voos
FROM Voos v
GROUP BY v.fk_companhia;



-- TRIGGER para hashear senha no INSERT
-- DELIMITER //

-- CREATE TRIGGER trg_hash_senha_insert
-- BEFORE INSERT ON Usuario
-- FOR EACH ROW
-- BEGIN
--    SET NEW.senha = SHA2(NEW.senha, 256);
-- END;
-- //

-- DELIMITER ;

-- TRIGGER para hashear senha no UPDATE
-- DELIMITER //

-- CREATE TRIGGER trg_hash_senha_update
--  BEFORE UPDATE ON Usuario
-- FOR EACH ROW
-- BEGIN
--    SET NEW.senha = SHA2(NEW.senha, 256);
-- END;
-- //

-- DELIMITER ;



