DROP procedure IF EXISTS `ODR_InsertOrderEntry`;

DELIMITER $$
CREATE PROCEDURE `ODR_InsertOrderEntry`(IN orderID INT,IN matType INT, IN matBrand INT, IN quantityValue FLOAT
										,IN uomID INT,OUT insertID INT)
BEGIN


	INSERT INTO odr_cur_order_entries(odr_cur_orders_id
								,inv_cfg_mat_types_id
								,inv_cfg_mat_brands_id
								,quantity
								,inv_cfg_uom_id)
	VALUES (orderID
			,matType
			,matBrand
			,quantityValue
			,uomID);

SET insertID = LAST_INSERT_ID();


 



END$$

DELIMITER ;

