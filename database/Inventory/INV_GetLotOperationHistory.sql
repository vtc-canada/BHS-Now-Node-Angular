
DROP procedure IF EXISTS `INV_GetLotOperationHistory`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `INV_GetLotOperationHistory`(IN lotID INT, IN startTime DATETIME, IN endTime DATETIME)
BEGIN
	SELECT inv_cur_lots.id as 'lotID'
		,inv_cur_lots.serial_no
		,inv_cfg_lot_operations.operation
		,inv_cfg_custom_props.property as 'custom_property'
		,(CASE WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 1 THEN inv_cur_lot_operations.prev_quantity
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 2 THEN 'prev_status'
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 3 THEN prev_location.location
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 6 THEN inv_cur_lot_operations.prev_custom_prop_val
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 7 THEN inv_cur_lot_operations.prev_price
		END) AS 'prev_value'
		,(CASE WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 1 THEN inv_cur_lot_operations.cur_quantity
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 2 THEN 'cur_status'
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 3 THEN cur_location.location
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 6 THEN inv_cur_lot_operations.cur_custom_prop_val
			WHEN inv_cur_lot_operations.inv_cfg_lot_operations_id = 7 THEN inv_cur_lot_operations.cur_price
		END) AS 'cur_value'
		,inv_cur_lot_operations.user_name AS `user_name` 
		,DATE_FORMAT(inv_cur_lot_operations.last_modified, "%Y-%m-%d") AS `last_modified`
	FROM inv_cur_lot_operations
	INNER JOIN inv_cur_lots ON (inv_cur_lot_operations.inv_cur_lots_id = inv_cur_lots.id)
	INNER JOIN inv_cfg_lot_operations ON (inv_cur_lot_operations.inv_cfg_lot_operations_id = inv_cfg_lot_operations.id)
	LEFT JOIN inv_cfg_locations AS prev_location ON (inv_cur_lot_operations.prev_location_id = prev_location.id)
	LEFT JOIN inv_cfg_locations AS cur_location ON (inv_cur_lot_operations.cur_location_id = cur_location.id)
	LEFT JOIN inv_cfg_custom_props ON (inv_cfg_custom_props.id = inv_cur_lot_operations.inv_cfg_custom_props_id)
	WHERE (lotID IS NULL OR (inv_cur_lot_operations.inv_cur_lots_id = lotID))
	AND (startTime IS NULL OR startTime <= inv_cur_lot_operations.last_modified)
	AND (endTime IS NULL OR endTime >= inv_cur_lot_operations.last_modified)
	ORDER BY inv_cur_lot_operations.last_modified;

END$$

DELIMITER ;

