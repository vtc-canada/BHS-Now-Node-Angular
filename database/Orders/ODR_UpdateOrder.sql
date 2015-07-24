DROP procedure IF EXISTS `ODR_UpdateOrder`;

DELIMITER $$

CREATE PROCEDURE `ODR_UpdateOrder` (IN orderID INT,IN contactID INT, IN userName VARCHAR(256))
BEGIN
	DECLARE exit handler for sqlexception
		  BEGIN
			SELECT 'An error has occurred, operation rollbacked and the stored procedure was terminated' 
		  ROLLBACK;
		END;

		DECLARE exit handler for sqlwarning
		 BEGIN
			SELECT 'An warning has occurred, operation rollbacked and the stored procedure was terminated' 
		 ROLLBACK;
		END; 

	START TRANSACTION; 
		SET @prevValue = (SELECT nms_cur_contacts_id FROM odr_cur_orders WHERE id = orderID);
		
		UPDATE odr_cur_orders
			SET nms_cur_contacts_id = contactID
		WHERE odr_cur_orders.id = orderID;

		INSERT INTO odr_cur_order_operations(odr_cfg_order_operations_id
							,odr_cur_orders_id,odr_cur_order_entries_id,prev_value,cur_value, user_name)
		VALUES (1, orderID , null,  @prevValue , contactID, userName);
	COMMIT;
	
END
$$