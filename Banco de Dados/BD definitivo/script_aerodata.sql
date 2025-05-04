-- DROP DATABASE aerodata;
CREATE DATABASE aerodata;
USE aerodata;

-- Tabela de companhias aéreas
CREATE TABLE Companhia_Aerea (
    id_companhia INT PRIMARY KEY AUTO_INCREMENT,
    cnpj CHAR(14),
    razao_social VARCHAR(45),
    nome_fantasia VARCHAR(45),
    sigla_companhia CHAR(3) UNIQUE,
    representante_legal VARCHAR(45)
) ENGINE=InnoDB;

-- Tabela de usuários, agora relacionando pela sigla_companhia (CHAR(3))
CREATE TABLE Usuario (
    cpf CHAR(11) PRIMARY KEY,
    nome VARCHAR(100),
    cargo VARCHAR(45),
    CONSTRAINT chk_cargo
        CHECK (cargo IN ('gerencial', 'operacional')),
    email VARCHAR(50) UNIQUE,
    senha CHAR(64),       -- Armazena hash SHA-256
    telefone CHAR(11),
    fk_companhia CHAR(3), -- altera para CHAR(3)
    CONSTRAINT fk_companhiaUsuario
        FOREIGN KEY (fk_companhia)
            REFERENCES Companhia_Aerea(sigla_companhia)
) ENGINE=InnoDB;

-- Tabela de voos, também relacionando pela sigla_companhia
CREATE TABLE Voos (
    id_Voo INT PRIMARY KEY AUTO_INCREMENT,
    numero_voo VARCHAR(10),
    dia_referencia DATE,
    aeroporto_partida VARCHAR(255),
    sigla_aeroporto_partida CHAR(3),
    aeroporto_destino VARCHAR(255),
    sigla_aeroporto_destino CHAR(3),
    situacao_voo VARCHAR(45),
    situacao_partida VARCHAR(45),
    situacao_chegada VARCHAR(45),
    fk_companhia CHAR(3), -- altera para CHAR(3)
    CONSTRAINT fk_companhiaVoos
        FOREIGN KEY (fk_companhia)
            REFERENCES Companhia_Aerea(sigla_companhia)
) ENGINE=InnoDB;

-- Tabela de alertas
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
            REFERENCES Voos(id_Voo)
) ENGINE=InnoDB;

SHOW TABLES;

-- Dados de exemplo
INSERT INTO Companhia_Aerea (cnpj, razao_social, nome_fantasia, sigla_companhia, representante_legal)
VALUES 
    ('03420957000130', 'VRG Linhas Aéreas S.A.', 'GOL',   'GLO', 'Celso Ferrer'),
    ('09490781000156', 'Azul Linhas Aéreas Brasileiras S.A.', 'Azul', 'AZU', 'John Rodgerson'),
    ('02405658000162', 'TAM Linhas Aéreas S.A.', 'LATAM', 'LAN', 'Jerome Cadier');

SELECT * FROM Companhia_Aerea;
SELECT * FROM Usuario;
SELECT * FROM Voos;

-- Contagem de voos por companhia
SELECT 
    v.fk_companhia,
    COUNT(*) AS total_voos
FROM Voos v
GROUP BY v.fk_companhia;

-- Truncate Voos sem violar FK
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Voos;
SET FOREIGN_KEY_CHECKS = 1;

-- Triggers para hash de senha (opcional)
-- DELIMITER //
-- CREATE TRIGGER trg_hash_senha_insert
-- BEFORE INSERT ON Usuario
-- FOR EACH ROW
-- BEGIN
--   SET NEW.senha = SHA2(NEW.senha, 256);
-- END;//
--
-- CREATE TRIGGER trg_hash_senha_update
-- BEFORE UPDATE ON Usuario
-- FOR EACH ROW
-- BEGIN
--   SET NEW.senha = SHA2(NEW.senha, 256);
-- END;//
-- DELIMITER ;
