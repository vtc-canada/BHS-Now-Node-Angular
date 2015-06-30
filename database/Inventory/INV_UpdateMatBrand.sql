DROP PROCEDURE if EXISTS `INV_UpdateMatBrand` ;
DELIMITER $$
CREATE PROCEDURE  `INV_UpdateMatBrand` (IN brandID INT, IN brand VARCHAR(256)) 
BEGIN
		UPDATE inv_cfg_mat_brands 
		SET	brand = brand
		WHERE  id = brandID;
		
END $$
DELIMITER ;