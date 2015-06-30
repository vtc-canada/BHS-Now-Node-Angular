DROP PROCEDURE if EXISTS `INV_InsertMatBrand` ;
DELIMITER $$
CREATE PROCEDURE  `INV_InsertMatBrand` (IN categoryID INT, IN brand VARCHAR(256)) 
BEGIN
		INSERT INTO inv_cfg_mat_brands 
			(inv_cfg_mat_category_id, brand) 
		VALUES (categoryID,brand);
END $$
DELIMITER ;