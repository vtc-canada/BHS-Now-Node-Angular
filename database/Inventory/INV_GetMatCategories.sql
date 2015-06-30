DROP PROCEDURE if EXISTS `INV_GetMatCategories` ;
DELIMITER $$
CREATE PROCEDURE  `INV_GetMatCategories` () 
BEGIN	
	SELECT id
		,category
	FROM inv_cfg_mat_category
	WHERE is_deleted = 0;
END $$
DELIMITER ;