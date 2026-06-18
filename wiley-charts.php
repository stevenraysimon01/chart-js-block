<?php
/**
 * Plugin Name:     Wiley Charts
 * Description:     ChartJS Gutenberg block made for Wiley WordPress websites. Build step required.
 * Version:         0.1.0
 * Author:          Steven Simon - Wiley
 * License:         GPL-2.0-or-later
 * License URI:     https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:     create-block
 *
 * @package         create-block
 */

/**
 * Registers all block assets so that they can be enqueued through the block editor
 * in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/applying-styles-with-stylesheets/
 */

//Enqueue Scripts
function my_chart() {

	$id = get_the_ID();
	if(has_block('create-block/wiley-charts',$id)){

		wp_enqueue_script(
			'chart-js',
			'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js'
		);

		wp_enqueue_script(
			'my_chart',
			plugins_url('js/my_chart.js', __FILE__),
			array(),
			filemtime( plugin_dir_path( __FILE__ ) . 'js/my_chart.js' ),
			true
		);

	}

}
add_action('enqueue_block_assets', 'my_chart');

function create_block_wiley_charts_block_init() {
	$dir = dirname( __FILE__ );

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/wiley-charts" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'create-block-wiley-charts-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$editor_css = 'editor.css';
	wp_register_style(
		'create-block-wiley-charts-block-editor',
		plugins_url( $editor_css, __FILE__ ),
		array(),
		filemtime( "$dir/$editor_css" )
	);

	$style_css = 'style.css';
	wp_register_style(
		'create-block-wiley-charts-block',
		plugins_url( $style_css, __FILE__ ),
		array(),
		filemtime( "$dir/$style_css" )
	);

	register_block_type( 'create-block/wiley-charts', array(
		'editor_script' => 'create-block-wiley-charts-block-editor',
		'editor_style'  => 'create-block-wiley-charts-block-editor',
		'style'         => 'create-block-wiley-charts-block',
		'render_callback' => 'custom_gutenberg_render_html_wiley_chartjs_block',
			'attributes' => [
				'title' => [
					'type' => 'string',
					'default' => null
				],
				'type' => [
					'type' => 'string',
					'default' => 'line'
				],
				'data' => [
					'type' => 'array',
					'default' => []
				],
				'labels' => [
					'type' => 'array',
					'default' => []
				],
				'colors' => [
					'type' => 'array',
					'default' => []
				],
				'border' => [
					'type' => 'boolean',
					'default' => true
				]
			]
	) );
}
add_action( 'init', 'create_block_wiley_charts_block_init' );

//Callback to render dynamic content
function custom_gutenberg_render_html_wiley_chartjs_block($attributes, $content){

	//Get the data
	$type = $attributes['type'];
	$title = $attributes['title'];
	$labels = $attributes['labels'];
	$data = $attributes['data'];
	$colors = $attributes['colors'];
	$border = $attributes['border'];

	//Get title with no spaces
	$strippedTitle = preg_replace("/\s+/", "", $title);

	//Fix the array for JS
	$labels = implode(",", $labels);
	$data = implode(",", $data);
	$colors = implode(",", $colors);

	return "<script>let ". $strippedTitle ." = new Array(); ". $strippedTitle .".push('". $type ."','". $title ."','". $labels ."','". $data ."','". $colors ."','". $border ."','". $strippedTitle ."');</script><canvas class='myChartJSChart' id=". $strippedTitle ."></canvas>";

}

//Custom block category
function wiley_chartjs_block_categories( $categories ) {
    return array_merge(
        $categories,
        [
            [
                'slug'  => 'create-block',
                'title' => __( 'Charts', 'wiley-chartjs-boilerplate' ),
            ],
        ]
    );
}
add_action( 'block_categories', 'wiley_chartjs_block_categories');
