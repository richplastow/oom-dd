<?php
/**
 * @package ${{title}}
 */
/*
Plugin Name: ${{title}}
Plugin URI: ${{repo}}/tree/master/wp/
Description: ${{description}}
Author: Rich Plastow for Loop.Coop
Author URI: https://richplastow.com/
License: MIT
Text Domain: ${{projectLC}}
Version: ${{version}}
*/




//// Allow ajax ping.
if ( isset($_GET['ping']) ) {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET');
    exit('pong');
}




$debug = // show debug info on localhost when this PHP file is run directly.
    isset($_SERVER['SERVER_NAME']) && 'localhost' === $_SERVER['SERVER_NAME']
 && basename($_SERVER['REQUEST_URI']) === basename(__FILE__);
if ($debug) { error_reporting(E_ALL); ini_set('display_errors', 1); }

$oomClassesPath = dirname(__FILE__) . '/../../../dist/php/${{projectLC}}.7.php';
include($oomClassesPath);

if ($debug) {
    foreach ($oomClasses as $classname => $class) {
        $schema = $class::$schema;
        $nameUCD = $schema['stat']['NAME']['default']; // uppercase dotted
        $nameLCU = strtolower( str_replace('.','_',$nameUCD) ); // lowercase underscored
        echo $nameUCD . ' ' . $nameLCU . "\n";
    }
}

