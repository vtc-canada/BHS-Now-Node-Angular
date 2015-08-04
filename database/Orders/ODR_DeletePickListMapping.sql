DROP procedure IF EXISTS `ODR_DeletePickListMapping`;

DELIMITER $$

CREATE PROCEDURE `ODR_DeletePickListMapping` (IN lotID INT, IN userName VARCHAR(256))
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
	
		DELETE FROM odr_cur_pick_list_mapping WHERE inv_cur_lots_id = lotID;

	#Change Lot Status to In Inventory
	CALL INV_UpdateLotStatus (lotID, 1, userName);

	COMMIT;
END
$$