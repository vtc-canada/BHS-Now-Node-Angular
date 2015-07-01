DROP PROCEDURE if EXISTS `INV_DeleteLocation` ;
DELIMITER $$
CREATE PROCEDURE  `INV_DeleteLocation` (IN locationID INT) 
BEGIN
		UPDATE inv_cfg_locations 
		SET	is_deleted = 1
		WHERE  id = locationID;
		
END $$
DELIMITER ;