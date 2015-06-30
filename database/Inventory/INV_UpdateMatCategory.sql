DROP PROCEDURE if EXISTS `INV_UpdateMatCategory` ;
DELIMITER $$
CREATE PROCEDURE  `INV_UpdateMatCategory` (IN categoryID INT, IN category VARCHAR(256)) 
BEGIN
		UPDATE inv_cfg_mat_category
		SET	category = category
		WHERE  id = categoryID;
		
END $$
DELIMITER ;