DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CleanResourceDuplicates`()
BEGIN
DELETE FROM `resourcesecuritygroupmappings`
WHERE resourceId NOT IN (SELECT MIN(id) FROM `resources` GROUP BY `name`);


DROP TABLE IF EXISTS duplicateids;

CREATE TEMPORARY TABLE duplicateids
SELECT MIN(id) FROM `resources` GROUP BY `name`;

DELETE FROM `resources`
where id NOT IN (SELECT * FROM duplicateids);

DROP TABLE duplicateids;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateMessage`(IN paramFromUserId INT(11),IN paramToUserId INT(11),IN paramMessage VARCHAR(255),IN paramStatus VARCHAR(45),IN paramSeen TINYINT(1),OUT messageId INT(11))
BEGIN
	INSERT INTO `messages` (`fromUserId`, `toUserId`, `message`, `status`, `seen`, `createdAt`, `updatedAt`) 
VALUES (paramFromUserId, paramToUserId, paramMessage, paramStatus, paramSeen, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET messageId = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateResource`(IN name VARCHAR(255), OUT resourceId INT(11))
BEGIN
	INSERT INTO resources (name, createdAt, updatedAt) VALUES ( name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET resourceId = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateResourceSecurityGroupMapping`(IN paramResourceId INT(11),IN paramSecurityGroupId INT(11),IN paramCreate TINYINT(1),IN paramRead TINYINT(1),IN paramUpdate TINYINT(1),IN paramDelete TINYINT(1))
BEGIN
	INSERT INTO resourcesecuritygroupmappings 
(resourceId, securityGroupId, resourcesecuritygroupmappings.create, resourcesecuritygroupmappings.read, resourcesecuritygroupmappings.update, resourcesecuritygroupmappings.delete, createdAt, updatedAt) 
VALUES 
(paramResourceId, paramSecurityGroupId, paramCreate, paramRead, paramUpdate, paramDelete, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateSecurityGroup`(IN name VARCHAR(255), OUT createId INT(11))
BEGIN
	INSERT INTO securitygroups (name, createdAt, updatedAt) values (name, UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET createId = LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateUser`(IN username VARCHAR(255),IN password VARCHAR(255),IN email VARCHAR(255),IN firstname VARCHAR(255),IN lastname VARCHAR(255), IN active TINYINT(1),IN loginattempts INT(11),IN locale VARCHAR(255), OUT insertId INT(11))
BEGIN
	INSERT INTO users (username, password, email, firstname, lastname, active, loginattempts, locale, createdAt, updatedAt)
VALUES (username, password, email, firstname, lastname, active, loginattempts, locale,UTC_TIMESTAMP(), UTC_TIMESTAMP());
SET insertId = LAST_INSERT_ID(); 
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_CreateUserSecurityGroupMapping`(IN paramUserId INT(11),IN paramSecurityGroupId INT(11))
BEGIN
	INSERT INTO usersecuritygroupmappings (userId, securityGroupId, createdAt, updatedAt) VALUES (paramUserId, paramSecurityGroupId, UTC_TIMESTAMP(), UTC_TIMESTAMP());
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteResourceSecurityGroupMappings`(IN paramSecurityGroupId INT(11))
BEGIN
DELETE FROM resourcesecuritygroupmappings
WHERE 
securityGroupId = paramSecurityGroupId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	DELETE FROM resourcesecuritygroupmappings
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId;
	DELETE FROM securitygroups
WHERE id = paramSecurityGroupId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteUser`(IN vuser INT(11))
BEGIN
	DELETE FROM usersecuritygroupmappings
WHERE usersecuritygroupmappings.userId = vuser;
	DELETE FROM users
WHERE id = vuser;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_DeleteUserSecurityGroupMappings`(IN paramUserId INT(11))
BEGIN
DELETE FROM usersecuritygroupmappings
WHERE 
userId = paramUserId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetDistinctMessages`(IN v_id INT(11))
BEGIN
	SELECT * 
	FROM (SELECT * 
			FROM ((SELECT *
					,fromUserId AS joinuserId  
					FROM messages 
					WHERE toUserId = v_id
					) 
					UNION 
				  (SELECT *
				  ,toUserId AS joinuserId 
				  FROM messages 
				  WHERE fromUserId = v_id)
				) AS T1 
			ORDER BY createdAt 
			DESC 
		 ) AS T2 
	GROUP BY joinuserId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessage`(IN paramId INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE id = paramId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessagesByUserId`(IN v_id INT(11),IN v_where INT(11))
BEGIN
	SELECT * 
	FROM messages 
	WHERE (toUserId = v_id AND fromUserId = v_where) 
		OR (fromUserId = v_id AND toUserId = v_where) 
	ORDER BY createdAt 
	DESC LIMIT 20;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetMessagesPriorId`(IN paramPriorId INT(11), IN paramBoxId INT(11), IN paramUserId INT(11))
BEGIN
	SELECT id, fromUserId, toUserId, message, status, seen, createdAt, updatedAt
 FROM messages 
WHERE 
IF(paramPriorId IS NULL,1,id < paramPriorId)
AND
((fromUserId = paramUserId AND toUserId = paramBoxId)||(fromUserId = paramBoxId AND toUserId = paramUserId))
ORDER BY id DESC
LIMIT 25;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourceByName`(IN paramName VARCHAR(255))
BEGIN
	SELECT `name`,
`id`,
`createdAt`,
`updatedAt`
FROM resources
WHERE `name` = paramName;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResources`()
BEGIN
	SELECT 
id,
name,
createdAt,
updatedAt
FROM 
resources ORDER BY `name` ASC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourcesCount`()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM resources);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourceSecurityGroupMapping`(IN paramResourceId INT(11),IN paramSecurityGroupId INT(11))
BEGIN
	SELECT 
resourcesecuritygroupmappings.id
,resourcesecuritygroupmappings.securityGroupId
,resourcesecuritygroupmappings.resourceId
,resourcesecuritygroupmappings.create
,resourcesecuritygroupmappings.read
,resourcesecuritygroupmappings.update
,resourcesecuritygroupmappings.delete
,resourcesecuritygroupmappings.createdAt
,resourcesecuritygroupmappings.updatedAt
	FROM resourcesecuritygroupmappings
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId AND resourcesecuritygroupmappings.resourceId = paramResourceId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetResourceSecurityGroupMappingsCount`()
BEGIN
	SELECT count(*) AS 'count' FROM resourcesecuritygroupmappings;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroup`(IN paramSecurityGroupId INT(11))
BEGIN
	SELECT * FROM securitygroups
WHERE id = paramSecurityGroupId
LIMIT 1; 
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroupResources`(IN paramSecurityGroupId INT(11))
BEGIN
	SELECT 
resources.id
,resources.name
,resourcesecuritygroupmappings.create
,resourcesecuritygroupmappings.read
,resourcesecuritygroupmappings.update
,resourcesecuritygroupmappings.delete
	FROM resourcesecuritygroupmappings
INNER JOIN  
	resources
	ON (resources.id = resourcesecuritygroupmappings.resourceId)
WHERE resourcesecuritygroupmappings.securityGroupId = paramSecurityGroupId
ORDER BY resources.name ASC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroups`()
BEGIN
	SELECT * FROM securitygroups; 
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetSecurityGroupsCount`()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM securitygroups);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUnreadUserMessages`(IN paramToUserId INT(11))
BEGIN
	SELECT id, fromUserId, toUserId, message, status, seen, createdAt, updatedAt
 FROM messages 
WHERE 
seen = 0 
AND 
toUserId = paramToUserId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUser`(IN userId INT)
BEGIN
	SELECT 
		username
		,password
		,email
		,firstname
		,lastname
		,active
		,loginattempts
		,locale
		,id
		,createdAt
		,updatedAt 
FROM users
WHERE
id = userId
LIMIT 1;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserByUsername`(IN paramUsername VARCHAR(255))
BEGIN

	SELECT 
			username
			,password
			,email
			,firstname
			,lastname
			,active
			,loginattempts
			,locale
			,id
			,createdAt
			,updatedAt 
FROM users
WHERE
username = paramUsername
LIMIT 1;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserPolicies`(IN paramUserId INT)
BEGIN
SELECT 
 MAX(resourcesecuritygroupmappings.create) AS 'create'
, MAX(resourcesecuritygroupmappings.read) AS 'read'
, MAX(resourcesecuritygroupmappings.update) AS 'update'
, MAX(resourcesecuritygroupmappings.delete) AS 'delete'
, resources.name
FROM resourcesecuritygroupmappings
INNER JOIN resources ON resources.id = resourcesecuritygroupmappings.resourceId 
INNER JOIN usersecuritygroupmappings ON usersecuritygroupmappings.securityGroupId = resourcesecuritygroupmappings.securityGroupId
WHERE usersecuritygroupmappings.userId = paramUserId GROUP BY resources.name ORDER BY resources.name ;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUsers`()
BEGIN
	SELECT
id
,username
,email
,firstname
,lastname
,active
,loginattempts
,locale
	FROM
users;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUsersCount`()
BEGIN
   (SELECT COUNT(*) AS 'count' FROM users);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserSecurityGroupMappingsCount`()
BEGIN
	SELECT count(*) AS 'count' FROM usersecuritygroupmappings;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_GetUserSecurityGroups`(IN paramUserId INT(11))
BEGIN
SELECT securitygroups.id, securitygroups.name, IF(usersecuritygroupmappings.userId IS NULL,false,true) AS 'member' FROM 
securitygroups
LEFT JOIN
usersecuritygroupmappings ON(securitygroups.id = usersecuritygroupmappings.securityGroupId AND userId = paramUserId)
ORDER BY securitygroups.name ASC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateResourceSecurityGroupMapping`(IN paramId INT(11),IN paramCreate TINYINT(1),IN paramRead TINYINT(1),IN paramUpdate TINYINT(1),IN paramDelete TINYINT(1))
BEGIN
UPDATE resourcesecuritygroupmappings
SET resourcesecuritygroupmappings.create = paramCreate,
resourcesecuritygroupmappings.read = paramRead,
resourcesecuritygroupmappings.update = paramUpdate,
resourcesecuritygroupmappings.delete = paramDelete
WHERE resourcesecuritygroupmappings.id = paramId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateSecurityGroup`(IN paramId INT(11),IN paramName VARCHAR(255))
BEGIN
	UPDATE securitygroups
SET 
	name = paramName,
	updatedAt = UTC_TIMESTAMP()
WHERE
	id = paramId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateSeenUserMessages`(IN paramToUserId INT(11),IN paramFromUserId INT(11))
BEGIN

UPDATE messages
SET seen = 1,
updatedAt = UTC_TIMESTAMP()
WHERE
	toUserId = paramToUserId
AND
	fromUserId = paramFromUserId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateUser`(IN paramId INT(11),IN paramPassword VARCHAR(255)
,IN paramEmail VARCHAR(255),IN paramFirstname VARCHAR(255),IN paramLastname VARCHAR(255),IN paramActive TINYINT(1),IN paramLoginattempts INT,IN paramLocale VARCHAR(255))
BEGIN
	UPDATE users
SET 
password = IF(paramPassword IS NULL,password,paramPassword)
,email = paramEmail
,firstname = paramFirstname
,lastname = paramLastname
,active = paramActive
,loginattempts = paramLoginattempts
,locale = paramLocale
,updatedAt = UTC_TIMESTAMP()
WHERE id = paramId;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `NMS_BASE_UpdateUserActiveLoginAttempts`(IN userId INT, IN active TINYINT(1), IN loginattempts INT)
BEGIN
	UPDATE users
SET loginattempts = loginattempts,
active = active,
updatedAt = UTC_TIMESTAMP()
WHERE id = userId;
END$$
DELIMITER ;
