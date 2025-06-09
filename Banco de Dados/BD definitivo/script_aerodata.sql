
DROP DATABASE if exists aerodata;
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
        CHECK (cargo IN ('gerencial', 'operacional', 'admin')),
    email VARCHAR(50) UNIQUE,
    senha CHAR(64), -- Armazena hash SHA-256
    telefone CHAR(11),
    fk_sigla_companhia CHAR(3),  -- mudar para fk_sigla_companhia
    CONSTRAINT fk_companhiaUsuario
        FOREIGN KEY (fk_sigla_companhia) 
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
    fk_companhiaAlerta CHAR(3),
    CONSTRAINT fk_AlertasVoos
		FOREIGN KEY (fk_voo) 
			REFERENCES Voos(id_voo),
	CONSTRAINT fk_AlertaCompanhia
		FOREIGN KEY (fk_companhiaAlerta) 
			REFERENCES Companhia_Aerea(sigla_companhia)
);

CREATE TABLE LogService (
	id_logs INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME,
    nivel VARCHAR(8),
    mensagem VARCHAR(255)
);

CREATE TABLE Observacao (
id_observacao INT PRIMARY KEY AUTO_INCREMENT,
data_observacao DATE,
descricao VARCHAR(255),
fk_usuario CHAR(11),

CONSTRAINT fk_ObsUsuario
	FOREIGN KEY (fk_usuario)
		REFERENCES Usuario(cpf)
);

CREATE TABLE Feedback (
id_feedback INT PRIMARY KEY AUTO_INCREMENT,
nota int,
informacao varchar(255),
fk_criador char(11),

constraint chk_nota
check (nota >= 0 and nota <= 10),

CONSTRAINT fk_criadorUsuario
	FOREIGN KEY (fk_criador)
		REFERENCES Usuario(cpf)
);

SHOW TABLES;

INSERT INTO Companhia_Aerea (sigla_companhia, cnpj, razao_social, nome_fantasia, representante_legal)
VALUES 
('GLO', '03420957000130', 'VRG Linhas Aéreas S.A.', 'GOL', 'Celso Ferrer'),
('AZU', '09490781000156', 'Azul Linhas Aéreas Brasileiras S.A.', 'Azul', 'John Rodgerson'),
('TAM', '02405658000162', 'TAM Linhas Aéreas S.A.', 'LATAM', 'Jerome Cadier');



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

-- -------------------------------------------------------------------------------------------------------------------------------------------------------------

-- Todos os SELECT's estão referenciando algum cpf pois é a PK do usuário,
-- (cont) logo, esta PK irá ser pega na sessionstorage e deixará as KPI's e Dash's individuais.

-- total de voos
SELECT COUNT(*) AS total_voos
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910';

 -- total de voos atrasados (%)
SELECT 
    ROUND(
        (SUM(CASE 
                WHEN V.situacao_partida LIKE 'Atraso%' 
                  OR V.situacao_chegada LIKE 'Atraso%' 
                THEN 1 ELSE 0 
             END) * 100.0) / COUNT(*), 
        2
    ) AS porcentagem_atrasos
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910';

-- SELECT 
--    U.cpf,
--    COUNT(*) AS total_voos_atrasados,
--    ROUND(
--        COUNT(*) * 100.0 / (
--            SELECT COUNT(*) 
--            FROM Voos V2
--            JOIN Usuario U2 ON V2.fk_companhia = U2.fk_sigla_companhia
--            WHERE U2.cpf = U.cpf
--        ), 
--        2
--    ) AS porcentagem_voos_atrasados
-- FROM Voos V
-- JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
-- WHERE U.cargo = 'gerencial'
--  AND (V.situacao_partida LIKE 'Atraso%' OR V.situacao_chegada LIKE 'Atraso%')
-- GROUP BY U.cpf;

  
  -- total de voos cancelados
  SELECT COUNT(*) AS total_voos_cancelados
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910'
  AND V.situacao_voo = 'CANCELADO';
  
   -- total de voos cancelados (%)
  SELECT 
    ROUND(
        (SUM(CASE 
                WHEN V.situacao_voo = 'CANCELADO' 
                THEN 1 ELSE 0 
             END) * 100.0) / COUNT(*), 
        2
    ) AS porcentagem_cancelados
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910';

-- SELECT 
--    U.cpf,
--    COUNT(*) AS total_voos_cancelados,
--    ROUND(
--        COUNT(*) * 100.0 / (
--            SELECT COUNT(*) 
--            FROM Voos V2
--            JOIN Usuario U2 ON V2.fk_companhia = U2.fk_sigla_companhia
--            WHERE U2.cpf = U.cpf
--        ),
--        2
--    ) AS porcentagem_voos_cancelados
-- FROM Voos V
-- JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
-- WHERE U.cargo = 'gerencial'
--  AND V.situacao_voo = 'CANCELADO'
-- GROUP BY U.cpf;

  
  -- rota com mais atrasos
  SELECT 
    V.sigla_aeroporto_partida,
    V.sigla_aeroporto_destino,
    COUNT(*) AS total_atrasos
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910'
  AND (
    V.situacao_partida LIKE 'Atraso%' OR 
    V.situacao_chegada LIKE 'Atraso%'
  )
GROUP BY V.sigla_aeroporto_partida, V.sigla_aeroporto_destino
ORDER BY total_atrasos DESC
LIMIT 1;

