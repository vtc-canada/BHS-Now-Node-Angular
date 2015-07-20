DROP procedure IF EXISTS `INV_UpdateLotQuantity`;

DELIMITER $$

CREATE PROCEDURE `INV_UpdateLotQuantity` (IN lotIDs VARCHAR(255), IN newValue INT, IN user VARCHAR(128))
BEGIN
	
	DECLARE strLen INT DEFAULT 0;
	DECLARE subStrLen INT DEFAULT 0;
	DECLARE lotID VARCHAR(45);
	
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

	IF lotIDs IS NULL THEN 
		SET lotIDs = '';
	END IF;
		
	do_this:
		loop	
			SET strLen = CHAR_LENGTH(lotIDs);
			SET lotID = SUBSTRING_INDEX(lotIDs, ',', 1);
			SET @prevQuantity = (SELECT quantity FROM inv_cur_lots WHERE id = lotID);

			-- Check that it's a new value
			IF (CAST(@prevQuantity AS UNSIGNED INTEGER) <> newValue) THEN
				-- Update Lot Operations
				INSERT INTO inv_cur_lot_operations(inv_cur_lots_id, inv_cfg_lot_operations_id,prev_quantity,cur_quantity, user_name)
					VALUES (SUBSTRING_INDEX(lotIDs, ',', 1), 1,  @prevQuantity , newValue, user);
				-- Update Lot Quantity
				UPDATE  inv_cur_lots SET quantity = newValue WHERE id = lotID;
			END IF;

			-- Get Next Lot ID
			SET subStrLen = CHAR_LENGTH(SUBSTRING_INDEX(lotIDs, ',', 1)) + 2;
			SET lotIDs = MID(lotIDs, subStrLen, strLen);

			IF lotIDs = '' THEN
			  LEAVE do_this;
			END IF;
		  END LOOP do_this;

COMMIT;
END
$$