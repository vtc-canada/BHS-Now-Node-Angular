#Adding rows to dpcodes (languages)
#Already had language ... Add more maybe
USE `fatima_center_donor_tracker_v2`;

#INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`) VALUES ('LANGUAGE', 'EN', 'English');
#INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`) VALUES ('LANGUAGE', 'FR', 'French');

#Create language table - TODO- fix with foreign key
CREATE TABLE `dplang` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `DONOR` INT NOT NULL,
  `LANGUAGE` VARCHAR(45) NOT NULL,
  `database_origin` INT(11) NOT NULL,
  PRIMARY KEY (`id`));
ALTER TABLE `dplang` 
ADD INDEX `fk_dplang_dp_idx` (`DONOR` ASC, `LANGUAGE` ASC);
ALTER TABLE `dplang` 
ADD CONSTRAINT `fk_dplang_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

  
#create Translate table
  CREATE TABLE `dptrans` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `DONOR` INT(11) NOT NULL,
  `LANGUAGE` VARCHAR(45) NOT NULL,
  `database_origin` INT(11) NOT NULL,
  PRIMARY KEY (`id`));
  
ALTER TABLE `dptrans` 
ADD INDEX `fk_dptrans_dp_idx` (`DONOR` ASC);
ALTER TABLE `dptrans` 
ADD CONSTRAINT `fk_dptrans_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

  
CREATE TABLE `dpdonorstatushistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `DONOR` int(11) DEFAULT NULL,
  `month` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `last_status` varchar(255) DEFAULT NULL,
  `status_change` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_donor_date_status` (`DONOR`,`month`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=11009881 DEFAULT CHARSET=latin1;



#create dpdonorstatushistory table
#CREATE TABLE `dpdonorstatushistory` (
#`id` INT NOT NULL,
#`January` VARCHAR(255) NULL,
#`February` VARCHAR(255) NULL,
#`March` VARCHAR(255) NULL,
#`April` VARCHAR(255) NULL,
#`May` VARCHAR(255) NULL,
#`June` VARCHAR(255) NULL,
#`July` VARCHAR(255) NULL,
#`August` VARCHAR(255) NULL,
#`September` VARCHAR(255) NULL,
#`October` VARCHAR(255) NULL,
#`November` VARCHAR(255) NULL,
#`December` VARCHAR(255) NULL,
#PRIMARY KEY (`id`),
#CONSTRAINT `fk_donor`
#FOREIGN KEY (`id`)
#REFERENCES `dp` (`id`)
#ON DELETE RESTRICT
#ON UPDATE RESTRICT);


#Creating Languages Temp import table
CREATE TABLE `languages` (
`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
`name` char(49) CHARACTER SET utf8 DEFAULT NULL,
`iso_639-1` char(2) CHARACTER SET utf8 DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=136 ;

-- Languages --
INSERT INTO `languages` VALUES(1, 'English', 'en');
INSERT INTO `languages` VALUES(2, 'Afar', 'aa');
INSERT INTO `languages` VALUES(3, 'Abkhazian', 'ab');
INSERT INTO `languages` VALUES(4, 'Afrikaans', 'af');
INSERT INTO `languages` VALUES(5, 'Amharic', 'am');
INSERT INTO `languages` VALUES(6, 'Arabic', 'ar');
INSERT INTO `languages` VALUES(7, 'Assamese', 'as');
INSERT INTO `languages` VALUES(8, 'Aymara', 'ay');
INSERT INTO `languages` VALUES(9, 'Azerbaijani', 'az');
INSERT INTO `languages` VALUES(10, 'Bashkir', 'ba');
INSERT INTO `languages` VALUES(11, 'Byelorussian', 'be');
INSERT INTO `languages` VALUES(12, 'Bulgarian', 'bg');
INSERT INTO `languages` VALUES(13, 'Bihari', 'bh');
INSERT INTO `languages` VALUES(14, 'Bislama', 'bi');
INSERT INTO `languages` VALUES(15, 'Bengali/Bangla', 'bn');
INSERT INTO `languages` VALUES(16, 'Tibetan', 'bo');
INSERT INTO `languages` VALUES(17, 'Breton', 'br');
INSERT INTO `languages` VALUES(18, 'Catalan', 'ca');
INSERT INTO `languages` VALUES(19, 'Corsican', 'co');
INSERT INTO `languages` VALUES(20, 'Czech', 'cs');
INSERT INTO `languages` VALUES(21, 'Welsh', 'cy');
INSERT INTO `languages` VALUES(22, 'Danish', 'da');
INSERT INTO `languages` VALUES(23, 'German', 'de');
INSERT INTO `languages` VALUES(24, 'Bhutani', 'dz');
INSERT INTO `languages` VALUES(25, 'Greek', 'el');
INSERT INTO `languages` VALUES(26, 'Esperanto', 'eo');
INSERT INTO `languages` VALUES(27, 'Spanish', 'es');
INSERT INTO `languages` VALUES(28, 'Estonian', 'et');
INSERT INTO `languages` VALUES(29, 'Basque', 'eu');
INSERT INTO `languages` VALUES(30, 'Persian', 'fa');
INSERT INTO `languages` VALUES(31, 'Finnish', 'fi');
INSERT INTO `languages` VALUES(32, 'Fiji', 'fj');
INSERT INTO `languages` VALUES(33, 'Faeroese', 'fo');
INSERT INTO `languages` VALUES(34, 'French', 'fr');
INSERT INTO `languages` VALUES(35, 'Frisian', 'fy');
INSERT INTO `languages` VALUES(36, 'Irish', 'ga');
INSERT INTO `languages` VALUES(37, 'Scots/Gaelic', 'gd');
INSERT INTO `languages` VALUES(38, 'Galician', 'gl');
INSERT INTO `languages` VALUES(39, 'Guarani', 'gn');
INSERT INTO `languages` VALUES(40, 'Gujarati', 'gu');
INSERT INTO `languages` VALUES(41, 'Hausa', 'ha');
INSERT INTO `languages` VALUES(42, 'Hindi', 'hi');
INSERT INTO `languages` VALUES(43, 'Croatian', 'hr');
INSERT INTO `languages` VALUES(44, 'Hungarian', 'hu');
INSERT INTO `languages` VALUES(45, 'Armenian', 'hy');
INSERT INTO `languages` VALUES(46, 'Interlingua', 'ia');
INSERT INTO `languages` VALUES(47, 'Interlingue', 'ie');
INSERT INTO `languages` VALUES(48, 'Inupiak', 'ik');
INSERT INTO `languages` VALUES(49, 'Indonesian', 'in');
INSERT INTO `languages` VALUES(50, 'Icelandic', 'is');
INSERT INTO `languages` VALUES(51, 'Italian', 'it');
INSERT INTO `languages` VALUES(52, 'Hebrew', 'iw');
INSERT INTO `languages` VALUES(53, 'Japanese', 'ja');
INSERT INTO `languages` VALUES(54, 'Yiddish', 'ji');
INSERT INTO `languages` VALUES(55, 'Javanese', 'jw');
INSERT INTO `languages` VALUES(56, 'Georgian', 'ka');
INSERT INTO `languages` VALUES(57, 'Kazakh', 'kk');
INSERT INTO `languages` VALUES(58, 'Greenlandic', 'kl');
INSERT INTO `languages` VALUES(59, 'Cambodian', 'km');
INSERT INTO `languages` VALUES(60, 'Kannada', 'kn');
INSERT INTO `languages` VALUES(61, 'Korean', 'ko');
INSERT INTO `languages` VALUES(62, 'Kashmiri', 'ks');
INSERT INTO `languages` VALUES(63, 'Kurdish', 'ku');
INSERT INTO `languages` VALUES(64, 'Kirghiz', 'ky');
INSERT INTO `languages` VALUES(65, 'Latin', 'la');
INSERT INTO `languages` VALUES(66, 'Lingala', 'ln');
INSERT INTO `languages` VALUES(67, 'Laothian', 'lo');
INSERT INTO `languages` VALUES(68, 'Lithuanian', 'lt');
INSERT INTO `languages` VALUES(69, 'Latvian/Lettish', 'lv');
INSERT INTO `languages` VALUES(70, 'Malagasy', 'mg');
INSERT INTO `languages` VALUES(71, 'Maori', 'mi');
INSERT INTO `languages` VALUES(72, 'Macedonian', 'mk');
INSERT INTO `languages` VALUES(73, 'Malayalam', 'ml');
INSERT INTO `languages` VALUES(74, 'Mongolian', 'mn');
INSERT INTO `languages` VALUES(75, 'Moldavian', 'mo');
INSERT INTO `languages` VALUES(76, 'Marathi', 'mr');
INSERT INTO `languages` VALUES(77, 'Malay', 'ms');
INSERT INTO `languages` VALUES(78, 'Maltese', 'mt');
INSERT INTO `languages` VALUES(79, 'Burmese', 'my');
INSERT INTO `languages` VALUES(80, 'Nauru', 'na');
INSERT INTO `languages` VALUES(81, 'Nepali', 'ne');
INSERT INTO `languages` VALUES(82, 'Dutch', 'nl');
INSERT INTO `languages` VALUES(83, 'Norwegian', 'no');
INSERT INTO `languages` VALUES(84, 'Occitan', 'oc');
INSERT INTO `languages` VALUES(85, '(Afan)/Oromoor/Oriya', 'om');
INSERT INTO `languages` VALUES(86, 'Punjabi', 'pa');
INSERT INTO `languages` VALUES(87, 'Polish', 'pl');
INSERT INTO `languages` VALUES(88, 'Pashto/Pushto', 'ps');
INSERT INTO `languages` VALUES(89, 'Portuguese', 'pt');
INSERT INTO `languages` VALUES(90, 'Quechua', 'qu');
INSERT INTO `languages` VALUES(91, 'Rhaeto-Romance', 'rm');
INSERT INTO `languages` VALUES(92, 'Kirundi', 'rn');
INSERT INTO `languages` VALUES(93, 'Romanian', 'ro');
INSERT INTO `languages` VALUES(94, 'Russian', 'ru');
INSERT INTO `languages` VALUES(95, 'Kinyarwanda', 'rw');
INSERT INTO `languages` VALUES(96, 'Sanskrit', 'sa');
INSERT INTO `languages` VALUES(97, 'Sindhi', 'sd');
INSERT INTO `languages` VALUES(98, 'Sangro', 'sg');
INSERT INTO `languages` VALUES(99, 'Serbo-Croatian', 'sh');
INSERT INTO `languages` VALUES(100, 'Singhalese', 'si');
INSERT INTO `languages` VALUES(101, 'Slovak', 'sk');
INSERT INTO `languages` VALUES(102, 'Slovenian', 'sl');
INSERT INTO `languages` VALUES(103, 'Samoan', 'sm');
INSERT INTO `languages` VALUES(104, 'Shona', 'sn');
INSERT INTO `languages` VALUES(105, 'Somali', 'so');
INSERT INTO `languages` VALUES(106, 'Albanian', 'sq');
INSERT INTO `languages` VALUES(107, 'Serbian', 'sr');
INSERT INTO `languages` VALUES(108, 'Siswati', 'ss');
INSERT INTO `languages` VALUES(109, 'Sesotho', 'st');
INSERT INTO `languages` VALUES(110, 'Sundanese', 'su');
INSERT INTO `languages` VALUES(111, 'Swedish', 'sv');
INSERT INTO `languages` VALUES(112, 'Swahili', 'sw');
INSERT INTO `languages` VALUES(113, 'Tamil', 'ta');
INSERT INTO `languages` VALUES(114, 'Tegulu', 'te');
INSERT INTO `languages` VALUES(115, 'Tajik', 'tg');
INSERT INTO `languages` VALUES(116, 'Thai', 'th');
INSERT INTO `languages` VALUES(117, 'Tigrinya', 'ti');
INSERT INTO `languages` VALUES(118, 'Turkmen', 'tk');
INSERT INTO `languages` VALUES(119, 'Tagalog', 'tl');
INSERT INTO `languages` VALUES(120, 'Setswana', 'tn');
INSERT INTO `languages` VALUES(121, 'Tonga', 'to');
INSERT INTO `languages` VALUES(122, 'Turkish', 'tr');
INSERT INTO `languages` VALUES(123, 'Tsonga', 'ts');
INSERT INTO `languages` VALUES(124, 'Tatar', 'tt');
INSERT INTO `languages` VALUES(125, 'Twi', 'tw');
INSERT INTO `languages` VALUES(126, 'Ukrainian', 'uk');
INSERT INTO `languages` VALUES(127, 'Urdu', 'ur');
INSERT INTO `languages` VALUES(128, 'Uzbek', 'uz');
INSERT INTO `languages` VALUES(129, 'Vietnamese', 'vi');
INSERT INTO `languages` VALUES(130, 'Volapuk', 'vo');
INSERT INTO `languages` VALUES(131, 'Wolof', 'wo');
INSERT INTO `languages` VALUES(132, 'Xhosa', 'xh');
INSERT INTO `languages` VALUES(133, 'Yoruba', 'yo');
INSERT INTO `languages` VALUES(134, 'Chinese', 'zh');
INSERT INTO `languages` VALUES(135, 'Zulu', 'zu');



#Adding indexes


#Indexing maildrop
ALTER TABLE `maildrop` 
ADD INDEX `ix_maildrop_provcode_database_origin` (`PROVCODE` ASC, `database_origin` ASC);


# ADDing columns  101 seconds

ALTER TABLE `dp` 
ADD COLUMN `ecc_enabled` TINYINT(1) NULL AFTER `database_origin`,
ADD COLUMN `status` VARCHAR(255) NULL AFTER `database_origin`,
ADD COLUMN `last_interaction` DATE NULL AFTER `database_origin`;


# Indexing DP    138 seconds
ALTER TABLE `dp` 
ADD INDEX `index2` (`FNAME` ASC),
ADD INDEX `index3` (`LNAME` ASC),
ADD INDEX `ix_id_country` (`id` ASC, `COUNTRY` ASC),
ADD FULLTEXT INDEX `index5` (`FNAME` ASC, `LNAME` ASC),
ADD INDEX `index6` (`status` ASC);

ALTER TABLE `dp` 
ADD INDEX `ix_class_status_id` (`CLASS` ASC, `status` ASC, `COUNTRY` ASC, `id` ASC),
ADD INDEX `ix_CLASS_LASTDON_status_id` (`CLASS` ASC, `LASTDON` ASC, `status` ASC, `id` ASC),
ADD INDEX `ix_LANGUAGE` (`LANGUAGE` ASC);


#clean phone numbers
UPDATE dp SET PHONE = REPLACE(REPLACE(REPLACE(REPLACE(PHONE, ' ', ''), '-', ''), ')', ''), '(', '');
UPDATE dp SET PHON2 = REPLACE(REPLACE(REPLACE(REPLACE(PHON2, ' ', ''), '-', ''), ')', ''), '(', '');
UPDATE dp SET PHON3 = REPLACE(REPLACE(REPLACE(REPLACE(PHON3, '(', ''), ')', ''), '-', ''), ' ', '');



#indexing dpcodes  0 seconds
ALTER TABLE `dpcodes` 
ADD INDEX `index2` (`FIELD` ASC),
ADD FULLTEXT INDEX `ix_code_full_text` (`FIELD` ASC, `CODE` ASC, `DESC` ASC, `CATEGORY` ASC);
ALTER TABLE `dpcodes` 
ADD INDEX `ix_database_origin` (`database_origin` ASC);

#Adding dpgift index to speed up missing dp IDs  -  10 seconds
ALTER TABLE `dpgift` 
ADD INDEX `index2` (`DONOR` ASC);

#clearing IDs that are missing from dp  - Deletes 41 records  85 seconds
DELETE FROM dpgift WHERE DONOR IN (
SELECT t.DONOR AS id from (
select GIFT.DONOR, CONTACT.id from dpgift GIFT
left outer join dp CONTACT on CONTACT.id = GIFT.DONOR) t
WHERE t.id IS NULL);

#remove dpgift temporary ID1
ALTER TABLE `dpgift` 
DROP INDEX `index2` ;

#indexing dpgift   - 4 hours
ALTER TABLE `dpgift` 
ADD INDEX `index2` (`DONOR` ASC),
ADD CONSTRAINT `fk_dpgift_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
 
 
  # dpgift donor date amount index
  ALTER TABLE `dpgift` 
ADD INDEX `ix_donor_date_amt` (`DONOR` ASC, `DATE` ASC, `AMT` ASC),
ADD INDEX `ix_date_transact` (`DATE` ASC, `TRANSACT` ASC),
ADD INDEX `ix_DEMAND` (`DEMAND` ASC),
ADD INDEX `ix_date` (`DATE` ASC),
ADD INDEX `ix_amt` (`AMT` ASC),
ADD INDEX `ix_mode` (`MODE` ASC),
ADD INDEX `ix_pledge` (`GL` ASC),
ADD INDEX `ix_req` (`REQUESTS` ASC),
ADD INDEX `ix_tbarequests` (`TBAREQS` ASC),
ADD INDEX `ix_camp_type` (`CAMP_TYPE` ASC),
ADD FULLTEXT INDEX `ix_SOL_fulltext` (`SOL` ASC);



  #add temp index for dpother 0 seconds
ALTER TABLE `dpother` 
ADD INDEX `index2` (`DONOR` ASC);

#delete foreign-key breaking rows   120 rows, 75 seconds
DELETE FROM dpother WHERE DONOR IN (
SELECT t.DONOR AS id from (
select OTHER.DONOR, CONTACT.id from dpother OTHER
left outer join dp CONTACT on CONTACT.id = OTHER.DONOR) t
WHERE t.id IS NULL);

#delete temporary index  0 seconds
ALTER TABLE `dpother` 
DROP INDEX `index2` ;

  #indexing dpother  3 hours
ALTER TABLE `dpother` 
ADD INDEX `index3` (`DONOR` ASC);
  ALTER TABLE `dpother` 
ADD CONSTRAINT `fk_dpother_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
  #adding dpother donor date amount index
  ALTER TABLE `dpother` 
ADD INDEX `ix_donor_date_amt` (`DONOR` ASC, `DATE` ASC, `AMT` ASC),
ADD INDEX `ix_date` (`DATE` ASC),
ADD INDEX `ix_demand` (`DEMAND` ASC),
ADD INDEX `ix_amt` (`AMT` ASC),
ADD INDEX `ix_mode` (`MODE` ASC),
ADD INDEX `ix_pledge_groups` (`GL` ASC),
ADD INDEX `ix_requests` (`REQUESTS` ASC),
ADD INDEX `ix_tba_reqs` (`TBAREQS` ASC);
ADD FULLTEXT INDEX `ix_sol_fulltext` (`SOL` ASC);

  
#indexing dplink
ALTER TABLE `dplink` 
ADD INDEX `fk_dplink_dp_ID1_idx` (`ID1` ASC),
ADD INDEX `fk_dplink_dp_ID2_idx` (`ID2` ASC);
ALTER TABLE `dplink` 
ADD CONSTRAINT `fk_dplink_dp_ID1`
  FOREIGN KEY (`ID1`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `fk_dplink_dp_ID2`
  FOREIGN KEY (`ID2`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

  #cleaning bad indexes
  DELETE b FROM dpmisc b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;
	  
  #indexing dpmisc
ALTER TABLE `dpmisc` 
ADD INDEX `index2` (`DONOR` ASC);
ALTER TABLE `dpmisc` 
ADD CONSTRAINT `fk_dpmisc_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
  #additional indexes
  ALTER TABLE `dpmisc` 
ADD INDEX `index3` (`MDATE` ASC),
ADD INDEX `index4` (`SOL` ASC),
ADD INDEX `index5` (`MTYPE` ASC),
ADD INDEX `index6` (`MCOUNT` ASC),
ADD INDEX `index7` (`MAMT` ASC),
ADD INDEX `index8` (`MYEAR` ASC);


#indexing dpothadd
ALTER TABLE `dpothadd` 
ADD INDEX `index2` (`DONOR` ASC);
ALTER TABLE `dpothadd` 
ADD CONSTRAINT `fk_dpothadd_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
#clean dpplg2 - 1 row

DELETE b FROM dpplg b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;

#dpplg
ALTER TABLE `dpplg` 
ADD INDEX `ix_dpplg_dp_idx` (`DONOR` ASC);
ALTER TABLE `dpplg` 
ADD CONSTRAINT `ix_dpplg_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
#clean dpplg2 - 1 row
DELETE b FROM dpplg2 b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;
      
#dpplg2
ALTER TABLE `dpplg2` 
ADD INDEX `fk_dpplg2_dp_idx` (`DONOR` ASC);
ALTER TABLE `dpplg2` 
ADD CONSTRAINT `fk_dpplg2_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

	  
#dtbishop
ALTER TABLE `dtbishop` 
ADD INDEX `fk_dtbishop_dp_idx` (`DONOR` ASC);
ALTER TABLE `dtbishop` 
ADD CONSTRAINT `fk_dtbishop_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
ALTER TABLE `dtbishop` 
ADD INDEX `index3` (`RESPONSE` ASC);


#dtdondet NOT DONE

#dtdontmas

#dtdonsum
ALTER TABLE `dtdonsum` 
ADD INDEX `fk_dtdonsum_dp_idx` (`DONOR` ASC);
ALTER TABLE `dtdonsum` 
ADD CONSTRAINT `fk_dtdonsum_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;


#indexing DTMAIL

ALTER TABLE `dtmail` 
ADD INDEX `ix_DONOR_SOL_database_origin` (`DONOR` ASC, `SOL` ASC, `database_origin` ASC);



#ALTER TABLE `dtmail` 
#ADD INDEX `fk_dtmail_dp_idx` (`DONOR` ASC);
#ALTER TABLE `dtmail` 
#ADD CONSTRAINT `fk_dtmail_dp`
#  FOREIGN KEY (`DONOR`)
#  REFERENCES `dp` (`id`)
#  ON DELETE RESTRICT
#  ON UPDATE RESTRICT;

#additional indexes
ALTER TABLE `dtmail` 
ADD INDEX `index3` (`SOL` ASC);


#clean DTMajor

DELETE b FROM dpordersummary b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;

#dtmajor
ALTER TABLE `dtmajor` 
ADD INDEX `fk_dtmajor_dp_idx` (`DONOR` ASC);
ALTER TABLE `dtmajor` 
ADD CONSTRAINT `fk_dtmajor_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

  #dtvolmas
  
  #dtvolord
  ALTER TABLE `dtvolord` 
ADD INDEX `fk_dtvolord_dp_idx` (`DONOR` ASC);
ALTER TABLE `dtvolord` 
ADD CONSTRAINT `fk_dtvolord_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

  # Clearout orphaned records
  DELETE b FROM dtvols1 b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;
	  
  #dtvols1
  ALTER TABLE `dtvols1` 
ADD INDEX `fk_dtvols1_dp_idx` (`DONOR` ASC);
ALTER TABLE `dtvols1` 
ADD CONSTRAINT `fk_dtvols1_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
ALTER TABLE `dtvols1` 
ADD INDEX `index3` (`VORIGIN` ASC),
ADD INDEX `index4` (`VSDATE` ASC),
ADD INDEX `index5` (`VCATEG` ASC),
ADD INDEX `index6` (`VGRADE01` ASC),
ADD INDEX `index7` (`VGRADE02` ASC),
ADD INDEX `index8` (`VGRADE03` ASC),
ADD INDEX `index9` (`VGRADE04` ASC),
ADD INDEX `index10` (`VGRADE05` ASC),
ADD INDEX `index11` (`VGRADE06` ASC),
ADD INDEX `index12` (`VGRADE07` ASC),
ADD INDEX `index13` (`VGRADE08` ASC),
ADD INDEX `index14` (`VGRADE09` ASC),
ADD INDEX `index15` (`VGRADE10` ASC),
ADD INDEX `index16` (`VGRADE11` ASC),
ADD INDEX `index17` (`VGRADE12` ASC),
ADD INDEX `index18` (`VGRADE13` ASC),
ADD INDEX `index19` (`VGRADE14` ASC),
ADD INDEX `index20` (`VGRADE15` ASC),
ADD INDEX `index21` (`VGRADE16` ASC),
ADD INDEX `index22` (`VSPECTAL` ASC);




# UPDATING dp.status column

call update_ContactStatus(null);


  
  
  
  
  
  
  
  
  
  
  
  
  




# Updating Ecclisiastical tab column values  53 seconds, 
UPDATE dp SET ecc_enabled = true WHERE database_origin = 3 OR database_origin = 8 OR database_origin = 10 OR database_origin = 12;
UPDATE dp SET ecc_enabled = false WHERE database_origin != 3 AND database_origin != 8 AND database_origin != 10 AND database_origin != 12;


#Updating Volunteer table

UPDATE dtvols1 SET `VCATEG` = 'N' WHERE `VCATEG` IS NULL;


# Updating Lanugages

# Adding other languages
# Adding non-english primary  17 seconds  260,823 records
INSERT INTO dplang (DONOR, LANGUAGE, database_origin) SELECT id, LANGUAGE, database_origin FROM dp WHERE LANGUAGE != 'E';
# Adding english for records without primary language as english   13 seconds  27,305 records
INSERT INTO dplang (DONOR, LANGUAGE, database_origin) SELECT id, 'E', database_origin FROM dp WHERE LANGUAGE != 'E' AND ENGLISH = 'Y';
#Adding all English recrods - 1.181,961 records  38 seconds
INSERT INTO dplang (DONOR, LANGUAGE, database_origin) SELECT id, 'E', database_origin FROM dp WHERE LANGUAGE = 'E';

# Updating Translations   - 21 records- 0 time
INSERT INTO dptrans (DONOR, LANGUAGE, database_origin) SELECT DONOR, 'F', database_origin FROM dtvols1 WHERE VGRADE17 IS NOT NULL AND VGRADE18 != 'N';
INSERT INTO dptrans (DONOR, LANGUAGE, database_origin) SELECT DONOR, 'I', database_origin FROM dtvols1 WHERE VGRADE18 IS NOT NULL AND VGRADE18 != 'N';
INSERT INTO dptrans (DONOR, LANGUAGE, database_origin) SELECT DONOR, 'G', database_origin FROM dtvols1 WHERE VGRADE19 IS NOT NULL AND VGRADE18 != 'N';
INSERT INTO dptrans (DONOR, LANGUAGE, database_origin) SELECT DONOR, 'S', database_origin FROM dtvols1 WHERE VGRADE20 IS NOT NULL AND VGRADE20 != 'N';
INSERT INTO dptrans (DONOR, LANGUAGE, database_origin) SELECT DONOR, 'P', database_origin FROM dtvols1 WHERE VGRADE21 IS NOT NULL AND VGRADE21 != 'N';

#todo- DPother- 2 records..  1102721  1622498




#CREATING notes

CREATE TABLE `notes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `DONOR` INT NOT NULL,
  `user` VARCHAR(45) NOT NULL,
  `type` ENUM('layman','ecclesiastical','volunteer','orders') NOT NULL,
  `text` TEXT NULL,
  `database_origin` INT NULL,
  `last_modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));

  ALTER TABLE `notes` 
