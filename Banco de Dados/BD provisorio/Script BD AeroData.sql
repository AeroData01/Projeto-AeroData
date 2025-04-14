CREATE DATABASE AeroData;
USE AeroData;
-- drop database AeroData;

CREATE TABLE Companhia_Aerea (
    cnpj CHAR(14) PRIMARY KEY,
    nome_fantasia VARCHAR(45),
    sigla_companhia CHAR(3) UNIQUE
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
    FOREIGN KEY (fk_companhia) REFERENCES Companhia_Aerea(cnpj)
);

CREATE TABLE Rota (
    id_rota INT PRIMARY KEY AUTO_INCREMENT,
    aeroporto_origem VARCHAR(100),
    sigla_aeroporto_origem CHAR(4),
    aeroporto_destino VARCHAR(100),
    sigla_aeroporto_destino CHAR(4)
);

CREATE TABLE Voos (
    numero_voo CHAR(4) PRIMARY KEY,
    dia_referencia DATE,
    
    situacao_voo VARCHAR(20),
    CONSTRAINT chk_situacao_voo
        CHECK (situacao_voo IN ('REALIZADO', 'CANCELADO')),
    
    situacao_partida VARCHAR(20),
    CONSTRAINT chk_situacao_partida
        CHECK (situacao_partida IS NULL OR situacao_partida IN ('Atraso 30-60', 'Atraso 60-120', 'Atraso 120-240', 'Atraso > 240')),
    
    situacao_chegada VARCHAR(20),
    CONSTRAINT chk_situacao_chegada
        CHECK (situacao_chegada IS NULL OR situacao_chegada IN ('Atraso 120-240', 'Atraso > 240')),
    
    fk_companhia CHAR(14),
    fk_percurso INT,
    FOREIGN KEY (fk_companhia) REFERENCES Companhia_Aerea(cnpj),
    FOREIGN KEY (fk_percurso) REFERENCES Rota(id_rota)
);

CREATE TABLE Alertas (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    tipo VARCHAR(30),
    CONSTRAINT chk_tipo
		CHECK (tipo in ('Voo cancelado', 'Voo atrasado')),
    mensagem VARCHAR(100),
    fk_voo CHAR(4),
    FOREIGN KEY (fk_voo) REFERENCES Voos(numero_voo)
);

-- Inserts e selects por IA

INSERT INTO Companhia_Aerea (cnpj, nome_fantasia, sigla_companhia)
VALUES 
('12345678000100', 'VoaMais Linhas Aéreas', 'VMX'),
('98765432000199', 'SkyHigh Brasil', 'SHB');

INSERT INTO Usuario (cpf, nome, cargo, email, senha, fk_companhia)
VALUES 
('11111111111', 'Angela Costa', 'Gestor de Malha Aérea', 'angela@voamais.com', 'senha123', '12345678000100'),
('22222222222', 'Vagner Silva', 'Diretor de Companhia Aérea', 'vagner@skyhigh.com', 'senha456', '98765432000199');

INSERT INTO Rota (aeroporto_origem, sigla_aeroporto_origem, aeroporto_destino, sigla_aeroporto_destino)
VALUES 
('Aeroporto de Guarulhos', 'GRU', 'Aeroporto do Galeão', 'GIG'),
('Aeroporto de Confins', 'CNF', 'Aeroporto de Brasília', 'BSB');

INSERT INTO Voos (numero_voo, dia_referencia, situacao_voo, situacao_partida, situacao_chegada, fk_companhia, fk_percurso)
VALUES 
('V001', '2025-04-10', 'REALIZADO', 'Atraso 30-60', 'Atraso 120-240', '12345678000100', 1),
('S002', '2025-04-11', 'CANCELADO', NULL, NULL, '98765432000199', 2);

INSERT INTO Alertas (id_alerta, data_hora, tipo, mensagem, fk_voo)
VALUES 
(1, '2025-04-10 08:30:00', 'Voo atrasado', 'Voo V001 teve atraso na partida.', 'V001'),
(2, '2025-04-11 09:00:00', 'Voo cancelado', 'Voo S002 foi cancelado por condições climáticas.', 'S002');



-- Listar todos os voos com suas respectivas companhias e situação
SELECT 
    V.numero_voo,
    V.dia_referencia,
    V.situacao_voo,
    V.situacao_partida,
    V.situacao_chegada,
    C.nome_fantasia AS companhia
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.cnpj;

-- Ver todos os usuários e suas respectivas companhias
SELECT 
    U.nome,
    U.cargo,
    U.email,
    C.nome_fantasia AS companhia
FROM Usuario U
JOIN Companhia_Aerea C ON U.fk_companhia = C.cnpj;

-- Voos que sofreram atraso na chegada
SELECT 
    numero_voo,
    situacao_chegada
FROM Voos
WHERE situacao_chegada IS NOT NULL;

-- Voos cancelados
SELECT 
    numero_voo,
    dia_referencia,
    situacao_voo
FROM Voos
WHERE situacao_voo = 'CANCELADO';

-- Rotas com origem e destino
SELECT 
    id_rota,
    CONCAT(aeroporto_origem, ' (', sigla_aeroporto_origem, ')') AS origem,
    CONCAT(aeroporto_destino, ' (', sigla_aeroporto_destino, ')') AS destino
FROM Rota;

--  Contar quantos voos cada companhia já realizou (ou cancelou)
SELECT 
    C.nome_fantasia,
    COUNT(V.numero_voo) AS total_voos
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.cnpj
GROUP BY C.nome_fantasia;

-- Mostrar os alertas com detalhes do voo correspondente
SELECT 
    A.id_alerta,
    A.data_hora,
    A.tipo,
    A.mensagem,
    V.numero_voo,
    V.dia_referencia,
    V.situacao_voo
FROM Alertas A
JOIN Voos V ON A.fk_voo = V.numero_voo;
