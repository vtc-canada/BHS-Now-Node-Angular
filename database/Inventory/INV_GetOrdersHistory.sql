
DROP procedure IF EXISTS `INV_GetOrdersHistory`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `INV_GetOrdersHistory`(IN orderID INT, IN startTime DATETIME, IN endTime DATETIME)
BEGIN
	SELECT `odr_cur_orders`.`id`,
`odr_cur_orders`.`nms_cur_contacts_id`,
`nms_cur_contacts`.`name`,
`odr_cur_orders`.`odr_cfg_order_state_id`,
`odr_cfg_order_state`.`state`,
DATE_FORMAT(`odr_cur_orders`.`last_modified`, '%Y-%m-%d') AS `last_modified`,
`odr_cur_orders`.`user_name`
 FROM 
odr_cur_orders
INNER JOIN `nms_cur_contacts` ON `nms_cur_contacts`.`id` = `odr_cur_orders`.`nms_cur_contacts_id`
INNER JOIN `odr_cfg_order_state` ON `odr_cfg_order_state`.`id` = `odr_cur_orders`.`odr_cfg_order_state_id`
WHERE `odr_cur_orders`.`is_deleted` = 0
	AND (orderID IS NULL OR (`odr_cur_orders`.`id` = orderID))
	AND (startTime IS NULL OR startTime <= `odr_cur_orders`.`last_modified`)
	AND (endTime IS NULL OR endTime >= `odr_cur_orders`.`last_modified`)
	ORDER BY `odr_cur_orders`.`last_modified`;
END$$

DELIMITER ;

