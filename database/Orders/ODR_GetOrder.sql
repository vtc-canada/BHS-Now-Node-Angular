
DROP procedure IF EXISTS `ODR_GetOrder`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetOrder` (IN orderId INT(11))
BEGIN
	SELECT odr_cur_orders.id
		,odr_cur_orders.nms_cur_contacts_id
		,odr_cur_orders.odr_cfg_order_state_id
		,last_modified
	FROM	odr_cur_orders
	WHERE  odr_cur_orders.id = orderId
		 AND is_deleted = 0;
END$$

DELIMITER ;

