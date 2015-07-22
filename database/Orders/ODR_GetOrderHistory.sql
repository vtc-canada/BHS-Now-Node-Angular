
DROP procedure IF EXISTS `ODR_GetOrdersHistory`;

DELIMITER $$
CREATE  PROCEDURE `ODR_GetOrdersHistory`(IN orderID INT, IN startTime DATETIME, IN endTime DATETIME, IN orderType INT)
BEGIN
		SELECT odr_cur_orders.id
			,odr_cur_orders.order_no
			,odr_cur_orders.nms_cur_contacts_id
			,nms_cur_contacts.name
			,odr_cur_orders.odr_cfg_order_state_id
			,odr_cfg_order_state.state
			,DATE_FORMAT(odr_cur_orders.last_modified, '%Y-%m-%d') AS last_modified
			,odr_cur_orders.user_name
			,odr_cfg_order_types.type as 'order_type'
		FROM odr_cur_orders
			INNER JOIN nms_cur_contacts ON (nms_cur_contacts.id = odr_cur_orders.nms_cur_contacts_id)
			INNER JOIN odr_cfg_order_state ON (odr_cfg_order_state.id = odr_cur_orders.odr_cfg_order_state_id)
			INNER JOIN odr_cfg_order_types ON (odr_cfg_order_types.id = odr_cur_orders.odr_cfg_order_types_id)
		WHERE odr_cur_orders.is_deleted = 0
			AND (orderID IS NULL OR (odr_cur_orders.id = orderID))
			AND (startTime IS NULL OR startTime <= odr_cur_orders.last_modified)
			AND (endTime IS NULL OR endTime >= odr_cur_orders.last_modified)
			AND (orderType IS NULL or odr_cur_orders.odr_cfg_order_types_id = orderType)
			ORDER BY odr_cur_orders.last_modified;
END$$

DELIMITER ;

