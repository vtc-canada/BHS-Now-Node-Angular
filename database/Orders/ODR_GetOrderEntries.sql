
DROP procedure IF EXISTS `ODR_GetOrderEntries`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetOrderEntries` (IN orderId INT(11))
BEGIN
	SELECT odr_cur_order_entries.id
		,odr_cur_order_entries.odr_cur_orders_id
		,odr_cur_order_entries.inv_cfg_mat_types_id
		,odr_cur_order_entries.inv_cfg_mat_brands_id
		,odr_cur_order_entries.inv_cfg_uom_id
		,inv_cfg_mat_types.type AS 'mat_type'
		,inv_cfg_mat_brands.brand AS 'brand_type'
		,odr_cur_order_entries.quantity
		,inv_cfg_uom.uom
		,odr_cur_order_entries.last_modified
	FROM  odr_cur_order_entries
		LEFT JOIN inv_cfg_mat_types ON (odr_cur_order_entries.inv_cfg_mat_types_id = inv_cfg_mat_types.id)
		LEFT JOIN inv_cfg_mat_brands ON (odr_cur_order_entries.inv_cfg_mat_brands_id = inv_cfg_mat_brands.id)
		LEFT JOIN inv_cfg_uom ON (odr_cur_order_entries.inv_cfg_uom_id = inv_cfg_uom.id)
	WHERE odr_cur_order_entries.odr_cur_orders_id = orderId;

END
$$

DELIMITER ;

