DROP PROCEDURE if EXISTS `INV_DeleteMatBrand` ;
DELIMITER $$
CREATE PROCEDURE  `INV_DeleteMatBrand` (IN brandID INT) 
BEGIN
		UPDATE inv_cfg_mat_brands 
		SET	is_deleted = 1
		WHERE  id = brandID;
		
END $$
DELIMITER ;