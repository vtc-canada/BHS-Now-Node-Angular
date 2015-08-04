
DROP procedure IF EXISTS `ODR_GetPickListMappings`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetPickListMappings` (IN entryID INT)
BEGIN
	SELECT 
			inv_cur_lots.id
			,inv_cur_lots.serial_no			
			,inv_cur_lots.quantity
			,inv_cfg_uom.uom
			,inv_cfg_mat_brands.brand
			,inv_cfg_mat_types.type
			,inv_cfg_locations.location
			
	FROM	odr_cur_pick_list_mapping
		INNER JOIN inv_cur_lots ON (inv_cur_lots.id = odr_cur_pick_list_mapping.inv_cur_lots_id)
		INNER JOIN inv_cfg_locations ON (inv_cfg_locations.id = inv_cur_lots.inv_cfg_locations_id)
		INNER JOIN inv_cfg_mat_brands ON (inv_cur_lots.inv_cfg_mat_brands_id = inv_cfg_mat_brands.id)
		INNER JOIN inv_cfg_mat_types ON (inv_cur_lots.inv_cfg_mat_types_id = inv_cfg_mat_types.id)
		INNER JOIN inv_cfg_uom ON (inv_cur_lots.inv_cfg_uom_id = inv_cfg_uom.id)
	WHERE  odr_cur_pick_list_mapping.odr_cur_order_entries_id = entryID
	ORDER BY inv_cur_lots.quantity DESC, inv_cur_lots.inv_cfg_locations_id;
END$$

DELIMITER ;

