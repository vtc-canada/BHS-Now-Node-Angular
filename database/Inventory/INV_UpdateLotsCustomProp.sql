DROP procedure IF EXISTS `INV_UpdateLotsCustomProp`;

DELIMITER $$
CREATE PROCEDURE `INV_UpdateLotsCustomProp` (IN lotIDs VARCHAR(1048), IN propValID VARCHAR(64), IN propVal VARCHAR(64), IN user VARCHAR(128))
BEGIN
	-- Lot ID
	DECLARE strLotIDLen INT DEFAULT 0;
	DECLARE subStrLotIDLen INT DEFAULT 0;
	DECLARE lotID VARCHAR(45);

	
/*	DECLARE exit handler for sqlexception
	  BEGIN
		SELECT 'An error has occurred, operation rollbacked and the stored procedure was terminated' 
	  ROLLBACK;
	END;

	DECLARE exit handler for sqlwarning
	 BEGIN
		SELECT 'An warning has occurred, operation rollbacked and the stored procedure was terminated' 
	 ROLLBACK;
	END; 

START TRANSACTION;  */

	IF lotIDs IS NULL THEN 
		SET lotIDs = '';
	END IF;
		
	do_this:
		loop
			-- Get Lot ID
			 SET strLotIDLen = CHAR_LENGTH(lotIDs);
			 SET lotID = SUBSTRING_INDEX(lotIDs, ',', 1);

			 SET @prevValue = (SELECT value FROM inv_cur_prop_vals WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = propValID);

			-- Check that it's a new value
			IF (@prevValue  <> propVal) THEN
			  -- Update Lot Operations
				INSERT INTO inv_cur_lot_operations(inv_cur_lots_id, inv_cfg_lot_operations_id,inv_cfg_custom_props_id,prev_custom_prop_val,cur_custom_prop_val, user)
					VALUES (lotID, 6, propValID, @prevValue , propVal, user);
				-- Update Custom Property if it exists, else insert
				IF EXISTS (SELECT * FROM inv_cur_prop_vals WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = propValID)
				THEN
					UPDATE  inv_cur_prop_vals SET value = propVal WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = propValID;
				ELSE
					INSERT INTO inv_cur_prop_vals (inv_cfg_custom_props_id, inv_cur_lots_id, value) 
						VALUES (propValID, lotID, propVal);

				END IF;
			END IF;

			-- Get Next Lot ID
			SET subStrLotIDLen = CHAR_LENGTH(SUBSTRING_INDEX(lotIDs, ',', 1)) + 2;
			SET lotIDs = MID(lotIDs, subStrLotIDLen, strLotIDLen);

			IF lotIDs = '' THEN
			  LEAVE do_this;
			END IF;
		  END LOOP do_this;

#COMMIT;
END
$$