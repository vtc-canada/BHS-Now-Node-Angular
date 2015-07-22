DROP procedure IF EXISTS `ODR_InsertOrder`;

DELIMITER $$
CREATE PROCEDURE `ODR_InsertOrder`(IN contactID INT,IN userName VARCHAR(256), in orderType INT, OUT insertID INT)
BEGIN


	INSERT INTO odr_cur_orders (nms_cur_contacts_id
								,odr_cfg_order_types_id
								,order_no
								,odr_cfg_order_state_id
								,user_name)
	VALUES (contactID
			,orderType
			, CASE 
				WHEN orderType = 1 THEN  (CONCAT('PO',ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)))
				WHEN orderType = 2 THEN  (CONCAT('SM',ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)))
				WHEN orderType = 3 THEN  (CONCAT('RM',ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000)))
				ELSE  ROUND(UNIX_TIMESTAMP(CURTIME(4)) * 1000) END
			,1
			,userName
			);

SET insertID = LAST_INSERT_ID();


 



END$$

DELIMITER ;

