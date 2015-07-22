USE `nms`;
DROP procedure IF EXISTS `ODR_GetOrderEntries`;

DELIMITER $$
USE `nms`$$
CREATE DEFINER=`root`@`%` PROCEDURE `ODR_GetOrderEntries`(IN orderId INT(11))
BEGIN
	SELECT odr_cur_order_entries.id
		,odr_cur_order_entries.odr_cur_orders_id
		,odr_cur_order_entries.inv_cfg_mat_types_id
		,odr_cur_order_entries.inv_cfg_mat_brands_id
		,odr_cur_order_entries.quantity
		,odr_cur_order_entries.inv_cfg_uom_id
		,odr_cur_order_entries.last_modified
	FROM  odr_cur_order_entries
	WHERE odr_cur_order_entries.odr_cur_orders_id = orderId;
END$$

DELIMITER ;
