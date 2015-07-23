DROP procedure IF EXISTS `ODR_UpdateOrder`;

DELIMITER $$

CREATE PROCEDURE `ODR_UpdateOrder` (IN orderID INT,IN contactID INT, IN userName VARCHAR(256))
BEGIN
	#TODO : history of deleted being tracked in the system logs
	UPDATE odr_cur_orders
		SET nms_cur_contacts_id = contactID
	WHERE odr_cur_orders.id = orderID;
	
END
$$