DROP PROCEDURE if EXISTS `INV_GetMatBrandsByCategory` ;
DELIMITER $$
CREATE PROCEDURE  `INV_GetMatBrandsByCategory` (IN categoryID INT) 
BEGIN
		SELECT id
			,brand
		FROM inv_cfg_mat_brands
		WHERE inv_cfg_mat_category_id = categoryID
		AND is_deleted = 0;
END $$
DELIMITER ;