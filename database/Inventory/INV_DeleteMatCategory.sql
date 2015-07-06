
DROP procedure IF EXISTS `INV_DeleteMatCategory`;

DELIMITER $$
CREATE PROCEDURE `INV_DeleteMatCategory` (IN categoryID INT)
BEGIN

		UPDATE inv_cfg_mat_category 
		SET	is_deleted = 1
		WHERE  id = categoryID;
END$$

DELIMITER ;