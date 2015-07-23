DROP procedure IF EXISTS `ODR_UpdateOrderEntry`;

DELIMITER $$

CREATE PROCEDURE `ODR_UpdateOrderEntry` (IN entryID INT,IN matTypeID INT, IN brandID INT,IN quantityValue FLOAT, IN uomID INT, IN userName VARCHAR(256))
BEGIN
	#TODO : history of deleted being tracked in the system logs
	UPDATE odr_cur_order_entries
		SET inv_cfg_mat_types_id = matTypeID
			,inv_cfg_mat_brands_id = brandID
			,quantity = quantityValue
			,inv_cfg_uom_id = uomID
	WHERE odr_cur_order_entries.id = entryID;
	
END
$$