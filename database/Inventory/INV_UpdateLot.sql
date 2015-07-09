
DROP procedure IF EXISTS `INV_UpdateLot`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `INV_UpdateLot`(IN lotID INT(11), IN uomID INT(11), IN brandID INT(11), IN typeID INT(11), IN serial_no VARCHAR(128), IN quantity VARCHAR(45), IN price VARCHAR(128), IN date_added DATETIME, IN expiration_date DATETIME, IN user_name VARCHAR(128), IN notes VARCHAR(256), IN is_deleted TINYINT(4))
BEGIN
	UPDATE inv_cur_lots 

SET inv_cfg_uom_id = uomID
,inv_cfg_mat_brands_id = brandID
,inv_cfg_mat_types_id = typeID
,serial_no = serial_no
,quantity = quantity
,price = price
,born_date = date_added
,expiration_date = expiration_date
,user_name = user_name
,notes = notes
,is_deleted = is_deleted
WHERE inv_cur_lots.id = lotID;






END$$

DELIMITER ;

