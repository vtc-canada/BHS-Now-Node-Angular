DROP procedure IF EXISTS `ODR_InsertPickListMapping`;

DELIMITER $$
CREATE PROCEDURE `ODR_InsertPickListMapping`(IN orderID INT,IN entryID INT, in lotID INT, IN userName VARCHAR(256))
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

		INSERT INTO odr_cur_pick_list_mapping (inv_cur_lots_id
									,odr_cur_orders_id
									,odr_cur_order_entries_id)
		VALUES (lotID
				,orderID
				,entryID
				);

	#Change Lot Status to Reserved
	CALL INV_UpdateLotStatus (lotID, 12, userName);


 COMMIT;



END$$

DELIMITER ;

