DROP PROCEDURE if EXISTS `INV_InsertMatType` ;
DELIMITER $$
CREATE PROCEDURE  `INV_InsertMatType` (IN brandID INT, IN type VARCHAR(256)) 
BEGIN
		INSERT INTO inv_cfg_mat_types 
			(inv_cfg_mat_brand_id, type) 
		VALUES (brandID,type);
END $$
DELIMITER ;