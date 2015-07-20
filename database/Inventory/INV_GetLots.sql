USE `nms`;
DROP procedure IF EXISTS `INV_GetLots`;

DELIMITER $$
USE `nms`$$
CREATE PROCEDURE `INV_GetLots` ()
BEGIN
select 
        `inv_cur_lots`.`id` AS `id`,
        `inv_cur_lots`.`serial_no` AS `serial_no`,
        `inv_cfg_mat_brands`.`id` AS `brandID`,
        `inv_cfg_mat_brands`.`brand` AS `brand`,
        `inv_cfg_mat_types`.`id` AS `typeID`,
        `inv_cfg_mat_types`.`type` AS `type`,
        `inv_cur_lots`.`quantity` AS `quantity`,
        `inv_cfg_uom`.`id` AS `uomID`,
        `inv_cfg_uom`.`uom` AS `uom`,
        `inv_cfg_lot_status`.`id` AS `lotStatusID`,
        `inv_cfg_lot_status`.`status` AS `lotStatus`,
        `inv_cfg_locations`.`id` AS `locationID`,
        `inv_cfg_locations`.`location` AS `location`,
        `tread_depth_val`.`value` AS `tread_depth`,
        `side_wall_val`.`value` AS `side_wall`,
        `tire_type_val`.`value` AS `tire_type`,
        `tire_size_val`.`value` AS `tire_size`,
        `inv_cur_lots`.`price` AS `price`,
        date_format(`inv_cur_lots`.`born_date`, '%Y-%m-%d') AS `date_added`,
        `inv_cur_lots`.`user_name` AS `user_name`,
        `inv_cur_lots`.`notes` AS `notes`
    from
        (((((((((((((`inv_cur_lots`
        left join `inv_cfg_mat_brands` ON ((`inv_cfg_mat_brands`.`id` = `inv_cur_lots`.`inv_cfg_mat_brands_id`)))
        left join `inv_cfg_mat_types` ON ((`inv_cfg_mat_types`.`id` = `inv_cur_lots`.`inv_cfg_mat_types_id`)))
        left join `inv_cfg_uom` ON ((`inv_cfg_uom`.`id` = `inv_cur_lots`.`inv_cfg_uom_id`)))
        left join `inv_cfg_locations` ON (`inv_cfg_locations`.`id` = `inv_cur_lots`.`inv_cfg_locations_id`))
        left join `inv_cfg_lot_status` ON (`inv_cfg_lot_status`.`id` = `inv_cur_lots`.`inv_cfg_lot_status_id`))

        left join `inv_cfg_custom_props` `tread_depth` ON ((`tread_depth`.`property` = 'tread_depth')))
        left join `inv_cur_prop_vals` `tread_depth_val` ON (((`tread_depth_val`.`inv_cfg_custom_props_id` = `tread_depth`.`id`)
            and (`tread_depth_val`.`inv_cur_lots_id` = `inv_cur_lots`.`id`))))
        left join `inv_cfg_custom_props` `side_wall` ON ((`side_wall`.`property` = 'side_wall')))
        left join `inv_cur_prop_vals` `side_wall_val` ON (((`side_wall_val`.`inv_cfg_custom_props_id` = `side_wall`.`id`)
            and (`side_wall_val`.`inv_cur_lots_id` = `inv_cur_lots`.`id`))))
        left join `inv_cfg_custom_props` `tire_type` ON ((`tire_type`.`property` = 'tire_type')))
        left join `inv_cur_prop_vals` `tire_type_val` ON (((`tire_type_val`.`inv_cfg_custom_props_id` = `tire_type`.`id`)
            and (`tire_type_val`.`inv_cur_lots_id` = `inv_cur_lots`.`id`))))
        left join `inv_cfg_custom_props` `tire_size` ON ((`tire_size`.`property` = 'tire_size')))
        left join `inv_cur_prop_vals` `tire_size_val` ON (((`tire_size_val`.`inv_cfg_custom_props_id` = `tire_size`.`id`)
            and (`tire_size_val`.`inv_cur_lots_id` = `inv_cur_lots`.`id`))))
    where
        (`inv_cur_lots`.`is_deleted` = 0);
END$$

DELIMITER ;

