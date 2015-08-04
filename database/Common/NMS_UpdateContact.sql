
DROP procedure IF EXISTS `NMS_UpdateContact`;

DELIMITER $$
CREATE PROCEDURE `NMS_UpdateContact` (IN contactID INT, IN name VARCHAR(256), IN email VARCHAR(256), IN phoneNumber VARCHAR(256))
BEGIN

		UPDATE nms_cur_contacts 
		SET name = name
			,email = email	
			,phone_number = phoneNumber
		WHERE id = contactID;
END

$$

DELIMITER ;

