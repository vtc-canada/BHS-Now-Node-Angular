DROP procedure IF EXISTS `ODR_GetOrderEntries`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetOrderEntries` (IN orderId INT(11))
BEGIN
	SELECT odr_cur_order_entries.id
		,odr_cur_order_entries.odr_cur_orders_id
		,odr_cur_order_entries.inv_cfg_mat_types_id
		,odr_cur_order_entries.inv_cfg_mat_brands_id
		,odr_cur_order_entries.quantity
		,odr_cur_order_entries.inv_cfg_uom_id
		,inv_cfg_mat_types.type AS 'mat_type'
		,inv_cfg_mat_brands.brand AS 'brand_type'
		,odr_cur_order_entries.quantity
		,inv_cfg_uom.uom
		,odr_cur_order_entries.last_modified
		,(SELECT SUM(inv_cur_lots.quantity) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_order_entries_id = odr_cur_order_entries.id) as 'pick_list_quantity'
		,(SELECT SUM(inv_cur_lots.price) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_order_entries_id = odr_cur_order_entries.id) as 'price'
		, CASE WHEN (SELECT SUM(inv_cur_lots.quantity) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_order_entries_id = odr_cur_order_entries.id) = odr_cur_order_entries.quantity THEN 1
		  ELSE 0 END 'satisfied'
	FROM  odr_cur_order_entries
		LEFT JOIN inv_cfg_mat_types ON (odr_cur_order_entries.inv_cfg_mat_types_id = inv_cfg_mat_types.id)
		LEFT JOIN inv_cfg_mat_brands ON (odr_cur_order_entries.inv_cfg_mat_brands_id = inv_cfg_mat_brands.id)
		LEFT JOIN inv_cfg_uom ON (odr_cur_order_entries.inv_cfg_uom_id = inv_cfg_uom.id)
	WHERE odr_cur_order_entries.odr_cur_orders_id = orderId;
END$$

DELIMITER ;
