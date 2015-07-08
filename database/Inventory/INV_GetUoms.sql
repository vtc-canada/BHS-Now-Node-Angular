
DROP procedure IF EXISTS `INV_GetUoms`;

DELIMITER $$
CREATE PROCEDURE `INV_GetUoms` ()
BEGIN
		SELECT id
			,uom
		FROM inv_cfg_uom
		WHERE is_deleted = 0;
END$$

DELIMITER ;