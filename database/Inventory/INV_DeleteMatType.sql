DROP PROCEDURE if EXISTS `INV_DeleteMatType` ;
DELIMITER $$
CREATE PROCEDURE  `INV_DeleteMatType` (IN typeID INT) 
BEGIN
		UPDATE inv_cfg_mat_types 
		SET	is_deleted = 1
		WHERE  id = typeID;
		
END $$
DELIMITER ;