-- rota com mais cancelamentos
SELECT 
    V.sigla_aeroporto_partida,
    V.sigla_aeroporto_destino,
    COUNT(*) AS total_cancelamentos
FROM Voos V
JOIN Usuario U ON V.fk_companhia = U.fk_sigla_companhia
WHERE U.cpf = '12345678910'
  AND V.situacao_voo = 'CANCELADO'
GROUP BY V.sigla_aeroporto_partida, V.sigla_aeroporto_destino
ORDER BY total_cancelamentos DESC
LIMIT 1;

-- top 3 companhias com mais atrasos nos anos de 23 e 24 (%)
SELECT 
    C.nome_fantasia AS companhia,
    COUNT(CASE 
        WHEN V.situacao_partida LIKE 'Atraso%' 
          OR V.situacao_chegada LIKE 'Atraso%' 
        THEN 1 
        END) AS total_voos_atrasados,
    
    COUNT(*) AS total_voos,
    
    ROUND(
        COUNT(CASE 
            WHEN V.situacao_partida LIKE 'Atraso%' 
              OR V.situacao_chegada LIKE 'Atraso%' 
            THEN 1 
        END) * 100.0 / COUNT(*), 
        2
    ) AS porcentagem_atrasos
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
WHERE YEAR(V.dia_referencia) IN (2023, 2024)
GROUP BY C.nome_fantasia
HAVING total_voos > 0
ORDER BY porcentagem_atrasos DESC
LIMIT 3;

-- cancelamentos por mês
SELECT 
    C.nome_fantasia AS companhia,
    YEAR(V.dia_referencia) AS ano,
    MONTH(V.dia_referencia) AS mes,
    COUNT(*) AS total_voos_cancelados
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
WHERE V.situacao_voo = 'CANCELADO'
GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
ORDER BY ano, mes, companhia;


-- atrasos por mês
SELECT 
    C.nome_fantasia AS companhia,
    YEAR(V.dia_referencia) AS ano,
    MONTH(V.dia_referencia) AS mes,
    COUNT(*) AS total_voos_atrasados
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
WHERE V.situacao_partida LIKE 'Atraso%' 
   OR V.situacao_chegada LIKE 'Atraso%'
GROUP BY C.nome_fantasia, YEAR(V.dia_referencia), MONTH(V.dia_referencia)
ORDER BY ano, mes, companhia;

-- total de voos por companhia
SELECT 
    C.nome_fantasia AS companhia,
    COUNT(*) AS total_voos
FROM Voos V
JOIN Companhia_Aerea C ON V.fk_companhia = C.sigla_companhia
GROUP BY C.nome_fantasia
ORDER BY total_voos DESC;

---------------------------------------------------------------------------------------------------------------------------------------------
-- Pontualidade média por companhia
SELECT 
    fk_companhia AS companhia,
    COUNT(*) AS total_voos,
    SUM(CASE 
            WHEN situacao_partida IN ('Pontual', 'Antecipado') THEN 1 
            ELSE 0 
        END) AS voos_pontuais,
    ROUND(
        (SUM(CASE 
                WHEN situacao_partida IN ('Pontual', 'Antecipado') THEN 1 
                ELSE 0 
             END) * 100.0) / COUNT(*), 2
    ) AS percentual_pontualidade
FROM Voos
WHERE situacao_voo = 'REALIZADO'
GROUP BY fk_companhia;

-- tempo médio de atraso por ano
SELECT 
    fk_companhia AS companhia,
    YEAR(dia_referencia) AS ano,
    ROUND(AVG(CASE 
        WHEN situacao_partida = 'Atraso 30-60' THEN 45
        WHEN situacao_partida = 'Atraso 60-120' THEN 90
        WHEN situacao_partida = 'Atraso > 120' THEN 150
        ELSE NULL
    END), 2) AS tempo_medio_atraso_min
FROM Voos
WHERE situacao_partida LIKE 'Atraso%'
GROUP BY fk_companhia, YEAR(dia_referencia);

-- total de atrasos por companhia
SELECT 
    c.nome_fantasia AS companhia,
    v.sigla_aeroporto_partida,
    v.sigla_aeroporto_destino,
    COUNT(*) AS total_atrasos
FROM Voos v
JOIN Companhia_Aerea c ON v.fk_companhia = c.sigla_companhia
WHERE v.situacao_partida LIKE 'Atraso%'
GROUP BY 
    c.nome_fantasia, 
    v.sigla_aeroporto_partida, 
    v.sigla_aeroporto_destino
ORDER BY 
    c.nome_fantasia, 
    v.sigla_aeroporto_partida, 
    v.sigla_aeroporto_destino;



-- total de cancelamentos por companhia
SELECT 
    c.nome_fantasia AS companhia,
    v.sigla_aeroporto_partida,
    v.sigla_aeroporto_destino,
    COUNT(*) AS total_cancelamentos
FROM Voos v
JOIN Companhia_Aerea c ON v.fk_companhia = c.sigla_companhia
WHERE v.situacao_voo = 'CANCELADO'
GROUP BY 
    c.nome_fantasia, 
    v.sigla_aeroporto_partida, 
    v.sigla_aeroporto_destino
ORDER BY 
    c.nome_fantasia, 
    v.sigla_aeroporto_partida, 
    v.sigla_aeroporto_destino;

