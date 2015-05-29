DELIMITER $$
CREATE PROCEDURE `filldates_dpexchange_history`(dateStart DATE, dateEnd DATE, currfrom varchar(45), currto varchar(45))
BEGIN
  WHILE dateStart <= dateEnd DO
    INSERT INTO dpexchange_history (`date`, currency_from, currency_to) VALUES (dateStart, currfrom, currto);
    SET dateStart = date_add(dateStart, INTERVAL 1 DAY);
  END WHILE;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_CategoryReport`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` VARCHAR(255), 
		IN `solCodes` VARCHAR(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT t.`Code`,
	t.`Description`,
	SUM(t.`# of Donors`) as '# of Donors',
	ROUND(SUM(t.`Total Donations`),2) as 'Total Donations',
	SUM(t.`# of Sales`) as ' # of Sales',
	ROUND(SUM(t.`Total Sales`),2) as 'Total Sales',
	SUM(t.`# of Pledges`) as '# of Pledges',
	ROUND(SUM(t.`Pledge Payments`),2) as 'Pledge Payments',
	SUM(t.`# of M & T`) as '# of M & T',
	ROUND(SUM(t.`Total M & T`),2) as 'Total M & T',
	SUM(t.`# of Masses`) as '# of Masses',
	ROUND(SUM(t.`Total Masses`),2) as 'Total Masses',
	SUM(t.`Nil Contacts`) as 'Nil Contacts',
	SUM(t.`Counts`) as 'Counts',
	ROUND(SUM(t.`Totals`),2) as 'Totals',
	TRUNCATE(IFNULL(SUM(t.`Totals`) / (SUM(t.`# of Donors`) + SUM(t.`# of Sales`)), 0), 2) as 'Avg'
from
(
SELECT SOL as 'Code',
		dpcodelist.CATEGORY as 'Category',
		dpcodelist.`DESC` as 'Description',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then 1 else 0 END as '# of Donors',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then AMT*exchange_rate else 0 END as 'Total Donations',
		0 as '# of Sales',
		0 as 'Total Sales',
		Case When dpgift.PLEDGE = 'Y' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then 1 else 0 END as '# of Pledges',
		Case When dpgift.PLEDGE = 'Y' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then AMT*exchange_rate else 0 END as 'Pledge Payments',
		Case When dpgift.DEMAND = 'MT' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then 1 else 0 END as '# of M & T',
		Case When dpgift.DEMAND = 'MT' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then AMT*exchange_rate else 0 END as 'Total M & T',
		0 as '# of Masses',
		0 as 'Total Masses',
		0 as 'Nil Contacts',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then 1 else 0 END as 'Counts', # Total number of donors, sales, and nil contacts
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then AMT*exchange_rate else 0 END as 'Totals' # Total amount of donations and sales
	FROM dpgift
		INNER JOIN (select distinct `CODE`, FIELD, `DESC`, `CATEGORY` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on 
			dpgift.SOL = dpcodelist.CODE
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpgift.`DATE` AND dpgift.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpgift.DONOR
	WHERE dpgift.`DATE` >= startDate
		AND dpgift.`DATE` <= endDate
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	UNION ALL
	SELECT SOL as 'Code',
		dpcodelist.CATEGORY as 'Category',
		dpcodelist.`DESC` as 'Description',
		0 as '# of Donors',
		0 as 'Total Donations',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then 1 else 0 END as '# of Sales',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then AMT*exchange_rate else 0 END as 'Total Sales',
		0 as '# of Pledges',
		0 as 'Pledge Payments',
		0 as '# of M & T', #Memorials and Tributes
		0  as 'Total M & T',
		Case When dpother.TRANSACT IN ('MS') then 1 else 0 END as '# of Masses',
		Case When dpother.TRANSACT IN ('MS') then AMT*exchange_rate else 0 END as 'Total Masses',
		Case When dpother.TRANSACT IN ('CA','PD','LR') then 1 else 0 END as 'Nil Contacts',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then 1 else 0 END + Case When dpother.TRANSACT IN ('CA','PD','LR') then 1 else 0 END as 'Counts',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then AMT*exchange_rate else 0 END as 'Totals'
	FROM dpother
		INNER JOIN (select distinct `CODE`, FIELD, `DESC`, `CATEGORY` 
					from dpcodes 
					where FIELD = 'SOL' 
						and (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on (dpother.SOL = dpcodelist.CODE)
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpother.`DATE` AND dpother.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpother.DONOR
	WHERE dpother.`DATE` >= startDate
		AND dpother.`DATE` <= endDate
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	UNION ALL
	
	SELECT CONCAT(dpcodelist.CATEGORY,'|') as 'Code',
		dpcodelist.CATEGORY as 'Category',
		'Total' as 'Description',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then 1 else 0 END as '# of Donors',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then AMT*exchange_rate else 0 END as 'Total Donations',
		0 as '# of Sales',
		0 as 'Total Sales',
		Case When dpgift.PLEDGE = 'Y' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then 1 else 0 END as '# of Pledges',
		Case When dpgift.PLEDGE = 'Y' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then AMT*exchange_rate else 0 END as 'Pledge Payments',
		Case When dpgift.DEMAND = 'MT' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then 1 else 0 END as '# of M & T',
		Case When dpgift.DEMAND = 'MT' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then AMT*exchange_rate else 0 END as 'Total M & T',
		0 as '# of Masses',
		0 as 'Total Masses',
		0 as 'Nil Contacts',
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then 1 else 0 END as 'Counts', # Total number of donors, sales, and nil contacts
		Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') then AMT*exchange_rate else 0 END as 'Totals' # Total amount of donations and sales
	FROM dpgift
		INNER JOIN (select distinct `CODE`, FIELD, `DESC`, `CATEGORY` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on 
			dpgift.SOL = dpcodelist.CODE
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpgift.`DATE` AND dpgift.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpgift.DONOR
	WHERE dpgift.`DATE` >= startDate
		AND dpgift.`DATE` <= endDate
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	UNION ALL
	SELECT CONCAT(dpcodelist.CATEGORY,'|') as 'Code',
		dpcodelist.CATEGORY as 'Category',
		'Total' as 'Description',
		0 as '# of Donors',
		0 as 'Total Donations',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then 1 else 0 END as '# of Sales',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then AMT*exchange_rate else 0 END as 'Total Sales',
		0 as '# of Pledges',
		0 as 'Pledge Payments',
		0 as '# of M & T', #Memorials and Tributes
		0  as 'Total M & T',
		Case When dpother.TRANSACT IN ('MS') then 1 else 0 END as '# of Masses',
		Case When dpother.TRANSACT IN ('MS') then AMT*exchange_rate else 0 END as 'Total Masses',
		Case When dpother.TRANSACT IN ('CA','PD','LR') then 1 else 0 END as 'Nil Contacts',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then 1 else 0 END + Case When dpother.TRANSACT IN ('CA','PD','LR') then 1 else 0 END as 'Counts',
		Case When dpother.TRANSACT IN ('SE','SF','SS') then AMT*exchange_rate else 0 END as 'Totals'
	FROM dpother
		INNER JOIN (select distinct `CODE`, FIELD, `DESC`, `CATEGORY` 
					from dpcodes 
					where FIELD = 'SOL' 
						and (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))
						) As dpcodelist on (dpother.SOL = dpcodelist.CODE)
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpother.`DATE` AND dpother.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpother.DONOR
	WHERE dpother.`DATE` >= startDate
		AND dpother.`DATE` <= endDate
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
) t
GROUP BY t.`CODE`
ORDER BY t.`Category`, t.`Code` asc;




END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_CategoryReportGT`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` varchar(255), 
		IN `solCodes` varchar(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
Select `Type`,
	SUM(t.Count) as 'Count',
	SUM(t.AMT) as 'Total'
FROM
(SELECT 'Donations + Sales + Pledges + M&T' as `Type`,
	COUNT(*) as 'Count',
	ROUND(SUM(AMT*exchange_rate),2) as 'AMT'
FROM dpgift
		INNER JOIN (select distinct `CODE`, FIELD, `DESC` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on 
			dpgift.SOL = dpcodelist.CODE
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpgift.`DATE` AND dpgift.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpgift.DONOR
	WHERE dpgift.`DATE` >= startDate
		AND dpgift.`DATE` <= endDate
		AND dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY')
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
UNION ALL
SELECT Case When dpother.TRANSACT IN ('SE','SF','SS') then 'Donations + Sales + Pledges + M&T' else 'Masses' END as `Type`,
	COUNT(*),
	ROUND(SUM(AMT*exchange_rate),2)
FROM dpother
		INNER JOIN (select distinct `CODE`, FIELD, `DESC` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on 
			dpother.SOL = dpcodelist.CODE
		INNER JOIN dpexchange_history on dpexchange_history.`date` = dpother.`DATE` AND dpother.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
		INNER JOIN dp on dp.id = dpother.DONOR
	WHERE dpother.`DATE` >= startDate
		AND dpother.`DATE` <= endDate
		AND dpother.TRANSACT IN ('SE','SF','SS','MS')
		AND (country IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
GROUP BY `Type`
) t
GROUP BY `Type`

;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_CategoryReportSummary`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` varchar(255), 
		IN `solCodes` varchar(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN

SELECT t.COUNTRY as 'Country',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 1 THEN AMT END),0),2) as 'January',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 2 THEN AMT END),0),2) as 'February',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 3 THEN AMT END),0),2) as 'March',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 4 THEN AMT END),0),2) as 'April',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 5 THEN AMT END),0),2) as 'May',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 6 THEN AMT END),0),2) as 'June',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 7 THEN AMT END),0),2) as 'July',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 8 THEN AMT END),0),2) as 'August',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 9 THEN AMT END),0),2) as 'September',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 10 THEN AMT END),0),2) as 'October',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 11 THEN AMT END),0),2) as 'November',
	ROUND(IFNULL(SUM(CASE WHEN t.MONTH = 12 THEN AMT END),0),2) as 'December',
	ROUND(IFNULL(SUM(AMT),0),2) as 'Total'
