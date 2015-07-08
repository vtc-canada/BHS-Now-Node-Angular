DROP procedure IF EXISTS `INV_GetMatTypesInBrands`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `INV_GetMatTypesInBrands`(IN brandIDs VARCHAR(255))
BEGIN
	SELECT id	
		,type
	FROM inv_cfg_mat_types
	WHERE FIND_IN_SET(inv_cfg_mat_brand_id, brandIDs)
	AND is_deleted = 0;
END$$

DELIMITER ;

