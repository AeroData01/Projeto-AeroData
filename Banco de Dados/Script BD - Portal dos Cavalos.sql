CREATE DATABASE portalDosCavalos;
USE portalDosCavalos;

CREATE TABLE usuario (
idUsuario INT PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(45),
email VARCHAR(45),
senha VARCHAR(45)
);

CREATE TABLE historicoQuiz (
idQuiz INT AUTO_INCREMENT,
fkUsuario INT,
dtJogo DATETIME,
acertos INT,
erros INT,
PRIMARY KEY (idQuiz, fkUsuario),
CONSTRAINT fkUsuarioHistorico
	FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);

-- INSERTS
INSERT INTO usuario VALUES
(default, 'Danilo Oliveira','danilo.oliveira@gmail.com', '@1234567'),
(default, 'Luiz Fabiano', 'luizfabiano@outlook.com.br', '7654321@');

INSERT INTO historicoQuiz (fkUsuario, dtJogo, acertos, erros) VALUES 
(1, '2024-11-24 10:00:00', 8, 2),
(2, '2024-11-24 11:00:00', 7, 3);

INSERT INTO historicoQuiz VALUES
(2, 1, current_timestamp(), 5, 3);


-- SELECTS
SELECT * FROM usuario; 

SELECT * FROM historicoQuiz;

SELECT * FROM historicoQuiz 
WHERE fkUsuario = 1;

-- histórico completo dos usuários
SELECT u.nome, h.dtJogo, h.acertos, h.erros 
FROM usuario AS u
JOIN historicoQuiz AS h 
ON u.idUsuario = h.fkUsuario;

-- Ordenado por usuários com mais acertos
SELECT u.nome, SUM(h.acertos) AS total_acertos
FROM usuario AS u
JOIN historicoQuiz AS h 
ON u.idUsuario = h.fkUsuario
GROUP BY u.idUsuario
ORDER BY total_acertos DESC;

-- Média de acertos e erros do usuário
SELECT u.nome, AVG(h.acertos) AS media_acertos, AVG(h.erros) AS media_erros
FROM usuario AS u
JOIN historicoQuiz AS h 
ON u.idUsuario = h.fkUsuario
GROUP BY u.idUsuario;

-- Todos os usuários e seus quiz, mesmo sem ter histórico
SELECT u.nome, h.dtJogo, h.acertos, h.erros
FROM usuario AS u
LEFT JOIN historicoQuiz AS h 
ON u.idUsuario = h.fkUsuario;