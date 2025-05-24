-- DROP DATABASE aerodata;
CREATE DATABASE IF NOT EXISTS aerodata;
USE aerodata;

CREATE TABLE Companhia_Aerea (
	sigla_companhia CHAR(3) PRIMARY KEY,
    cnpj CHAR(14),
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    representante_legal VARCHAR(45)
);

CREATE TABLE Usuario (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(45),
    CONSTRAINT chk_cargo
        CHECK (cargo IN ('gerencial', 'operacional')),
    email VARCHAR(50) UNIQUE,
    senha CHAR(64), -- Armazena hash SHA-256
    telefone CHAR(11),
    fk_companhia CHAR(3),  -- mudar para fk_sigla_companhia
    CONSTRAINT fk_companhiaUsuario
        FOREIGN KEY (fk_companhia) 
            REFERENCES Companhia_Aerea(sigla_companhia)
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
	fk_companhia CHAR(3),
    CONSTRAINT fk_companhiaVoos
		FOREIGN KEY (fk_companhia) 
			REFERENCES Companhia_Aerea(sigla_companhia)
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

CREATE TABLE LogService (
	id_logs INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    nivel VARCHAR(8),
    mensagem VARCHAR(255)
);

SHOW TABLES;

INSERT INTO Companhia_Aerea (sigla_companhia, cnpj, razao_social, nome_fantasia, representante_legal)
VALUES 
('GLO', '03420957000130', 'VRG Linhas Aéreas S.A.', 'GOL', 'Celso Ferrer'),
('AZU', '09490781000156', 'Azul Linhas Aéreas Brasileiras S.A.', 'Azul', 'John Rodgerson'),
('LAN', '02405658000162', 'TAM Linhas Aéreas S.A.', 'LATAM', 'Jerome Cadier');



SELECT * FROM Companhia_Aerea;
SELECT * FROM Usuario;
SELECT * FROM Voos;

SHOW COLUMNS FROM Voos LIKE 'sigla_aeroporto_partida';

SELECT 
  v.fk_companhia,
  COUNT(*) AS total_voos
FROM Voos v
GROUP BY v.fk_companhia;




-- desabilita validação de FK
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Voos;

-- habilita novamente
SET FOREIGN_KEY_CHECKS = 1;




-- -----------------------------------------------------------------------------------------------------------------------------

-- 1. Taxa de voos atrasados (em %)
SELECT
    ROUND(
        (SELECT COUNT(DISTINCT fk_voo)
         FROM Alertas
         WHERE tipo = 'Voo atrasado') * 100.0
      / (SELECT COUNT(*) FROM Voos)
    , 2) AS taxa_voos_atrasados;

-- 2. Taxa de voos cancelados (em %)
SELECT
    ROUND(
        (SELECT COUNT(DISTINCT fk_voo)
         FROM Alertas
         WHERE tipo = 'Voo cancelado') * 100.0
      / (SELECT COUNT(*) FROM Voos)
    , 2) AS taxa_voos_cancelados;

-- 3. Rotas com mais atrasos
-- Agrupa por par origem–destino e conta quantos voos diferentes tiveram atrasos
SELECT
    v.sigla_aeroporto_partida AS origem,
    v.sigla_aeroporto_destino AS destino,
    COUNT(DISTINCT a.fk_voo)         AS qtd_voos_atrasados
FROM Alertas a
JOIN Voos    v ON v.id_Voo = a.fk_voo
WHERE a.tipo = 'Voo atrasado'
GROUP BY
    v.sigla_aeroporto_partida,
    v.sigla_aeroporto_destino
ORDER BY qtd_voos_atrasados DESC
LIMIT 10;  -- ajustável conforme necessidade

-- 4. Rotas com mais cancelamentos
-- Mesmo raciocínio, filtrando por cancelamentos
SELECT
    v.sigla_aeroporto_partida AS origem,
    v.sigla_aeroporto_destino AS destino,
    COUNT(DISTINCT a.fk_voo)         AS qtd_voos_cancelados
FROM Alertas a
JOIN Voos    v ON v.id_Voo = a.fk_voo
WHERE a.tipo = 'Voo cancelado'
GROUP BY
    v.sigla_aeroporto_partida,
    v.sigla_aeroporto_destino
ORDER BY qtd_voos_cancelados DESC
LIMIT 10;


-- TRIGGER para hashear senha no INSERT
-- DELIMITER //

-- CREATE TRIGGER trg_hash_senha_insert
-- BEFORE INSERT ON Usuario
-- FOR EACH ROW
-- BEGIN
   -- SET NEW.senha = SHA2(NEW.senha, 256);
-- END;
-- //

-- DELIMITER ;

-- TRIGGER para hashear senha no UPDATE
-- DELIMITER //

-- CREATE TRIGGER trg_hash_senha_update
-- BEFORE UPDATE ON Usuario
-- FOR EACH ROW
-- BEGIN
   -- SET NEW.senha = SHA2(NEW.senha, 256);
-- END;
-- //

-- DELIMITER ;