ADD INDEX `fk_notes_dp_idx` (`DONOR` ASC);
ALTER TABLE `notes` 
ADD CONSTRAINT `fk_notes_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;
  
  ## copying over notes into layman tab
  INSERT INTO `notes`
(
`DONOR`,
`user`,
`type`,
`text`)
SELECT dp.id, 'Default', 'layman', dp.NARR FROM dp WHERE dp.NARR IS NOT NULL;

INSERT INTO `notes`
(
`DONOR`,
`user`,
`type`,
`text`)
SELECT DONOR , 'Default', 'layman', dtbishop.BISNOTES FROM dtbishop WHERE BISNOTES IS NOT NULL;

INSERT INTO `notes`
(
`DONOR`,
`user`,
`type`,
`text`)
SELECT DONOR , 'Default', 'layman', MAJNOTES FROM dtmajor WHERE MAJNOTES IS NOT NULL;

INSERT INTO `notes`
(
`DONOR`,
`user`,
`type`,
`text`)
SELECT DONOR , 'Default', 'layman', VNOTES FROM dtvols1 WHERE VNOTES IS NOT NULL;



  
  
#Adding Country for American database

UPDATE `dp`
SET
`COUNTRY` = 'United States'

WHERE `database_origin` = 1;

#Adding Country for Canadian database

UPDATE `dp`
SET
`COUNTRY` = 'Canada'

WHERE `database_origin` = 2;

#Change Country USA to United States for consistency

UPDATE `dp`
SET
`COUNTRY` = 'United States'

WHERE `COUNTRY` LIKE '%USA';





# POST FIXES IMPORT- for DONOR ORDERS..
DELETE FROM dtdonsum WHERE ORDNUM IS NULL;
DELETE FROM dtdonsum WHERE ORDNUM LIKE 'Z%';  # deletes bad records..

# Kill 97 duplicates 26 seconds
ALTER IGNORE TABLE `dtdonsum` 
ADD UNIQUE INDEX `index2` (`ORDNUM` ASC, `database_origin` ASC);

# 200 seconds
update dtdonsum SET id = id + 100000000;
update dtdonsum SET id = ORDNUM + 1000000 WHERE database_origin = 1;
update dtdonsum SET id = ORDNUM + 3000000 WHERE database_origin = 2;
update dtdonsum SET id = ORDNUM + 4000000 WHERE database_origin = 3;
update dtdonsum SET id = ORDNUM + 5000000 WHERE database_origin = 4;
update dtdonsum SET id = ORDNUM + 6000000 WHERE database_origin = 5;
update dtdonsum SET id = ORDNUM + 7000000 WHERE database_origin = 6;
update dtdonsum SET id = ORDNUM + 8000000 WHERE database_origin = 7;
update dtdonsum SET id = ORDNUM + 9000000 WHERE database_origin = 8;
update dtdonsum SET id = ORDNUM + 10000000 WHERE database_origin = 9;
update dtdonsum SET id = ORDNUM + 11000000 WHERE database_origin = 10;
update dtdonsum SET id = ORDNUM + 12000000 WHERE database_origin = 11;
update dtdonsum SET id = ORDNUM + 13000000 WHERE database_origin = 12;




#Dtdondet alteration
ALTER TABLE `dtdondet` 
RENAME TO `dporderdetails` ;
ALTER TABLE `dporderdetails` 
ADD INDEX `index2` (`ORDNUMD` ASC);

DELETE FROM dporderdetails WHERE ORDNUMD IS NULL;


# Creating dpordersummary
CREATE TABLE `dpordersummary` ( `id` INT NOT NULL, `DONOR` INT NULL, `SOL` VARCHAR(255) NULL, `DATE` DATE NULL, `ORDNUM` VARCHAR(255) NULL, `SHIPFROM` VARCHAR(255) NULL, `OPER` VARCHAR(255) NULL, `SHIPDATE` DATE NULL, `ORIGDATE` DATE NULL, `ORIGENV` VARCHAR(255) NULL, `IPAID` VARCHAR(255) NULL, `SANDH` VARCHAR(255) NULL, `SANDHAMT` FLOAT(8,2) NULL, `CREDITCD` FLOAT(8,2) NULL, `CASHONLY` FLOAT(8,2) NULL, `CASH` FLOAT(8,2) NULL, `CREDIT` FLOAT(8,2) NULL, `ETOTAL` FLOAT(8,2) NULL, `ECONV` FLOAT(8,2) NULL, `ESHIP` FLOAT(8,2) NULL, `PSTCALC` FLOAT(8,2) NULL, `GSTCALC` FLOAT(8,2) NULL, `HSTCALC` FLOAT(8,2) NULL, `NYTCALC` FLOAT(8,2) NULL, `GTOTAL` FLOAT(8,2) NULL, `VNOTE` LONGTEXT NULL, `BATCHED` TINYINT(4) NULL, `PST` VARCHAR(255) NULL, `GST` VARCHAR(255) NULL, `HST` VARCHAR(255) NULL, `NYTAX` FLOAT(8,2) NULL, `COUNTY` VARCHAR(255) NULL, `COUNTYNM` VARCHAR(255) NULL, `ENT_DT` DATE NULL, `FUNDS` VARCHAR(255) NULL, `GFUNDS` VARCHAR(255) NULL, `CURCONV` FLOAT(8,2) NULL, `TITLE` VARCHAR(255) NULL, `FNAME` VARCHAR(255) NULL, `LNAME` VARCHAR(255) NULL, `SUFF` VARCHAR(255) NULL, `SECLN` VARCHAR(255) NULL, `ADD` VARCHAR(255) NULL, `CITY` VARCHAR(255) NULL, `ST` VARCHAR(255) NULL, `ZIP` VARCHAR(255) NULL, `COUNTRY` VARCHAR(255) NULL, `PHTYPE1` VARCHAR(255) NULL, `PHTYPE2` VARCHAR(255) NULL, `PHTYPE3` VARCHAR(255) NULL, `PHONE` VARCHAR(255) NULL, `PHON2` VARCHAR(255) NULL, `PHON3` VARCHAR(255) NULL, `LASTPAGE` VARCHAR(255) NULL, `PRINFLAG` TINYINT(4) NULL, `TSRECID` VARCHAR(255) NULL, `TSDATE` VARCHAR(255) NULL, `TSTIME` VARCHAR(255) NULL, `TSCHG` VARCHAR(255) NULL, `TSBASE` VARCHAR(255) NULL, `TSLOCAT` VARCHAR(255) NULL, `TSIDCODE` VARCHAR(255) NULL, `database_origin` TINYINT(4) NULL, `SURFCOST` FLOAT(8,2) NULL, `MBAGCOST` FLOAT(8,2) NULL, `OTHCOST` FLOAT(8,2) NULL, `MAILFLAG` TINYINT(4) NULL, `PRINREM` TINYINT(4) NULL, `RETURNED` VARCHAR(255) NULL,  `order_type` INT NULL, PRIMARY KEY (`id`));




# POST FIXES IMPORT- for DONOR ORDERS..
DELETE FROM dtvolord WHERE ORDNUM IS NULL;


update dtvolord SET id = id + 15000000;



# Migrate Donor Order Summary Data to new order summary table 27 seconds

insert into dpordersummary(id,DONOR,SOL,`DATE`,ORDNUM,SHIPFROM,OPER,SHIPDATE,ORIGDATE,ORIGENV,IPAID,SANDH,SANDHAMT,CREDITCD,CASHONLY,CASH,CREDIT,ETOTAL,ECONV,ESHIP,PSTCALC,GSTCALC,HSTCALC,NYTCALC,GTOTAL,VNOTE,BATCHED,PST,GST,HST,NYTAX,COUNTY,COUNTYNM,ENT_DT,FUNDS,GFUNDS,CURCONV,TITLE,FNAME,LNAME,SUFF,SECLN,`ADD`,CITY,ST,ZIP,COUNTRY,PHTYPE1,PHTYPE2,PHTYPE3,PHONE,PHON2,PHON3,LASTPAGE,PRINFLAG,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin,SURFCOST,MBAGCOST,OTHCOST,MAILFLAG,PRINREM,RETURNED,order_type)
SELECT id,DONOR,SOL,`DATE`,ORDNUM,SHIPFROM,OPER,SHIPDATE,ORIGDATE,ORIGENV,IPAID,SANDH,SANDHAMT,CREDITCD,CASHONLY,CASH,CREDIT,ETOTAL,ECONV,ESHIP,PSTCALC,GSTCALC,HSTCALC,NYTCALC,GTOTAL,VNOTE,BATCHED,PST,GST,HST,NYTAX,COUNTY,COUNTYNM,ENT_DT,FUNDS,GFUNDS,CURCONV,TITLE,FNAME,LNAME,SUFF,SECLN,`ADD`,CITY,ST,ZIP,COUNTRY,PHTYPE1,PHTYPE2,PHTYPE3,PHONE,PHON2,PHON3,LASTPAGE,PRINFLAG,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin,null,null,null,null,null,null,1
FROM dtdonsum;


# Add Index to dtvolord 5 seconds

ALTER TABLE `dtvolord` 
ADD INDEX `ix_donor` (`DONOR` ASC);

# Migrate Free Gift Order Summary Data to new order summary table

insert into dpordersummary(id,DONOR,SOL,`DATE`,ORDNUM,SHIPFROM,OPER,SHIPDATE,ORIGDATE,ORIGENV,IPAID,SANDH,SANDHAMT,CREDITCD,CASHONLY,CASH,CREDIT,ETOTAL,ECONV,ESHIP,PSTCALC,GSTCALC,HSTCALC,NYTCALC,GTOTAL,VNOTE,BATCHED,PST,GST,HST,NYTAX,COUNTY,COUNTYNM,ENT_DT,FUNDS,GFUNDS,CURCONV,TITLE,FNAME,LNAME,SUFF,SECLN,`ADD`,CITY,ST,ZIP,COUNTRY,PHTYPE1,PHTYPE2,PHTYPE3,PHONE,PHON2,PHON3,LASTPAGE,PRINFLAG,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin,SURFCOST,MBAGCOST,OTHCOST,MAILFLAG,PRINREM,RETURNED,order_type)
SELECT ORDERS.id,ORDERS.DONOR,ORDERS.SOL,ORDERS.`DATE`,ORDERS.ORDNUM,ORDERS.SHIPFROM,ORDERS.OPER,ORDERS.SHIPDATE,ORDERS.ORIGDATE,ORDERS.ORIGENV,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,ORDERS.VNOTE,ORDERS.BATCHED,null,null,null,null,null,null,null,null,null,null,CONTACT.TITLE,CONTACT.FNAME,CONTACT.LNAME,CONTACT.SUFF,CONTACT.SECLN,CONTACT.`ADD`,CONTACT.CITY,CONTACT.ST,CONTACT.ZIP,CONTACT.COUNTRY,CONTACT.PHTYPE1,CONTACT.PHTYPE2,CONTACT.PHTYPE3,CONTACT.PHONE,CONTACT.PHON2,CONTACT.PHON3,null,ORDERS.PRINFLAG,ORDERS.TSRECID,ORDERS.TSDATE,ORDERS.TSTIME,ORDERS.TSCHG,ORDERS.TSBASE,ORDERS.TSLOCAT,ORDERS.TSIDCODE,ORDERS.database_origin,ORDERS.SURFCOST,ORDERS.MBAGCOST,ORDERS.OTHCOST,ORDERS.MAILFLAG,ORDERS.PRINREM,ORDERS.RETURNED,2
FROM dtvolord ORDERS inner join
	dp CONTACT on ORDERS.DONOR = CONTACT.id;

	
# Migrate Free Gift Order Details Data to new order summary table for the first line entry approximately 30 seconds for all

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY01,null,null,null,LITEMN01,LITEMD01,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY01 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the second line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY02,null,null,null,LITEMN02,LITEMD02,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY02 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the third line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY03,null,null,null,LITEMN03,LITEMD03,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY03 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the fourth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY04,null,null,null,LITEMN04,LITEMD04,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY04 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the fifth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY05,null,null,null,LITEMN05,LITEMD05,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY05 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the sixth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY06,null,null,null,LITEMN06,LITEMD06,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY06 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the seventh line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY07,null,null,null,LITEMN07,LITEMD07,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY07 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the eighth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY08,null,null,null,LITEMN08,LITEMD08,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY08 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the ninth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY09,null,null,null,LITEMN09,LITEMD09,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY09 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the tenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY10,null,null,null,LITEMN10,LITEMD10,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY10 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the eleventh line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY11,null,null,null,LITEMN11,LITEMD11,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY11 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the twelth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY12,null,null,null,LITEMN12,LITEMD12,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY12 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the thirteenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY13,null,null,null,LITEMN13,LITEMD13,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY13 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the fourteenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY14,null,null,null,LITEMN14,LITEMD14,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY14 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the fifteenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY15,null,null,null,LITEMN15,LITEMD15,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY15 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the sixteenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY16,null,null,null,LITEMN16,LITEMD16,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY16 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the seventeenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY17,null,null,null,LITEMN17,LITEMD17,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY17 > 0;

# Migrate Free Gift Order Details Data to new order summary table for the eighteenth line entry

insert into dporderdetails(ORDNUMD,PAGED,LINED,DONORD,LQTY,SQTY,BQTY,LSTOC,LITEMP,LITEMD,LPRICE,LDISC,LCURR,LEXT,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin)
SELECT id,null,null,DONOR,LQTY18,null,null,null,LITEMN18,LITEMD18,null,null,null,null,TSRECID,TSDATE,TSTIME,TSCHG,TSBASE,TSLOCAT,TSIDCODE,database_origin
FROM dtvolord
WHERE LQTY18 > 0;


#add autoincrement to dpordersummary
ALTER TABLE `dpordersummary` 
CHANGE COLUMN `id` `id` INT(11) NOT NULL AUTO_INCREMENT ;


# ADD donor key
ALTER TABLE `dpordersummary` 
ADD INDEX `fk_dpordersummary_dp_idx` (`DONOR` ASC);

# 132 records need cleaning to add KEY
DELETE b FROM dpordersummary b 
  LEFT JOIN dp f ON f.id = b.DONOR 
      WHERE f.id IS NULL;
	  
ALTER IGNORE TABLE `dpordersummary` 
ADD CONSTRAINT `fk_dpordersummary_dp`
  FOREIGN KEY (`DONOR`)
  REFERENCES `dp` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

ALTER TABLE `dpordersummary` 
ADD FULLTEXT INDEX `fulltext_donor` (`FNAME` ASC, `LNAME` ASC);

  ALTER TABLE `dpordersummary` 
ADD INDEX `ix_database_origin` (`database_origin` ASC),
ADD INDEX `ix_SHIPFROM` (`SHIPFROM` ASC);

  


## Exchange rates tables

CREATE TABLE `dpcurrency` (
  `id` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `code` VARCHAR(45) NOT NULL,
  `symbol` VARCHAR(45) NOT NULL,
  `order` INT NOT NULL ,
  PRIMARY KEY (`id`));
  
INSERT INTO `dpcurrency` (`id`, `name`, `code`, `symbol`,1) VALUES ('U', 'United States Dollar', 'USD', '$');
INSERT INTO `dpcurrency` (`id`, `name`, `code`, `symbol`,0) VALUES ('C', 'Canadian Dollar', 'CAD', '$');
INSERT INTO `dpcurrency` (`id`, `name`, `code`, `symbol`,3) VALUES ('P', 'Philipine Peso', 'PHP', '₱');
INSERT INTO `dpcurrency` (`id`, `name`, `code`, `symbol`,4) VALUES ('R', 'Indian Rupee', 'INR', '₹');
INSERT INTO `dpcurrency` (`id`, `name`, `code`, `symbol`,2) VALUES ('E', 'Euro', 'EUR', '€');


CREATE TABLE `dpexchange` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `currency_from` VARCHAR(45) NOT NULL,
  `currency_to` VARCHAR(45) NOT NULL,
  `date` DATE NOT NULL,
  `exchange_rate` FLOAT NOT NULL,
  PRIMARY KEY (`id`));

  INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('1', 'C', 'U', '1997-12-31', '0.75');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('2', 'C', 'U', '1998-08-31', '0.715');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('3', 'C', 'U', '2000-12-31', '0.667');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('4', 'C', 'U', '2002-12-31', '0.662');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('5', 'C', 'U', '2003-04-30', '0.654');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('6', 'C', 'U', '2004-12-31', '0.73');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('7', 'C', 'U', '2007-07-09', '0.8');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('8', 'C', 'U', '2007-12-31', '0.9');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('9', 'C', 'U', '2008-09-30', '1');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('10', 'C', 'U', '2008-10-31', '0.85');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('11', 'C', 'U', '2011-08-19', '0.75');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('12', 'C', 'U', '2051-01-01', '1');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('13', 'P', 'U', '2051-01-01', '0.0208');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('14', 'R', 'U', '2015-01-01', '0.0205');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('15', 'E', 'U', '2004-01-31', '0.9843');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('16', 'E', 'U', '2004-12-31', '0.9843');
INSERT INTO `dpexchange` (`id`, `currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('17', 'E', 'U', '2050-12-31', '1.304');


