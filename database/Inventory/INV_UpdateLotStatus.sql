DROP procedure IF EXISTS `INV_UpdateLotStatus`;

DELIMITER $$

CREATE PROCEDURE `INV_UpdateLotStatus` (IN lotIDs VARCHAR(255), IN newValue INT, IN userName VARCHAR(128))
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
			 SET @prevStatus = (SELECT inv_cfg_lot_status_id FROM inv_cur_lots WHERE id = lotID);

			-- Check that it's a new value
			IF (CAST(@prevStatus AS UNSIGNED INTEGER) <> newValue) THEN
			  -- Update Lot Operations
				INSERT INTO inv_cur_lot_operations(inv_cur_lots_id, inv_cfg_lot_operations_id,prev_lot_status_id,cur_lot_status_id,user_name)
					VALUES (lotID, 2,  @prevStatus , newValue, userName);
				-- Update Lot Quantity
				UPDATE  inv_cur_lots SET inv_cfg_lot_status_id = newValue WHERE id = lotID;
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