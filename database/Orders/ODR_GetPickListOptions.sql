
DROP procedure IF EXISTS `ODR_GetPickListOptions`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetPickListOptions` (IN entryID INT)
BEGIN
	SELECT 
			inv_cur_lots.id
			,inv_cur_lots.serial_no			
			,inv_cur_lots.quantity
			,inv_cfg_uom.uom
			,inv_cfg_mat_brands.brand
			,inv_cfg_mat_types.type
			,inv_cfg_locations.location
			
	FROM	odr_cur_order_entries
		INNER JOIN inv_cur_lots ON (inv_cur_lots.inv_cfg_mat_types_id = odr_cur_order_entries.inv_cfg_mat_types_id
									AND inv_cur_lots.inv_cfg_mat_brands_id = odr_cur_order_entries.inv_cfg_mat_brands_id)
		INNER JOIN inv_cfg_locations ON (inv_cfg_locations.id = inv_cur_lots.inv_cfg_locations_id)
		INNER JOIN inv_cfg_mat_brands ON (inv_cur_lots.inv_cfg_mat_brands_id = inv_cfg_mat_brands.id)
		INNER JOIN inv_cfg_mat_types ON (inv_cur_lots.inv_cfg_mat_types_id = inv_cfg_mat_types.id)
		INNER JOIN inv_cfg_uom ON (inv_cur_lots.inv_cfg_uom_id = inv_cfg_uom.id)
	WHERE  odr_cur_order_entries.id = entryID
		 AND inv_cur_lots.quantity > 0
		 AND inv_cur_lots.quantity <= odr_cur_order_entries.quantity
		 AND inv_cur_lots.is_deleted = 0
		 AND inv_cur_lots.inv_cfg_lot_status_id = 1 #In Inventory
	ORDER BY inv_cur_lots.quantity DESC, inv_cur_lots.inv_cfg_locations_id;
END$$

DELIMITER ;