FROM
(SELECT dp.COUNTRY,
	MONTH(dpgift.`DATE`) as 'MONTH',
	SUM(dpgift.AMT*exchange_rate) as 'AMT'
FROM dp FORCE INDEX (ix_id_country) 
	INNER JOIN dpgift FORCE INDEX (ix_date_transact,ix_SOL_fulltext) on dpgift.DONOR = dp.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = dpgift.`DATE` AND dpgift.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE dpgift.`DATE` >= startDate
	AND dpgift.`DATE` <= endDate
	AND dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY')
	AND (solCodes IS NULL OR FIND_IN_SET(dpgift.`SOL`, solCodes))
	AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
GROUP BY dp.COUNTRY, `MONTH`
ORDER BY dp.COUNTRY DESC) t
GROUP BY COUNTRY;


END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_CategoryReportSummaryNil`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` varchar(255), 
		IN `solCodes` varchar(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN

SELECT t.CountType as 'Type',
	IFNULL(SUM(CASE WHEN t.MONTH = 1 THEN t.Count END),0) as 'January',
	IFNULL(SUM(CASE WHEN t.MONTH = 2 THEN t.Count END),0) as 'February',
	IFNULL(SUM(CASE WHEN t.MONTH = 3 THEN t.Count END),0) as 'March',
	IFNULL(SUM(CASE WHEN t.MONTH = 4 THEN t.Count END),0) as 'April',
	IFNULL(SUM(CASE WHEN t.MONTH = 5 THEN t.Count END),0) as 'May',
	IFNULL(SUM(CASE WHEN t.MONTH = 6 THEN t.Count END),0) as 'June',
	IFNULL(SUM(CASE WHEN t.MONTH = 7 THEN t.Count END),0) as 'July',
	IFNULL(SUM(CASE WHEN t.MONTH = 8 THEN t.Count END),0) as 'August',
	IFNULL(SUM(CASE WHEN t.MONTH = 9 THEN t.Count END),0) as 'September',
	IFNULL(SUM(CASE WHEN t.MONTH = 10 THEN t.Count END),0) as 'October',
	IFNULL(SUM(CASE WHEN t.MONTH = 11 THEN t.Count END),0) as 'November',
	IFNULL(SUM(CASE WHEN t.MONTH = 12 THEN t.Count END),0) as 'December',
	IFNULL(SUM(t.Count),0) as 'Total'
FROM
(SELECT Case When dpother.TRANSACT IN ('CA','PD','LR') then 'Nil Contacts' When dpother.TRANSACT IN ('SE','SF','SS') then 'Donations' else '' END as 'CountType',
	MONTH(`DATE`) as 'MONTH',
	1 as 'Count'
FROM dpother
	INNER JOIN (select distinct `CODE`, FIELD, `DESC` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on dpother.SOL = dpcodelist.CODE
	INNER JOIN dp on dp.id = dpother.DONOR
	WHERE dpother.`DATE` >= StartDate
		AND dpother.`DATE` <= EndDate
		AND dpother.TRANSACT IN ('CA','PD','LR','SE','SF','SS')
		AND (country IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
UNION ALL
SELECT Case When dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') OR dpgift.PLEDGE = 'Y' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') OR dpgift.DEMAND = 'MT' AND dpgift.TRANSACT IN ('DD','DF','DN','DY') then 'Donations' else '' END as 'CountType',
	MONTH(`DATE`) as 'MONTH',
	1 as 'Count'
FROM dpgift
	INNER JOIN (select distinct `CODE`, FIELD, `DESC` from dpcodes where FIELD = 'SOL' AND (solCodes IS NULL OR FIND_IN_SET(`CODE`, solCodes))) As dpcodelist on dpgift.SOL = dpcodelist.CODE
	INNER JOIN dp on dp.id = dpgift.DONOR
	WHERE dpgift.`DATE` >= StartDate
		AND dpgift.`DATE` <= EndDate
		AND dpgift.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY')
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
) t
GROUP BY CountType
;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_DailyMailComputerReport`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` VARCHAR(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT GIFT.ENVNO as 'Envelope #',
	CONTACT.id as 'Donor #',
	CONTACT.CLASS as 'Class',
	CONCAT(IFNULL(CONTACT.TITLE,'') , ' ' , IFNULL(CONTACT.FNAME,'') , ' ' , IFNULL(CONTACT.LNAME,'') , ' ' , IFNULL(CONTACT.SUFF,'')) as 'Name',
	CONCAT(IFNULL(CONTACT.`ADD`,'') ,  IF(CONTACT.`ADD` IS NOT NULL, ', ', '') 
	,IFNULL(CONTACT.`CITY`, '') , IF(CONTACT.`CITY` IS NOT NULL , ', ', '')
	,IFNULL(CONTACT.`ST`,''), IF(CONTACT.`ST` IS NOT NULL , ', ', '')
	,IFNULL(CONTACT.`ZIP`,'')
) as 'Address',
	CONTACT.COUNTRY as 'Country',
	GIFT.SOL as 'Provcode',
	GIFT.DEMAND as 'Dem',
	GIFT.TRANSACT as 'Trans',
	GIFT.`MODE` as 'Mode',
	ROUND(GIFT.AMT*exchange_rate,2) as 'Amount',
	GIFT.RECEIPT as 'Receipt #',
	CONTACT.VOLUNTEER as 'Vol.',
	Case When CONTACT.CLASS IN ('IH','II','IJ','IK') then 'Yes' else '' END as 'VIP'
FROM dpgift GIFT
	INNER JOIN dp CONTACT
	ON GIFT.DONOR = CONTACT.id
INNER JOIN dpexchange_history on dpexchange_history.`date` = GIFT.`DATE` AND GIFT.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE GIFT.`DATE` >= startDate
	AND GIFT.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
UNION ALL
SELECT OTHER.ENVNO as 'Envelope #',
	CONTACT.id as 'Donor #',
	CONTACT.CLASS as 'Class',
	CONCAT(IFNULL(CONTACT.TITLE,'') , ' ' , IFNULL(CONTACT.FNAME,'') , ' ' , IFNULL(CONTACT.LNAME,'') , ' ' , IFNULL(CONTACT.SUFF,'')) as 'Name',
	CONCAT(IFNULL(CONTACT.`ADD`,'') ,  IF(CONTACT.`ADD` IS NOT NULL, ', ', '') 
	,IFNULL(CONTACT.`CITY`, '') , IF(CONTACT.`CITY` IS NOT NULL , ', ', '')
	,IFNULL(CONTACT.`ST`,''), IF(CONTACT.`ST` IS NOT NULL , ', ', '')
	,IFNULL(CONTACT.`ZIP`,''), IF(CONTACT.`ZIP` IS NOT NULL , ', ', '')
) as 'Address',
	CONTACT.COUNTRY as 'Country',
	OTHER.SOL as 'Provcode',
	OTHER.DEMAND as 'Dem',
	OTHER.TRANSACT as 'Trans',
	OTHER.`MODE` as 'Mode',
	ROUND(OTHER.AMT*exchange_rate,2) as 'Amount',
	'' as 'Receipt #',
	CONTACT.VOLUNTEER as 'Vol.',
	Case When CONTACT.CLASS IN ('IH','II','IJ','IK') then 'Yes' else '' END as 'VIP'
FROM dpother OTHER
	INNER JOIN dp CONTACT
	ON OTHER.DONOR = CONTACT.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = OTHER.`DATE` AND OTHER.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE OTHER.`DATE` >= startDate
	AND OTHER.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
ORDER BY `Envelope #` asc;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_DailyMailComputerReportSummary`(IN `startDate` DATETIME,
		IN `endDate` DATETIME, 
		IN `currency` VARCHAR(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
# Donationsexcludecountry
SELECT 'Donations',
	ROUND(SUM(Case When GIFT.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') AND GIFT.AMT > 0 then GIFT.AMT*exchange_rate else 0 END),2) as 'Debit',
	ROUND(SUM(Case When GIFT.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') AND GIFT.AMT < 0 then GIFT.AMT*exchange_rate else 0 END),2) as 'Credit',
	ROUND(SUM(Case When GIFT.TRANSACT IN ('DD','DF','DN','DY','SD','SN','SY') Then GIFT.AMT*exchange_rate else 0 END),2) as 'Net'
FROM dpgift GIFT
	INNER JOIN dp CONTACT
	ON GIFT.DONOR = CONTACT.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = GIFT.`DATE` AND GIFT.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE GIFT.`DATE` >= startDate
	AND GIFT.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
UNION ALL
# Sales
SELECT 'Sales',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('SE','SF','SS') AND OTHER.AMT > 0 then AMT*exchange_rate else 0 END),2) as 'Debit',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('SE','SF','SS') AND OTHER.AMT < 0 then AMT*exchange_rate else 0 END),2) as 'Credit',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('SE','SF','SS') then AMT else 0 END),2) as 'Net'
FROM dpother OTHER
	INNER JOIN dp CONTACT
	ON OTHER.DONOR = CONTACT.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = OTHER.`DATE` AND OTHER.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE OTHER.`DATE` >= startDate
	AND OTHER.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
UNION ALL
# Masses
SELECT 'Mass Stipends',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('MS') AND OTHER.AMT > 0 then AMT*exchange_rate else 0 END),2) as 'Debit',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('MS') AND OTHER.AMT < 0 then AMT*exchange_rate else 0 END),2) as 'Credit',
	ROUND(SUM(Case When OTHER.TRANSACT IN ('MS') then AMT else 0 END),2) as 'Net'
FROM dpother OTHER
	INNER JOIN dp CONTACT
	ON OTHER.DONOR = CONTACT.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = OTHER.`DATE` AND OTHER.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE OTHER.`DATE` >= startDate
	AND OTHER.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
UNION ALL
# Pledges
SELECT 'Pledges',
	ROUND(SUM(Case When GIFT.PLEDGE = 'Y' AND GIFT.TRANSACT IN ('DD','DF','DN','DY') AND GIFT.AMT > 0 then AMT*exchange_rate else 0 END),2) as 'Debit',
	ROUND(SUM(Case When GIFT.PLEDGE = 'Y' AND GIFT.TRANSACT IN ('DD','DF','DN','DY') AND GIFT.AMT < 0 then AMT*exchange_rate else 0 END),2) as 'Credit',
	ROUND(SUM(Case When GIFT.PLEDGE = 'Y' AND GIFT.TRANSACT IN ('DD','DF','DN','DY') then AMT else 0 END),2) as 'Net'
FROM dpgift GIFT
	INNER JOIN dp CONTACT
	ON GIFT.DONOR = CONTACT.id
	INNER JOIN dpexchange_history on dpexchange_history.`date` = GIFT.`DATE` AND GIFT.CURR = dpexchange_history.currency_from AND dpexchange_history.currency_to = currency
WHERE GIFT.`DATE` >= startDate
	AND GIFT.`DATE` <= endDate
	AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry));
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_DonorClassReport`(IN `includeclass` VARCHAR(255), 
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT CLASS,
	`STATUS` as 'Status',
	COUNT(id) as 'Count'
FROM dp
WHERE (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE CONCAT(includeclass, '%')
	AND `STATUS` IS NOT NULL
GROUP BY CLASS, `STATUS`
UNION ALL
SELECT CLASS,

	'Total' as 'Status',
	COUNT(id) as 'Count'
FROM dp
WHERE CLASS IS NOT NULL
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE CONCAT(includeclass, '%')
	AND `STATUS` IS NOT NULL
GROUP BY CLASS
ORDER BY IF(SUBSTRING(CLASS, 2,length(CLASS)-1) REGEXP '[0-9]+', CONCAT('Z',SUBSTRING(CLASS, 2,length(CLASS)-1)), SUBSTRING(CLASS, 2,length(CLASS)-1) ) DESC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_DonorHistoryReport`(
	IN `includecountry` VARCHAR(255),
	IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT * FROM (
	SELECT
		DATE_FORMAT(`month`,"%Y-%m-%d")  as 'Date',
		dpdonorstatushistory.`status` as 'Donor Status',
		Count(dpdonorstatushistory.`status`) as 'Count'
	FROM dpdonorstatushistory
		JOIN dp on dp.id = dpdonorstatushistory.DONOR
	WHERE
		dpdonorstatushistory.`status` IN ('ACTIVE','INACTIVE','NEW')
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	GROUP BY `Date`, `Donor Status`

	UNION ALL

	SELECT
		DATE_FORMAT(`month`,"%Y-%m-%d")  as 'Date',
		'TOTAL' as 'Donor Status',
		Count(dpdonorstatushistory.`status`) as 'Count'
	FROM dpdonorstatushistory
		JOIN dp on dp.id = dpdonorstatushistory.DONOR
	WHERE
		dpdonorstatushistory.`status` IN ('ACTIVE','INACTIVE','NEW')
		AND (includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	GROUP BY `Date`, `Donor Status`
		
	UNION ALL

	SELECT
		DATE_FORMAT(`month`,"%Y-%m-%d")  as 'Date',
		`status_change` as 'Donor Status',
		Count(dpdonorstatushistory.`status`) as 'Count'
	FROM dpdonorstatushistory
		JOIN dp on dp.id = dpdonorstatushistory.DONOR
	WHERE
		(includecountry IS NULL OR FIND_IN_SET(dp.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(dp.COUNTRY, excludecountry))
	GROUP BY `Date`, `Donor Status`
) t
WHERE t.`Donor Status` IS NOT NULL
;

##CASE WHEN `last_status` = 'INACTIVE' AND (dpdonorstatushistory.`status` = 'ACTIVE_LAPSED' OR dpdonorstatushistory.`status` = 'INACTIVE_LAPSED') then 'Inactive to Lapsed'
##			 WHEN (`last_status` = 'INACTIVE_LAPSED' OR dpdonorstatushistory.`status` = 'ACTIVE_LAPSED') AND dpdonorstatushistory.`status` = 'ACTIVE' then 'Lapsed to Active'
##			 WHEN `last_status` = 'REMOVED' AND dpdonorstatushistory.`status` != 'REMOVED' then 'Reinstated'
##			 WHEN `last_status` != 'REMOVED' AND dpdonorstatushistory.`status` = 'REMOVED' then 'Removed'
##			 WHEN `last_status` = 'ACTIVE' AND dpdonorstatushistory.`status` = 'INACTIVE' then 'Active to Inactive'
##			 WHEN `last_status` = 'INACTIVE' AND dpdonorstatushistory.`status` = 'ACTIVE' then 'Inactive to Active'
##		ELSE NULL END as 'Donor Status'
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_LapsedDonorReport`(
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255),
		IN `contactstatus` VARCHAR(255)
)
BEGIN
SELECT YEAR(LASTDON) as 'Year',
	CLASS as 'Class',
	COUNT(id) as 'Count'
FROM dp FORCE INDEX (ix_CLASS_LASTDON_status_id)
WHERE CLASS IN ('IA','IB','IC','ID','IE','IF','IG','IH','II','IJ','IK')
	AND `status` = contactstatus
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND LASTDON IS NOT NULL
GROUP BY `Year`, CLASS
UNION ALL
SELECT YEAR(LASTDON) as 'Year',
	'Total' as 'Class',
	COUNT(id) as 'Count'
FROM dp FORCE INDEX (ix_CLASS_LASTDON_status_id)
WHERE CLASS IN ('IA','IB','IC','ID','IE','IF','IG','IH','II','IJ','IK')
	AND `status` = contactstatus 
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND LASTDON IS NOT NULL
GROUP BY `Year`;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_MailDropReport`(IN `startDate` DATETIME, 
			IN `endDate` DATETIME
		)
BEGIN
	SELECT PROVCODE as 'Sol+List/GL',
	TITLE as 'Description',
	CONCAT(IFNULL(ITEM1,'') ,  IF(ITEM2 IS NOT NULL, ', ', '') 
		,IFNULL(ITEM2, '') , IF(ITEM3 IS NOT NULL , ', ', '')
		,IFNULL(ITEM3,'') ,  IF(ITEM4 IS NOT NULL, ', ', '')
		,IFNULL(ITEM4,'') ,  IF(ITEM5 IS NOT NULL, ', ', '')
		,IFNULL(ITEM5,'')) as 'Package Items',
	DATE_FORMAT(DROP_DATE,"%Y-%m-%d") as 'Date',
	SHIPFROM as 'Ship From',
	DROP_CNT as 'Count',
	POSTCOST as 'Postage',
	PACKCOST as 'Package',
	LABCOST as 'Labour'
FROM
	maildrop
WHERE
	startDate IS NULL OR endDate IS NULL OR maildrop.DROP_DATE BETWEEN startDate AND endDate
ORDER BY
	`Sol+List/GL` ASC;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_MailoutReportActiveInactive`(IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT CLASS,
	`STATUS` as 'Status',
	COUNT(id) as 'Count'
FROM dp
WHERE (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE 'I%'
	AND `status` IN ('ACTIVE','INACTIVE')
GROUP BY CLASS, `STATUS`
UNION ALL
SELECT CLASS,
	NM_REASON as 'Reason',
	COUNT(id) as 'Count'
FROM dp
WHERE NM_REASON IN ('CE','CO','XS','XY')
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE 'I%'
	AND `status` IN ('ACTIVE','INACTIVE')
GROUP BY CLASS, NM_REASON
UNION ALL
SELECT CLASS,
	'Total' as 'Reason',
	COUNT(id) as 'Count'
FROM dp
WHERE (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE 'I%'
	AND `status` IN ('ACTIVE','INACTIVE')
GROUP BY CLASS;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_MailoutReportLapsed`(
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT YEAR(LASTDON) as 'Year',
	'ACTIVE_LAPSED' as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE CLASS LIKE 'I%'
	AND `STATUS` = 'ACTIVE_LAPSED'
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND LASTDON IS NOT NULL
GROUP BY `Year`

UNION ALL

SELECT YEAR(LASTDON) as 'Year',
	CONCAT(NM_REASON,'_ACTIVE_LAPSED') as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE CLASS LIKE 'I%'
	AND `STATUS` = 'ACTIVE_LAPSED'
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND NM_REASON IN ('CE','CO','XS','XY')
	AND LASTDON IS NOT NULL
GROUP BY `Year`, NM_REASON

UNION ALL

SELECT YEAR(LASTDON) as 'Year',
	'INACTIVE_LAPSED' as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE CLASS LIKE 'I%'
	AND `STATUS` = 'INACTIVE_LAPSED'
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND LASTDON IS NOT NULL
GROUP BY `Year`

UNION ALL

SELECT YEAR(LASTDON) as 'Year',
	CONCAT(NM_REASON,'_INACTIVE_LAPSED') as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE CLASS LIKE 'I%'
	AND `STATUS` = 'INACTIVE_LAPSED'
	AND (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND NM_REASON IN ('CE','CO','XS','XY')
	AND LASTDON IS NOT NULL
GROUP BY `Year`, NM_REASON;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_MailoutReportOther`(
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255),
		IN `includeclass` VARCHAR(255)
)
BEGIN
SELECT CLASS as 'Class',
	'Count' as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE CONCAT(includeclass, '%')
GROUP BY CLASS

UNION ALL

SELECT CLASS as 'Class',
	NM_REASON as 'Column',
	COUNT(id) as 'Count'
FROM dp
WHERE (includecountry IS NULL OR FIND_IN_SET(COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(COUNTRY, excludecountry))
	AND CLASS LIKE CONCAT(includeclass, '%')
	AND NM_REASON IN ('CE','CO')
GROUP BY CLASS, NM_REASON;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_OrderItemDistributionReport`(IN `startOrderDate` DATETIME,
		IN `endOrderDate` DATETIME, 
		IN `startShipDate` DATETIME, 
		IN `endShipDate` DATETIME,
		IN `shipFromCodes` VARCHAR(255),
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255))
BEGIN

SELECT CONCAT(dporderdetails.LITEMP, ' - ', dporderdetails.LITEMD) as 'Item # - Description',
	'Donated Qty' as 'Column',
	SUM(dporderdetails.LQTY) as 'Value'
FROM dpordersummary
	JOIN dporderdetails on dpordersummary.id = dporderdetails.ORDNUMD
WHERE (LPRICE = 0
	OR LDISC = 100
	OR LPRICE IS NULL)
	AND (shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY `Item # - Description`  ##dporderdetails.LITEMP

UNION ALL

SELECT CONCAT(dporderdetails.LITEMP, ' - ', dporderdetails.LITEMD) as 'Item # - Description',
	'Donated Orders' as 'Column',
	COUNT(dpordersummary.id) as 'Value'
FROM dpordersummary
	JOIN dporderdetails on dpordersummary.id = dporderdetails.ORDNUMD
WHERE (LPRICE = 0
	OR LDISC = 100
	OR LPRICE IS NULL)
	AND (shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY `Item # - Description` ##dporderdetails.LITEMP

UNION ALL

SELECT CONCAT(dporderdetails.LITEMP, ' - ', dporderdetails.LITEMD) as 'Item # - Description',
	'Sales Qty' as 'Column',
	SUM(dporderdetails.LQTY) as 'Value'
FROM dpordersummary
	JOIN dporderdetails on dpordersummary.id = dporderdetails.ORDNUMD
WHERE (LPRICE != 0
	AND LDISC < 100
	AND LPRICE IS NOT NULL)
	AND (shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY `Item # - Description` ##dporderdetails.LITEMP

UNION ALL

SELECT CONCAT(dporderdetails.LITEMP, ' - ', dporderdetails.LITEMD) as 'Item # - Description',
	'Sales Orders' as 'Column',
	COUNT(dpordersummary.id) as 'Value'
FROM dpordersummary
	JOIN dporderdetails on dpordersummary.id = dporderdetails.ORDNUMD
WHERE (LPRICE != 0
	AND LDISC < 100
	AND LPRICE IS NOT NULL)
	AND (shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY `Item # - Description`
ORDER BY `Item # - Description`, `Column`; ##dporderdetails.LITEMP;
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_PledgeDelinquentReport`(
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255)
)
BEGIN
SELECT `Donor Number`,
	`Name`,
	`Address`,
	DATE_FORMAT(`Last Pledge Payment`,"%Y-%m-%d") AS `Last Pledge Payment`
FROM (
	SELECT CONTACT.id as 'Donor Number',
		CONCAT(IFNULL(CONTACT.TITLE,'') , ' ' , IFNULL(CONTACT.FNAME,'') , ' ' , IFNULL(CONTACT.LNAME,'') , ' ' , IFNULL(CONTACT.SUFF,'')) as 'Name',
		CONCAT(IFNULL(CONTACT.`ADD`,'') ,  IF(CONTACT.`ADD` IS NOT NULL, ', ', '') 
		,IFNULL(CONTACT.`CITY`, '') , IF(CONTACT.`CITY` IS NOT NULL , ', ', '')
		,IFNULL(CONTACT.`ST`,''), IF(CONTACT.`ST` IS NOT NULL , ', ', '')
		,IFNULL(CONTACT.`ZIP`,''), IF(CONTACT.`ZIP` IS NOT NULL , ', ', '')
		,IFNULL(CONTACT.`COUNTRY`,'')
		) as 'Address',
		PLEDGOR,
		PLEDGE,
		MAX(dpgift.`DATE`) as 'Last Pledge Payment'
	FROM dp CONTACT
		LEFT JOIN dpgift on CONTACT.id = dpgift.DONOR
	WHERE CONTACT.PLEDGOR = 'Y'
		AND (dpgift.PLEDGE = 'Y' OR dpgift.PLEDGE IS NULL)
		AND (dpgift.SOL LIKE 'PP%' OR dpgift.SOL IS NULL)
		AND (includecountry IS NULL OR FIND_IN_SET(CONTACT.COUNTRY, includecountry))
		AND (excludecountry IS NULL OR NOT FIND_IN_SET(CONTACT.COUNTRY, excludecountry))
	GROUP BY CONTACT.id
) t
WHERE (t.`Last Pledge Payment` <= DATE_SUB(NOW(), INTERVAL 30 DAY) OR t.`Last Pledge Payment` IS NULL);
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `reports_VolunteerInventoryReport`(IN `startOrderDate` DATETIME,
		IN `endOrderDate` DATETIME, 
		IN `startShipDate` DATETIME, 
		IN `endShipDate` DATETIME,
		IN `shipFromCodes` VARCHAR(255),
		IN `includecountry` VARCHAR(255),
		IN `excludecountry` VARCHAR(255))
BEGIN
SELECT LITEMP as 'Item #',
	LITEMD as 'Description',
	COUNT(LITEMP) as 'Order Quantity'
FROM
	dpordersummary JOIN
	dporderdetails ON dpordersummary.id = dporderdetails.ORDNUMD
	INNER JOIN dp on dp.id = dpordersummary.DONOR
WHERE
	(shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND LITEMP IS NOT NULL
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY
	LITEMP
UNION ALL
SELECT CONCAT(LEFT(LITEMP,1),'} Order Total') as 'Item #',
	'' as 'Description',
	COUNT(LEFT(LITEMP,1)) as 'Order Quantity'
FROM
	dpordersummary JOIN
	dporderdetails ON dpordersummary.id = dporderdetails.ORDNUMD
	INNER JOIN dp on dp.id = dpordersummary.DONOR
WHERE
	(shipFromCodes IS NULL OR FIND_IN_SET(dpordersummary.SHIPFROM, shipFromCodes))
	AND (startOrderDate IS NULL OR endOrderDate IS NULL OR dpordersummary.`DATE` BETWEEN startOrderDate AND endOrderDate)
	AND (startShipDate IS NULL OR endShipDate IS NULL OR dpordersummary.SHIPDATE BETWEEN startShipDate AND endShipDate)
	AND LITEMP IS NOT NULL
	AND (includecountry IS NULL OR FIND_IN_SET(dpordersummary.COUNTRY, includecountry))
	AND (excludecountry IS NULL OR NOT FIND_IN_SET(dpordersummary.COUNTRY, excludecountry))
GROUP BY
	`Item #`
ORDER BY
	`Item #` ASC;
	
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `select_MaxMinTransactionDates`()
BEGIN

SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR;

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `update_ContactStatus`()
sproc_task:BEGIN
DECLARE dateback1month DATE;
DECLARE dateback2years DATE;
DECLARE dateback5years DATE;
SET dateback1month = DATE(DATE_ADD(NOW(),INTERVAL -1 MONTH));
SET dateback2years = DATE(DATE_ADD(NOW(),INTERVAL -2 YEAR));
SET dateback5years = DATE(DATE_ADD(NOW(),INTERVAL -5 YEAR));


## Updates all NEW contacts 30 days 
UPDATE dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
SET 
    status = 'NEW'
		WHERE `Gift Date Min`  = `Gift Date Max`
AND `Gift Date Max` > dateback1month
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));



 
 
## Updates all  contacts to ACTIVE with gifts within 2 years (And NOT NEW)
UPDATE dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
SET 
    status = 'ACTIVE'
WHERE `Gift Date Max` > dateback2years 
AND (`Gift Date Max` < dateback1month OR  `Gift Date Max` != `Gift Date Min`)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));


## Updates all  contacts to INACTIVE with gifts between 2 and 5 years
UPDATE dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
SET 
    status = 'INACTIVE'
WHERE `Gift Date Max` > dateback5years 
AND (`Gift Date Max` < dateback2years)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));



## Updates all  contacts to INACTIVE_LAPSED with most recent gift > 5 years old and most recent transaction > 5 years old
UPDATE dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
SET
    status = 'INACTIVE_LAPSED'
WHERE 
(`Gift Date Max` IS NOT NULL OR  `Other Date Max` IS NOT NULL)
AND (`Gift Date Max` IS NULL OR `Gift Date Max` < dateback5years)
AND (`Other Date Max` IS NULL OR `Other Date Max` <  dateback5years)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));




## Updates all  contacts to ACTIVE_LAPSED with gifts > 5 years and transactions witin 5 years
UPDATE dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
SET
    status = 'ACTIVE_LAPSED'
WHERE `Gift Date Max` < dateback5years 
AND `Other Date Max` IS NULL OR `Other Date Max` >  dateback5years 
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));

