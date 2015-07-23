DROP procedure IF EXISTS `ODR_DeleteOrderEntry`;

DELIMITER $$

CREATE PROCEDURE `ODR_DeleteOrderEntry` (IN entryID INT, IN userName VARCHAR(256))
BEGIN
	#TODO : history of deleted being tracked in the system logs
		DELETE FROM odr_cur_order_entries WHERE odr_cur_order_entries.id = entryid;
END
$$