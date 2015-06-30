DROP PROCEDURE if EXISTS `INV_UpdateMatType` ;
DELIMITER $$
CREATE PROCEDURE  `INV_UpdateMatType` (IN typeID INT, IN type VARCHAR(256)) 
BEGIN
		UPDATE inv_cfg_mat_types 
		SET	type = type
		WHERE  id = typeID;
		
END $$
DELIMITER ;