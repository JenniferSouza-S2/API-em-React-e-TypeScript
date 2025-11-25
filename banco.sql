DROP TABLE IF EXISTS estudante;

CREATE TABLE estudante (
  id INT AUTO_INCREMENT NOT NULL,
  nome VARCHAR(20) NULL,
  email VARCHAR(100) NULL,
  PRIMARY KEY (id)
);

INSERT INTO estudante (nome, email) VALUES
('Bruno', NULL),
('Vivian', NULL),
('Marco', NULL);

SELECT * FROM estudante;
