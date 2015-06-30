DROP PROCEDURE if EXISTS `INV_GetMatTypesByBrand` ;
DELIMITER $$
CREATE PROCEDURE  `INV_GetMatTypesByBrand` (IN brandID INT) 
BEGIN
	SELECT id	
		,type
	FROM inv_cfg_mat_types
	WHERE inv_cfg_mat_brand_id = brandID
	AND is_deleted = 0;
END $$
DELIMITER ;