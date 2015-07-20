
DROP procedure IF EXISTS `INV_GetLotStatus`;

DELIMITER $$
CREATE PROCEDURE `INV_GetLotStatus` ()
BEGIN
	SELECT id
		 ,status
	FROM inv_cfg_lot_status
	WHERE is_deleted = 0;
END$$

DELIMITER ;

