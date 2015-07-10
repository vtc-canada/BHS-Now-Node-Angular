
DROP procedure IF EXISTS `INV_UpdateLot`;

DELIMITER $$

CREATE DEFINER=`root`@`%` PROCEDURE `INV_UpdateLot`(     IN lotID INT(11), IN uomID INT(11), IN brandID INT(11), IN typeID INT(11), IN serial_no VARCHAR(128), IN quantity VARCHAR(45), IN price VARCHAR(128), IN date_added DATETIME, IN expiration_date DATETIME, IN user_name VARCHAR(128), IN notes VARCHAR(256)
,IN tread_depth VARCHAR(128),IN side_wall VARCHAR(128),IN tire_type VARCHAR(128),IN tire_size VARCHAR(128)
, IN is_deleted TINYINT(4)
)
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

UPDATE `inv_cur_prop_vals`
INNER JOIN `inv_cfg_custom_props` ON `inv_cur_prop_vals`.`inv_cfg_custom_props_id` = `inv_cfg_custom_props`.`id`
AND `inv_cfg_custom_props`.`property` = 'tread_depth' AND `inv_cur_prop_vals`.`inv_cur_lots_id` = lotID
SET `inv_cur_prop_vals`.`value` = tread_depth;

UPDATE `inv_cur_prop_vals`
INNER JOIN `inv_cfg_custom_props` ON `inv_cur_prop_vals`.`inv_cfg_custom_props_id` = `inv_cfg_custom_props`.`id`
AND `inv_cfg_custom_props`.`property` = 'side_wall' AND `inv_cur_prop_vals`.`inv_cur_lots_id` = lotID
SET `inv_cur_prop_vals`.`value` = side_wall;

UPDATE `inv_cur_prop_vals`
INNER JOIN `inv_cfg_custom_props` ON `inv_cur_prop_vals`.`inv_cfg_custom_props_id` = `inv_cfg_custom_props`.`id`
AND `inv_cfg_custom_props`.`property` = 'tire_type' AND `inv_cur_prop_vals`.`inv_cur_lots_id` = lotID
SET `inv_cur_prop_vals`.`value` = tire_type;

UPDATE `inv_cur_prop_vals`
INNER JOIN `inv_cfg_custom_props` ON `inv_cur_prop_vals`.`inv_cfg_custom_props_id` = `inv_cfg_custom_props`.`id`
AND `inv_cfg_custom_props`.`property` = 'tire_size' AND `inv_cur_prop_vals`.`inv_cur_lots_id` = lotID
SET `inv_cur_prop_vals`.`value` = tire_size;




END$$

DELIMITER ;

