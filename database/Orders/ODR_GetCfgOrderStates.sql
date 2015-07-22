
DROP procedure IF EXISTS `ODR_GetCfgOrderStates`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetCfgOrderStates` ()
BEGIN
	SELECT odr_cfg_order_state.id
		,odr_cfg_order_state.state
		,odr_cfg_order_state.last_modified
	FROM odr_cfg_order_state
	WHERE odr_cfg_order_state.is_deleted = 0;
END
$$

DELIMITER ;