ALTER TABLE `dpexchange` 
ADD INDEX `fk_dpexchange_dpcurrency_idx` (`currency_from` ASC),
ADD INDEX `fk_dpexchange_dpcurrency_to_idx` (`currency_to` ASC);
ALTER TABLE `dpexchange` 
ADD CONSTRAINT `fk_dpexchange_dpcurrency_from`
  FOREIGN KEY (`currency_from`)
  REFERENCES `dpcurrency` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT,
ADD CONSTRAINT `fk_dpexchange_dpcurrency_to`
  FOREIGN KEY (`currency_to`)
  REFERENCES `dpcurrency` (`id`)
  ON DELETE RESTRICT
  ON UPDATE RESTRICT;

INSERT INTO `dpexchange` (`currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('C', 'U', '1980-01-01', '1');
INSERT INTO `dpexchange` (`currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('E', 'U', '1980-01-01', '1');
INSERT INTO `dpexchange` (`currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('P', 'U', '1980-01-01', '1');
INSERT INTO `dpexchange` (`currency_from`, `currency_to`, `date`, `exchange_rate`) VALUES ('R', 'U', '1980-01-01', '1');
  



CREATE TABLE `templates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `userId` INT NOT NULL,
  `location` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `data` TEXT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `index2` (`userId` ASC, `location` ASC));
  
  
CREATE TABLE `dpexchange_history` (
`id` INT NOT NULL AUTO_INCREMENT,
`currency_from` VARCHAR(45) NULL,
`currency_to` VARCHAR(45) NULL,
`date` DATE NULL,
`exchange_rate` FLOAT NULL,
PRIMARY KEY (`id`));

ALTER TABLE `dpexchange_history` 
ADD INDEX `ix_currency_from_date` (`currency_from` ASC, `date` ASC);


######   SPROC DECLARATION-  Sprocs should be loaded BEFORE running this script!!!
#DROP PROCEDURE IF EXISTS filldates_dpexchange_history;
#DELIMITER |
#CREATE PROCEDURE filldates_dpexchange_history(dateStart DATE, dateEnd DATE, currfrom varchar(45), currto varchar(45))
#BEGIN
#WHILE dateStart <= dateEnd DO
#INSERT INTO dpexchange_history (`date`, currency_from, currency_to) VALUES (dateStart, currfrom, currto);
#SET dateStart = date_add(dateStart, INTERVAL 1 DAY);
#END WHILE;
#END;
#|
#DELIMITER ;


CALL filldates_dpexchange_history('1980-01-01','2050-12-31','C','U');
CALL filldates_dpexchange_history('1980-01-01','2050-12-31','P','U');
CALL filldates_dpexchange_history('1980-01-01','2050-12-31','R','U');
CALL filldates_dpexchange_history('1980-01-01','2050-12-31','E','U');


######   SPROC DECLARATION-  Sprocs should be loaded BEFORE running this script!!!
#DROP PROCEDURE IF EXISTS update_dpexchange_history;
#DELIMITER |
#CREATE PROCEDURE update_dpexchange_history()
#BEGIN

#DECLARE currfrom varchar(45);
#DECLARE currto varchar(45);
#DECLARE currdate DATE;
#DECLARE currrate FLOAT;
#DECLARE finished INT(11);
#DECLARE cur1 CURSOR FOR SELECT currency_from, currency_to, `date`, exchange_rate from dpexchange ORDER BY `date` ASC;
#DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
#OPEN cur1;

#get_exchangerate: LOOP
#FETCH cur1 INTO currfrom, currto, currdate, currrate;
#IF finished = 1 THEN
#LEAVE get_exchangerate;
#END IF;
-- Do important stuff

#UPDATE dpexchange_history
#SET exchange_rate = currrate
#WHERE currency_from = currfrom
#AND currency_to = currto
#AND `date` >= currdate;

#END LOOP get_exchangerate;

#CLOSE cur1;


#END;
#|
#DELIMITER ;


call update_dpexchange_history();


DELETE FROM dpcodes
WHERE `FIELD` = 'LANGUAGE';

INSERT INTO dpcodes (FIELD, `CODE`, `DESC` , `database_origin`)
SELECT 'LANGUAGE', `iso_639-1`, `name`, 1
FROM languages;

UPDATE dplang
SET `LANGUAGE` = 'en'
WHERE `LANGUAGE` = 'E';

UPDATE dplang
SET `LANGUAGE` = 'fr'
WHERE `LANGUAGE` = 'F';

UPDATE dplang
SET `LANGUAGE` = 'de'
WHERE `LANGUAGE` = 'G';

UPDATE dplang
SET `LANGUAGE` = 'it'
WHERE `LANGUAGE` = 'I';

UPDATE dplang
SET `LANGUAGE` = 'pt'
WHERE `LANGUAGE` = 'P';

UPDATE dplang
SET `LANGUAGE` = 'es'
WHERE `LANGUAGE` = 'S';


UPDATE dptrans
SET `LANGUAGE` = 'en'
WHERE `LANGUAGE` = 'E';

UPDATE dptrans
SET `LANGUAGE` = 'fr'
WHERE `LANGUAGE` = 'F';

UPDATE dptrans
SET `LANGUAGE` = 'de'
WHERE `LANGUAGE` = 'G';

UPDATE dptrans
SET `LANGUAGE` = 'it'
WHERE `LANGUAGE` = 'I';

UPDATE dptrans
SET `LANGUAGE` = 'pt'
WHERE `LANGUAGE` = 'P';

UPDATE dptrans
SET `LANGUAGE` = 'es'
WHERE `LANGUAGE` = 'S';



UPDATE dp
SET `LANGUAGE` = 'en'
WHERE `LANGUAGE` = 'E';

UPDATE dp
SET `LANGUAGE` = 'fr'
WHERE `LANGUAGE` = 'F';

UPDATE dp
SET `LANGUAGE` = 'de'
WHERE `LANGUAGE` = 'G';

UPDATE dp
SET `LANGUAGE` = 'it'
WHERE `LANGUAGE` = 'I';

UPDATE dp
SET `LANGUAGE` = 'pt'
WHERE `LANGUAGE` = 'P';

UPDATE dp
SET `LANGUAGE` = 'es'
WHERE `LANGUAGE` = 'S';


CREATE TABLE dpcodes2 LIKE dpcodes;

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT FIELD,`CODE`,database_origin
FROM dpcodes where database_origin = 1;

/*SELECT DISTINCT dpcodes.FIELD,dpcodes.`CODE`,2
FROM dpcodes left join dpcodes2 on dpcodes.FIELD = dpcodes2.FIELD AND dpcodes.`CODE` = dpcodes2.`CODE`
where dpcodes.database_origin = 2 and codeIDs.FIELD is null
LIMIT 100000*/

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,2
FROM dpcodes where database_origin = 2 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,3
FROM dpcodes where database_origin = 3 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,4
FROM dpcodes where database_origin = 4 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,5
FROM dpcodes where database_origin = 5 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,6
FROM dpcodes where database_origin = 6 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,7
FROM dpcodes where database_origin = 7 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,8
FROM dpcodes where database_origin = 8 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,9
FROM dpcodes where database_origin = 9 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,10
FROM dpcodes where database_origin = 10 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,11
FROM dpcodes where database_origin = 11 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

INSERT INTO dpcodes2 (FIELD,`CODE`,database_origin)
SELECT DISTINCT FIELD,`CODE`,12
FROM dpcodes where database_origin = 12 AND (FIELD,`CODE`) NOT IN (SELECT FIELD,`CODE` FROM dpcodes2);

/* 800 seconds */
UPDATE dpcodes2 
INNER JOIN dpcodes ON dpcodes2.FIELD = dpcodes.FIELD AND dpcodes2.`CODE` = dpcodes.`CODE` AND dpcodes2.database_origin = dpcodes.database_origin
SET dpcodes2.`DESC` = dpcodes.`DESC`, 
dpcodes2.CATEGORY = dpcodes.CATEGORY, 
dpcodes2.`LIST` = dpcodes.`LIST`, 
dpcodes2.RECP=dpcodes.RECP, 
dpcodes2.MCAT_HI = dpcodes.MCAT_HI, 
dpcodes2.MCAT_LO = dpcodes.MCAT_LO, 
dpcodes2.MCAT_GL = dpcodes.MCAT_GL, 
dpcodes2.AMR_DROP = dpcodes.AMR_DROP, 
dpcodes2.CDN_DROP = dpcodes.CDN_DROP, 
dpcodes2.PRINTING = dpcodes.PRINTING, 
dpcodes2.OTHER = dpcodes.OTHER, 
dpcodes2.CODEDATE = dpcodes.CODEDATE, 
dpcodes2.MAILED = dpcodes.MAILED, 
dpcodes2.PLAYED = dpcodes.PLAYED, 
dpcodes2.ACTNUMB = dpcodes.ACTNUMB, 
dpcodes2.`FORMAT` = dpcodes.`FORMAT`;

DROP TABLE dpcodes;

RENAME TABLE dpcodes2 to dpcodes;


#Change Country USA to United States for consistency

UPDATE `dpcodes`
SET
`CODE` = 'United States'
WHERE `FIELD` = 'COUNTRY' AND `CODE` LIKE '%USA';


#Adding missing class codes
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AQ', 'Prospect-04', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AR', 'Prospect-05', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AS', 'Prospect-06', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AT', 'Prospect-07', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AU', 'Prospect-08', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AV', 'Prospect-09', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AW', 'Prospect-10', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AX', 'Prospect-11', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AY', 'Prospect-12', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'AZ', 'Prospect-13', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'A0', 'Prospect-14', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'A1', 'Prospect-15', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');

INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CQ', 'Referrals-04', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CR', 'Referrals-05', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CS', 'Referrals-06', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CT', 'Referrals-07', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CU', 'Referrals-08', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CV', 'Referrals-09', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CW', 'Referrals-10', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CX', 'Referrals-11', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CY', 'Referrals-12', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'CZ', 'Referrals-13', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'C0', 'Referrals-14', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'C1', 'Referrals-15', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');

INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EQ', 'Contacts-04', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'ER', 'Contacts-05', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'ES', 'Contacts-06', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'ET', 'Contacts-07', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EU', 'Contacts-08', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EV', 'Contacts-09', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EW', 'Contacts-10', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EX', 'Contacts-11', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EY', 'Contacts-12', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'EZ', 'Contacts-13', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'E0', 'Contacts-14', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'E1', 'Contacts-15', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');

INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GQ', 'Buyers-04', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GR', 'Buyers-05', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GS', 'Buyers-06', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GT', 'Buyers-07', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GU', 'Buyers-08', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GV', 'Buyers-09', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GW', 'Buyers-10', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GX', 'Buyers-11', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GY', 'Buyers-12', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'GZ', 'Buyers-13', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'G0', 'Buyers-14', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');
INSERT INTO `dpcodes` (`FIELD`, `CODE`, `DESC`, `MCAT_HI`, `MCAT_LO`, `AMR_DROP`, `CDN_DROP`, `PRINTING`, `OTHER`, `MAILED`, `PLAYED`, `database_origin`) VALUES ('CLASS', 'G1', 'Buyers-15', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '1');

