<?php
/**
 * ChameleonFannon is a Vector skin that adds CSS and JavaScript to style MediaWiki and further extensions more modern and consistently
 *
 * Currently "upgraded":
 * * MediaWiki (Buttons, Typography)
 * * SMW (Buttons)
 * * SemanticForms (Form / Input Styles)
 * * HeaderTabs
 * *
 *
 * For more info see http://mediawiki.org/wiki/Skin:ChameleonFannon
 *
 * @file
 * @ingroup Extensions
 * @package MediaWiki
 *
 * @links https://github.com/Fannon/ChameleonFannon/blob/master/README.md Documentation
 * @links https://www.mediawiki.org/wiki/Extension_talk:ChameleonFannon Support
 * @links https://github.com/Fannon/ChameleonFannon/issues Bug tracker
 * @links https://github.com/Fannon/ChameleonFannon Source code
 *
 * @author Simon Heimler (Fannon), 2015
 * @license http://opensource.org/licenses/mit-license.php The MIT License (MIT)
 */

//////////////////////////////////////////
// VARIABLES                            //
//////////////////////////////////////////


//////////////////////////////////////////
// CONFIGURATION                        //
//////////////////////////////////////////


//////////////////////////////////////////
// CREDITS                              //
//////////////////////////////////////////

$wgExtensionCredits['other'][] = array(
   'path'           => __FILE__,
   'name'           => 'ChameleonFannon',
   'author'         => array('Simon Heimler'),
   'version'        => '0.0.1',
   'url'            => 'https://www.mediawiki.org/wiki/Skin:ChameleonFannon',
   'descriptionmsg' => 'ChameleonFannon-desc',
   'license-name'   => 'MIT'
);


//////////////////////////////////////////
// RESOURCE LOADER                      //
//////////////////////////////////////////

$wgResourceModules['ext.ChameleonFannon'] = array(
   'scripts' => array(
      'js/ChameleonFannon.js',
   ),
   'styles' => array(
   ),
   'dependencies' => array(
   ),
   'localBasePath' => __DIR__,
   'remoteExtPath' => '/../../skins/ChameleonFannon'
);

// Register hooks
$wgHooks['BeforePageDisplay'][] = 'ChameleonFannonOnBeforePageDisplay';

/**
* Add libraries to resource loader
*/
function ChameleonFannonOnBeforePageDisplay( OutputPage &$out, Skin &$skin ) {
  // Add as ResourceLoader Module
  $out->addModules('ext.ChameleonFannon');
  return true;
}