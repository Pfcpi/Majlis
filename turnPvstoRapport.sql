DELETE FROM Temoigne;
DELETE FROM Temoin;
DELETE FROM Commission_Presente;
DELETE FROM Conseil_Discipline;
DELETE FROM Sanction;
DELETE FROM PV;

UPDATE Rapport
SET est_traite = 0;