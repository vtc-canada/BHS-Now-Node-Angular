DROP procedure IF EXISTS `INV_InsertLot`;

DELIMITER $$
CREATE DEFINER=`root`@`%` PROCEDURE `INV_InsertLot`(IN uomID INT(11), IN brandID INT(11), IN typeID INT(11), IN serial_no VARCHAR(128), IN quantity VARCHAR(45), IN price VARCHAR(128), IN date_added DATETIME, IN expiration_date DATETIME, IN user_name VARCHAR(128), IN notes VARCHAR(256)
,IN tread_depth VARCHAR(128),IN side_wall VARCHAR(128),IN tire_type VARCHAR(128),IN tire_size VARCHAR(128)
, IN is_deleted TINYINT(4), OUT insertID INT(11))
BEGIN


INSERT INTO inv_cur_lots (`inv_cfg_uom_id`, `inv_cfg_mat_brands_id`, `inv_cfg_mat_types_id`, `serial_no`, `quantity`, `price`, `born_date`, `expiration_date`, `user_name`, `notes`)
VALUES (uomID, brandID, typeID, serial_no, quantity, price, date_added, expiration_date, user_name, notes);

SET insertID = LAST_INSERT_ID();
 
SELECT @propID :=  id FROM nms.inv_cfg_custom_props where property = 'tread_depth'; 
INSERT INTO `inv_cur_prop_vals` (`inv_cfg_custom_props_id`,`inv_cur_lots_id`,`value`)
VALUES (@propID,insertID,tread_depth);

SELECT @propID :=  id FROM nms.inv_cfg_custom_props where property = 'side_wall'; 
INSERT INTO `inv_cur_prop_vals` (`inv_cfg_custom_props_id`,`inv_cur_lots_id`,`value`)
VALUES (@propID,insertID,side_wall);

SELECT @propID :=  id FROM nms.inv_cfg_custom_props where property = 'tire_type'; 
INSERT INTO `inv_cur_prop_vals` (`inv_cfg_custom_props_id`,`inv_cur_lots_id`,`value`)
VALUES (@propID,insertID,tire_type);

SELECT @propID :=  id FROM nms.inv_cfg_custom_props where property = 'tire_size'; 
INSERT INTO `inv_cur_prop_vals` (`inv_cfg_custom_props_id`,`inv_cur_lots_id`,`value`)
VALUES (@propID,insertID,tire_size);


END$$

DELIMITER ;

