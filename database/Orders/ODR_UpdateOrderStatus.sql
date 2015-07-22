DROP procedure IF EXISTS `ODR_UpdateOrderStatus`;

DELIMITER $$

CREATE PROCEDURE `ODR_UpdateOrderStatus` (IN orderIDs VARCHAR(255), IN newValue INT, IN userName VARCHAR(128))
BEGIN
	
	DECLARE strLen INT DEFAULT 0;
	DECLARE subStrLen INT DEFAULT 0;
	DECLARE orderID VARCHAR(45);
	
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

	IF orderIDs IS NULL THEN 
		SET orderIDs = '';
	END IF;
		
	do_this:
		loop	
			 SET strLen = CHAR_LENGTH(orderIDs);
			 SET orderID = SUBSTRING_INDEX(orderIDs, ',', 1);
			 SET @prevStatus = (SELECT odr_cfg_order_state_id FROM odr_cur_orders WHERE id = orderID);

			-- Check that it's a new value
			IF (CAST(@prevStatus AS UNSIGNED INTEGER) <> newValue) THEN
			  -- Update Lot Operations
				#INSERT INTO inv_cur_lot_operations(inv_cur_lots_id, inv_cfg_lot_operations_id,prev_lot_status_id,cur_lot_status_id,user_name)
				#	VALUES (lotID, 2,  @prevStatus , newValue, userName);
				-- Update Lot Quantity
				UPDATE odr_cur_orders SET odr_cfg_order_state_id= newValue WHERE id = orderID;
			END IF;

			-- Get Next Lot ID
			SET subStrLen = CHAR_LENGTH(SUBSTRING_INDEX(orderIDs, ',', 1)) + 2;
			SET orderIDs = MID(orderIDs, subStrLen, strLen);

			IF orderIDs = '' THEN
			  LEAVE do_this;
			END IF;
		  END LOOP do_this;

COMMIT;
END
$$