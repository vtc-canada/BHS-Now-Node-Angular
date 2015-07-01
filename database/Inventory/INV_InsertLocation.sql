DROP PROCEDURE if EXISTS `INV_InsertLocation` ;
DELIMITER $$
CREATE PROCEDURE  `INV_InsertLocation` (IN location VARCHAR(256)) 
BEGIN
		INSERT INTO inv_cfg_locations 
			(location) 
		VALUES (location);
END $$
DELIMITER ;