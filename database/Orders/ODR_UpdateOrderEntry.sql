DROP procedure IF EXISTS `ODR_UpdateOrderEntry`;

DELIMITER $$

CREATE PROCEDURE `ODR_UpdateOrderEntry` (IN entryID INT,IN matTypeID INT, IN brandID INT,IN quantityValue FLOAT, IN uomID INT, IN userName VARCHAR(256))
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
	SET @prevQuantity = (SELECT quantity FROM odr_cur_order_entries WHERE id = entryID);
	SET @orderID = (SELECT odr_cur_orders_id FROM odr_cur_order_entries WHERE id = entryID);

	UPDATE odr_cur_order_entries
		SET inv_cfg_mat_types_id = matTypeID
			,inv_cfg_mat_brands_id = brandID
			,quantity = quantityValue
			,inv_cfg_uom_id = uomID
	WHERE odr_cur_order_entries.id = entryID;

	
	INSERT INTO odr_cur_order_operations(odr_cfg_order_operations_id
							,odr_cur_orders_id,odr_cur_order_entries_id,prev_value,cur_value, user_name)
					VALUES (2, @orderID , entryID,  @prevQuantity , quantityValue, userName);
COMMIT;
	
END
$$