UPDATE dp
SET status = 'LIMBO'
WHERE dp.NM_REASON IN ('RR', 'RL', 'RD');

UPDATE dp
SET status = 'REMOVED'
WHERE dp.NM_REASON IN ('XR', 'XL', 'XD');

END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `update_DonorStatusHistory`(IN now DATE )
BEGIN

DECLARE dateback1month DATE;
DECLARE dateback2years DATE;
DECLARE dateback5years DATE;

SET dateback1month = DATE(DATE_ADD(now,INTERVAL -1 MONTH));
SET dateback2years = DATE(DATE_ADD(now,INTERVAL -2 YEAR));
SET dateback5years = DATE(DATE_ADD(now,INTERVAL -5 YEAR));



## Updates all NEW contacts 30 days 
INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'NEW' FROM dp
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
		WHERE `Gift Date Min`  = `Gift Date Max`
AND `Gift Date Max` > dateback1month
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));


## Updates all  contacts to ACTIVE with gifts within 2 years (And NOT NEW)
INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'ACTIVE' FROM dp 
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
WHERE `Gift Date Max` > dateback2years 
AND (`Gift Date Max` < dateback1month OR  `Gift Date Max` != `Gift Date Min`)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));


## Updates all  contacts to INACTIVE with gifts between 2 and 5 years
INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'INACTIVE' FROM dp 
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
WHERE `Gift Date Max` > dateback5years 
AND (`Gift Date Max` < dateback2years)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));