#Adding total_donation_amount and total_donation_records columns  ~800 Seconds
ALTER TABLE `dp` 
ADD COLUMN `total_donation_amount` FLOAT(8,2) NOT NULL AFTER `PERM_SOLS`,
ADD COLUMN `total_donation_records` INT(11) NOT NULL AFTER `total_donation_amount`;

# Call sproc to update all the donations
call update_DonationTotals(NULL);


# CAMPAIGN
# Clean duplications from campaign - databases
CREATE TABLE campaign2 LIKE campaign;

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT CAMPSOL,CAMPTYPE,database_origin
FROM campaign where database_origin = 1;

/*SELECT DISTINCT campaign.CAMPSOL,campaign.CAMPTYPE,2
FROM campaign left join campaign2 on campaign.CAMPSOL = campaign2.CAMPSOL AND campaign.CAMPTYPE = campaign2.CAMPTYPE
where campaign.database_origin = 2 and codeIDs.CAMPSOL is null
LIMIT 100000*/

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,2
FROM campaign where database_origin = 2 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,3
FROM campaign where database_origin = 3 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,4
FROM campaign where database_origin = 4 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,5
FROM campaign where database_origin = 5 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,6
FROM campaign where database_origin = 6 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,7
FROM campaign where database_origin = 7 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,8
FROM campaign where database_origin = 8 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,9
FROM campaign where database_origin = 9 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,10
FROM campaign where database_origin = 10 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,11
FROM campaign where database_origin = 11 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

