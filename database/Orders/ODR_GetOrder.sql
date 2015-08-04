
DROP procedure IF EXISTS `ODR_GetOrder`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetOrder` (IN orderId INT(11))
BEGIN
	SELECT odr_cur_orders.id
		,odr_cur_orders.nms_cur_contacts_id
		,odr_cur_orders.odr_cfg_order_state_id
		,CAST(CONCAT_WS('/',(SELECT SUM(inv_cur_lots.quantity) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_orders_id = odr_cur_orders.id)
			,(SELECT SUM(quantity) FROM odr_cur_order_entries where odr_cur_orders_id = odr_cur_orders.id)) AS CHAR) as 'pick_list'
		,(SELECT SUM(inv_cur_lots.price) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_orders_id = odr_cur_orders.id) as 'price'
		,last_modified
		,CASE WHEN (SELECT SUM(inv_cur_lots.quantity) 
			FROM inv_cur_lots
			INNER JOIN odr_cur_pick_list_mapping ON (odr_cur_pick_list_mapping.inv_cur_lots_id = inv_cur_lots.id)
			WHERE odr_cur_orders_id = odr_cur_orders.id) = (SELECT SUM(quantity) FROM odr_cur_order_entries where odr_cur_orders_id = odr_cur_orders.id)
		THEN 1
		ELSE 0 END as 'satisfied'
	FROM	odr_cur_orders
	WHERE  odr_cur_orders.id = orderId
		 AND is_deleted = 0;
END$$

DELIMITER ;