if (! $debug) {




    //// SETUP


    //// Allow cross-origin. @TODO maybe uncomment this to restrict access
    //// https://joshpress.net/access-control-headers-for-the-wordpress-rest-api/
    // add_action('rest_api_init', function () {
    //     remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    //     add_filter('rest_pre_serve_request', function ($value) {
    //         header('Access-Control-Allow-Origin: *');
    //         header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    //         header('Access-Control-Allow-Credentials: true');
    //         return $value;
    //     });
    // }, 15);

    //// Flush CPT rewrite rules when the plugin is activated or deactivated.
    //// https://codex.wordpress.org/Function_Reference/flush_rewrite_rules
    register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
    register_activation_hook( __FILE__, '${{projectLCU}}_on_activation' );
    function ${{projectLCU}}_flush_rewrites() {
        ${{projectLCU}}_register_cpts_and_cmb2s();
        flush_rewrite_rules();
    }

    //// Add some custom CMB2 field types.
    //// https://github.com/WebDevStudios/Custom-Metaboxes-and-Fields-for-WordPress/wiki/Adding-your-own-field-types
    add_action( 'cmb2_render_text_number', '${{projectLCU}}_cmb2_render_text_number', 10, 5 );
    function ${{projectLCU}}_cmb2_render_text_number($fa, $ev, $oi, $ot, $field_type_object) {
        echo $field_type_object->input( array('type' => 'number', 'step' => 'any') );
    }
    add_filter( 'cmb2_validate_text_number', '${{projectLCU}}_cmb2_validate_text_number', 10, 2 );
    function ${{projectLCU}}_cmb2_validate_text_number($override_value, $value) {
        if (! is_numeric($value) ) $value = ''; // not a number? empty the value
        return $value;
    }
    add_action( 'cmb2_render_text_nnint', '${{projectLCU}}_cmb2_render_text_nnint', 10, 5 );
    function ${{projectLCU}}_cmb2_render_text_nnint($fa, $ev, $oi, $ot, $field_type_object) {
        echo $field_type_object->input( array('type' => 'number', 'min' => '0') );
    }
    add_filter( 'cmb2_validate_text_nnint', '${{projectLCU}}_cmb2_validate_text_nnint', 10, 2 );
    function ${{projectLCU}}_cmb2_validate_text_nnint($override_value, $value) {
        if (! ctype_digit(strval($value)) ) $value = ''; // not a non-negative int? empty the value
        return $value;
    }




    //// CPTs AND CMB2s


    //// Initialise CPTs when CMB2 is ready.
    add_action('cmb2_init', '${{projectLCU}}_register_cpts_and_cmb2s');

    //// Define CPTs and CMB2s.
    function ${{projectLCU}}_register_cpts_and_cmb2s () {
        global $oomClasses;

        //// Step through each Oom class.
        foreach ($oomClasses as $classname => $class) {

            //// Get info about the class.
            $schema = $class::$schema;
            $nameUCD = $schema['stat']['NAME']['default']; // uppercase dotted
            $nameLCU = strtolower( str_replace('.', '_', $nameUCD) ); // lowercase underscored

            //// Define the class’s CPT (custom post type).
            register_post_type($nameLCU, array(
                'public'       => true
              , 'has_archive'  => false
              , 'labels'       => array( 'name' => $nameUCD )
              , 'supports'     => array('title', 'author') //@TODO only if defined in `inst`
              , 'show_in_rest' => true
            ) );

            //// Define the class’s CMB2s (custom meta boxes).
            $box = new_cmb2_box( array(
                'id'           => $nameLCU . '_my_group' //@TODO schema should allow fields to be grouped
              , 'title'        => __('My Group') //@TODO schema should allow fields to be grouped
              , 'object_types' => array($nameLCU)
              , 'context'      => 'normal'
              , 'priority'     => 'high'
              , 'show_names'   => true // Show field names on the left
            ) );

            foreach ($schema['attr'] as $attrname => $desc) {
                $attrnameLCU = strtolower($attrname); // lowercase - and will already be underscored
                $box->add_field( array(
                    'id'   => $attrnameLCU
                  , 'name' => $attrname . ' (' . $desc['typeStr'] . ')'
                  , 'desc' => $desc['remarks']
                  , 'type' => schemaTypeToCmb2Type( $desc['typeStr'] )
                ) );
            }//foreach attr

        }//foreach class

    }//${{projectLCU}}_register_cpts_and_cmb2s()




    //// REST API

    //// Retrieves custom meta for use in the REST API.
    function ${{projectLCU}}_get_cm($object, $field_name, $request, $object_type) {
        return get_post_meta($object['id'], $field_name, true); //@TODO $object->ID ?
    }

    //// Writes custom meta for use in the REST API.
    function ${{projectLCU}}_update_cm($value, $object, $field_name, $request, $object_type) {
        // file_put_contents( dirname(__FILE__) . '/log.txt', $object->ID . ' ' . $field_name . ' ' . $value . "\n");
        return update_post_meta($object->ID, $field_name, $value);
    }

    //// Register custom meta with REST API when REST API is ready.
    add_action('rest_api_init', '${{projectLCU}}_register_rest_cm');

    //// Register custom meta with REST API.
    function ${{projectLCU}}_register_rest_cm () {
        global $oomClasses;

        //// Step through each Oom class.
        foreach ($oomClasses as $classname => $class) {

            //// Get info about the class.
            $schema = $class::$schema;
            $nameUCD = $schema['stat']['NAME']['default']; // uppercase dotted
            $nameLCU = strtolower( str_replace('.', '_', $nameUCD) ); // lowercase underscored

            foreach ($schema['attr'] as $attrname => $desc) {
                $attrnameLCU = strtolower($attrname); // lowercase - and will already be underscored
                register_rest_field($nameLCU, $attrnameLCU, array(
                    'get_callback'    => '${{projectLCU}}_get_cm'
                  , 'update_callback' => '${{projectLCU}}_update_cm'
                  , 'schema'          => null
                ) );
            }//foreach attr

        }//foreach class

    }//${{projectLCU}}_register_rest_cm()


}//if (! $debug)



//// UTILITY

function schemaTypeToCmb2Type ($schemaType) {
    $lut = array(
        'array'     => 'textarea' //@TODO make a proper custom CMB2 for a plain array
      , 'boolean'   => 'checkbox'
      , 'function'  => 'textarea' //@TODO make a proper custom CMB2 for a function
      , 'number'    => 'text_number'
      , 'object'    => 'textarea' //@TODO make a proper custom CMB2 for a plain object
      , 'string'    => 'text_medium'
      , 'symbol'    => 'text_small' //@TODO look in to this
      , 'undefined' => 'hidden'
      , 'color'     => 'colorpicker'
      , 'nnint'     => 'text_nnint'
      , 'null'      => 'hidden'
    );
    $schemaType = strtolower($schemaType);
    if ( isset($lut[$schemaType]) )
        return $lut[$schemaType];
    return 'text';
}




?>
