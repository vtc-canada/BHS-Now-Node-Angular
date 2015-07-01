DROP PROCEDURE if EXISTS `INV_GetLocations` ;
DELIMITER $$
CREATE PROCEDURE  `INV_GetLocations` () 
BEGIN
	SELECT id
		 ,location
	FROM inv_cfg_locations
	WHERE is_deleted = 0;
END $$
DELIMITER ;