DROP PROCEDURE if EXISTS `INV_UpdateLocation` ;
DELIMITER $$
CREATE PROCEDURE  `INV_UpdateLocation` (IN locationID INT, IN location VARCHAR(256)) 
BEGIN
		UPDATE inv_cfg_locations 
		SET	location = location
		WHERE  id = locationID;
		
END $$
DELIMITER ;