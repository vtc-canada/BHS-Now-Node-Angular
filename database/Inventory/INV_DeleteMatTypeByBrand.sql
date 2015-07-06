DROP procedure IF EXISTS `INV_DeleteMatTypeByBrand`;

DELIMITER $$
USE `nms`$$
CREATE PROCEDURE `INV_DeleteMatTypeByBrand` (IN brandID INT)
BEGIN
		UPDATE inv_cfg_mat_types 
		SET	is_deleted = 1
		WHERE  inv_cfg_mat_brand_id = brandID;
END$$

DELIMITER ;

