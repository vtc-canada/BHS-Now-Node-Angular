DROP PROCEDURE if EXISTS `INV_GetMatBrands` ;
DELIMITER $$
CREATE PROCEDURE  `INV_GetMatBrands` () 
BEGIN
		SELECT id
			,brand
		FROM inv_cfg_mat_brands
		WHERE is_deleted = 0;
END $$
DELIMITER ;