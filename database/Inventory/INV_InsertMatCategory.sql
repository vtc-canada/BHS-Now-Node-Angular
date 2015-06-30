DROP PROCEDURE if EXISTS `INV_InsertMatCategory` ;
DELIMITER $$
CREATE PROCEDURE  `INV_InsertMatCategory` (IN category VARCHAR(256)) 
BEGIN
		INSERT INTO inv_cfg_mat_category 
			(category) 
		VALUES (category);
END $$
DELIMITER ;