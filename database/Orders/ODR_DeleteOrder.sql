DROP procedure IF EXISTS `ODR_DeleteOrder`;

DELIMITER $$

CREATE PROCEDURE `ODR_DeleteOrder` (IN orderID INT, IN userName VARCHAR(256))
BEGIN
	#TODO : history of deleted being tracked in the system logs
	UPDATE odr_cur_orders
	SET is_deleted = 1
	WHERE odr_cur_orders.id = orderID;
	
END
$$