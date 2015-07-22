
DROP procedure IF EXISTS `ODR_GetCfgOrderStates`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetCfgOrderStates` ()
BEGIN
	SELECT `id`, `state`, `last_modified`
FROM `odr_cfg_order_state`
WHERE `is_deleted` = 0;
END
$$

DELIMITER ;