## Updates all  contacts to INACTIVE_LAPSED with most recent gift > 5 years old and most recent transaction > 5 years old
INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'INACTIVE_LAPSED' FROM dp 
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
WHERE 
(`Gift Date Max` IS NOT NULL OR  `Other Date Max` IS NOT NULL)
AND (`Gift Date Max` IS NULL OR `Gift Date Max` < dateback5years)
AND (`Other Date Max` IS NULL OR `Other Date Max` <  dateback5years)
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));


## Updates all  contacts to ACTIVE_LAPSED with gifts > 5 years and transactions witin 5 years
INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'ACTIVE_LAPSED' FROM dp 
INNER JOIN
(SELECT DONOR as 'Donor',
		MIN(t.`Gift Date Min`) as 'Gift Date Min',
		MAX(t.`Gift Date Max`) as 'Gift Date Max',
		MIN(t.`Other Date Min`) as 'Other Date Min',
		MAX(t.`Other Date Max`) as 'Other Date Max'
FROM (
	SELECT DONOR as 'Donor',
			null as 'Gift Date Min',
			null as 'Gift Date Max',
			MIN(`DATE`) as 'Other Date Min',
			MAX(`DATE`) as 'Other Date Max'
			FROM dpother FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
	UNION ALL
	SELECT DONOR as 'Donor',
			MIN(`DATE`) as 'Gift Date Min',
			MAX(`DATE`) as 'Gift Date Max',
			null as 'Other Date Min',
			null as 'Other Date Max'
			FROM dpgift FORCE INDEX (ix_donor_date_amt)
			WHERE `DATE` < now
			group by DONOR
) t
WHERE t.DONOR IS NOT NULL
GROUP BY DONOR LIMIT 10000000) dpgiftother
ON dp.id = dpgiftother.Donor
WHERE `Gift Date Max` < dateback5years 
AND `Other Date Max` >  dateback5years 
AND (dp.NM_REASON IS NULL or dp.NM_REASON NOT IN ('RR', 'RL', 'RD', 'XR', 'XL', 'XD'));



INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'LIMBO' FROM dp 
WHERE dp.NM_REASON IN ('RR', 'RL', 'RD');

INSERT INTO dpdonorstatushistory (`DONOR`, `month`, `status`)
SELECT dp.id, now , 'REMOVED' FROM dp 
WHERE dp.NM_REASON IN ('XR', 'XL', 'XD');



END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `update_DonorStatusHistoryChanges`(IN now DATE)
BEGIN

DECLARE dateback1month DATE;
SET dateback1month = DATE(DATE_ADD(now,INTERVAL -1 MONTH));


UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory`.`month` = now )
SET `dpdonorstatushistory`.`last_status` = `dpdonorstatushistory_lastmonth`.`status`;


UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory_lastmonth`.`status` = 'INACTIVE'
AND `dpdonorstatushistory`.`month` = now 
AND (`dpdonorstatushistory`.`status` = 'ACTIVE_LAPSED' OR `dpdonorstatushistory`.`status` = 'INACTIVE_LAPSED'))
SET `dpdonorstatushistory`.`status_change` = 'Inactive to Lapsed';


UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND (`dpdonorstatushistory_lastmonth`.`status` = 'INACTIVE_LAPSED' OR `dpdonorstatushistory_lastmonth`.`status` = 'ACTIVE_LAPSED')
AND `dpdonorstatushistory`.`month` = now 
AND `dpdonorstatushistory`.`status` = 'ACTIVE')
SET `dpdonorstatushistory`.`status_change` = 'Lapsed to Active';



UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory_lastmonth`.`status` = 'REMOVED'
AND `dpdonorstatushistory`.`month` = now 
AND `dpdonorstatushistory`.`status` != 'REMOVED')
SET `dpdonorstatushistory`.`status_change` = 'Reinstated';



UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory_lastmonth`.`status` != 'REMOVED'
AND `dpdonorstatushistory`.`month` = now 
AND `dpdonorstatushistory`.`status` = 'REMOVED')
SET `dpdonorstatushistory`.`status_change` = 'Removed';


UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory_lastmonth`.`status` = 'ACTIVE'
AND `dpdonorstatushistory`.`month` = now 
AND `dpdonorstatushistory`.`status` = 'INACTIVE')
SET `dpdonorstatushistory`.`status_change` = 'Active to Inactive';




UPDATE dpdonorstatushistory 
INNER JOIN dpdonorstatushistory as dpdonorstatushistory_lastmonth 
ON (dpdonorstatushistory.DONOR = dpdonorstatushistory_lastmonth.DONOR 
AND `dpdonorstatushistory_lastmonth`.`month` = dateback1month
AND `dpdonorstatushistory_lastmonth`.`status` = 'INACTIVE'
AND `dpdonorstatushistory`.`month` = now 
AND `dpdonorstatushistory`.`status` = 'ACTIVE')
SET `dpdonorstatushistory`.`status_change` = 'Inactive to Active';



END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `update_dpexchange_history`()
BEGIN

	DECLARE currfrom varchar(45);
	DECLARE currto varchar(45);
	DECLARE currdate DATE;
	DECLARE currrate FLOAT;
	DECLARE finished INT(11);
	DECLARE cur1 CURSOR FOR SELECT currency_from, currency_to, `date`, exchange_rate from dpexchange ORDER BY `date` ASC;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
	OPEN cur1;
	
	get_exchangerate: LOOP
		FETCH cur1 INTO currfrom, currto, currdate, currrate;
	IF finished = 1 THEN
	LEAVE get_exchangerate;
	END IF;
	
	-- Do important stuff

	UPDATE dpexchange_history
	SET exchange_rate = currrate
	WHERE currency_from = currfrom
		AND currency_to = currto
		AND `date` >= currdate;

	END LOOP get_exchangerate;

	CLOSE cur1;
	
	
END$$
DELIMITER ;
