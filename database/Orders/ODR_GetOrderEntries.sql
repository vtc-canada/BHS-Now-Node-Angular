
DROP procedure IF EXISTS `ODR_GetOrderEntries`;

DELIMITER $$
CREATE PROCEDURE `ODR_GetOrderEntries` (IN orderId INT(11))
BEGIN
SELECT `id`,
`odr_cur_orders_id`,
`inv_cfg_mat_types_id`,
`inv_cfg_mat_brands_id`,
`quantity`,
`price`,
`inv_cfg_uom_id`,
`last_modified`
FROM 
`odr_cur_order_entries`
WHERE `odr_cur_orders_id` = orderId;
END
$$

DELIMITER ;

