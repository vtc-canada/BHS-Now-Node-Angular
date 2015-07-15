DROP procedure IF EXISTS `INV_UpdateLotCustomProps`;

DELIMITER $$

CREATE PROCEDURE `INV_UpdateLotCustomProps` (IN lotID INT, IN propValsID VARCHAR(255), IN propVals VARCHAR(255), IN user VARCHAR(128))
BEGIN

	-- Custom Prop ID
	DECLARE strCustomPropLen INT DEFAULT 0;
	DECLARE subStrCustomPropLen INT DEFAULT 0;
	DECLARE customPropID VARCHAR(45);

	-- Custom Prop New Value
	DECLARE strCustomPropValLen INT DEFAULT 0;
	DECLARE subStrCustomPropValLen INT DEFAULT 0;
	DECLARE customPropVal VARCHAR(45);
	
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

	IF propValsID IS NULL THEN 
		SET propValsID = '';
	END IF;
	do_this:
		loop
			-- Get Custom Prop ID
			 SET strCustomPropLen = CHAR_LENGTH(propValsID);
			 SET customPropID = SUBSTRING_INDEX(propValsID, ',', 1);
			-- Get Custom Prop ID
			 SET strCustomPropValLen = CHAR_LENGTH(propVals);
			 SET customPropVal = SUBSTRING_INDEX(propVals, ',', 1);

			 SET @prevValue = (SELECT value FROM inv_cur_prop_vals WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = customPropID);

			-- Check that it's a new value

			IF (@prevValue IS NULL OR @prevValue <> customPropVal) THEN

			  -- Update Lot Operations
				INSERT INTO inv_cur_lot_operations(inv_cur_lots_id, inv_cfg_lot_operations_id,inv_cfg_custom_props_id,prev_custom_prop_val,cur_custom_prop_val, user)
					VALUES (lotID, 6, customPropID, @prevValue , customPropVal, user);
				-- Update Custom Property if it exists, else insert

				IF EXISTS (SELECT * FROM inv_cur_prop_vals WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = customPropID)
				THEN
					UPDATE  inv_cur_prop_vals SET value = customPropVal WHERE inv_cur_lots_id = lotID AND inv_cfg_custom_props_id = customPropID;
					Select 'Updating';
				ELSE

					INSERT INTO inv_cur_prop_vals (inv_cfg_custom_props_id, inv_cur_lots_id, value) 
						VALUES (customPropID, lotID, customPropVal);						

				END IF;
			END IF;

			-- Get Next Custom Prop ID
			SET subStrCustomPropLen = CHAR_LENGTH(SUBSTRING_INDEX(propValsID, ',', 1)) + 2;
			SET propValsID = MID(propValsID, subStrCustomPropLen, strCustomPropLen);

			-- Get Next Custom Prop Value
			SET subStrCustomPropValLen = CHAR_LENGTH(SUBSTRING_INDEX(propVals, ',', 1)) + 2;
			SET propVals = MID(propVals, subStrCustomPropValLen, strCustomPropValLen);
			IF propValsID = '' THEN
			  LEAVE do_this;
			END IF;
		  END LOOP do_this;

#COMMIT;
END
$$