INSERT INTO campaign2 (CAMPSOL,CAMPTYPE,database_origin)
SELECT DISTINCT CAMPSOL,CAMPTYPE,12
FROM campaign where database_origin = 12 AND (CAMPSOL,CAMPTYPE) NOT IN (SELECT CAMPSOL,CAMPTYPE FROM campaign2);

/* 800 seconds */
UPDATE campaign2 
INNER JOIN campaign ON campaign2.CAMPSOL = campaign.CAMPSOL AND campaign2.CAMPTYPE = campaign.CAMPTYPE AND campaign2.database_origin = campaign.database_origin
SET campaign2.`CAMPDESC` = campaign.`CAMPDESC`;

DROP TABLE campaign;

RENAME TABLE campaign2 to campaign;


#CAMPAIGN
# Add column to dpcodes
ALTER TABLE `dpcodes` 
ADD COLUMN `CAMPTYPE` VARCHAR(255) NULL DEFAULT NULL AFTER `ACTNUMB`;


#CAMPAIGN - prep with index
ALTER TABLE `campaign` 
ADD INDEX `ix_CAMPSOL` (`CAMPSOL` ASC);

#CAMPAIGN
# CAMPAIGN - Copy over from campaign import
UPDATE dpcodes
INNER JOIN campaign ON 
(dpcodes.FIELD = 'SOL' AND dpcodes.CODE  = campaign.CAMPSOL)
SET dpcodes.CAMPTYPE = campaign.CAMPTYPE;

# Add CAMPTYPES to dpcodes
INSERT INTO `dpcodes`
(
`FIELD`,
`CODE`,
`DESC`)
SELECT 'CAMPTYPE',  CAMPTYPE, CAMPDESC FROM fatima_center_donor_tracker_v2.campaign GROUP BY CAMPTYPE;






#PledgeMon Report

# Create database table that will store pledges  -wrong

CREATE TABLE `dpplg_pledmonhistory` (
  `id` INT NULL AUTO_INCREMENT,
  `DONOR` INT NOT NULL,
  `month` DATE NOT NULL,
  
  // WRONG BELOW
  `prev_pledger` TINYINT(1) NOT NULL,
  `new` TINYINT(1) NOT NULL,
  `cancelled` TINYINT(1) NOT NULL,
  `renewed` TINYINT(1) NOT NULL,
  `is_pledger` TINYINT(1) NOT NULL,
  `deliquent` TINYINT(1) NOT NULL,
  `pledge_count` INT(11) NOT NULL,
  `pledge_amount` FLOAT(8,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));






