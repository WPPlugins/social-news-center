/*******************************
 * COMMON JAVASCRIPT FUNCTIONS *
 *******************************/

/*
 * Function to test Social Media network API settings.
 * 
 * Parameters:
 * - site			: Name of Social Media network.
 */
function snc_doEmptyCache ( site ) {
	
	//alert( "Emptying Cache for " +site );
	switch ( site ) {
		case 'facebook':
		case 'instagram':
		case 'twitter':
		
			// AJAX call to Empty Cache for current Social Media network
			action = "snc_empty_cache";

			// Wordpress AJAX call to server
			jQuery.post( the_ajax_script.ajax_url,
				{
					action:	action,
					site:	site,
				},
				function( response, status ) {
					//alert( "response=" + JSON.stringify( response, null, 2 ) );
					var json = JSON.parse( response );
					//alert( "response=" + JSON.stringify( json, null, 2 ) );
					if ( status == "success" ) {

						// Check if credentials were verified
						if ( typeof( json.emptied ) != 'undefined' && json.emptied == true ) {
							alert( "Success! Cache for '" +site +"' emptied." );
						} else if ( typeof( json.error ) != 'undefined' && json.error != "" ) {
							alert( "Could not empty '" +site +"' cache due to: " +json.error );
						} else {
							alert( "Could not empty '" +site +"' cache, please check the permissions." );
						}
					} else {
						alert( "Could not empty '" +site +"' cache due to: " +status );
					}
				}
			);
			break;
		default:
			alert( "Social Media network '" +site +"' not defined, please contact support!" );
	}
}
	
/*
 * Function to initialize tiled or brick screen layout.
 * 
 * Parameters:
 * - containerName	: Name of <div> layer containing boxes.
 * - data			: Data containing HTML boxes that are to be added to Container.
 * - itemSelector	: Name of <div> layer which is box.
 * - site			: Name of Social Media network.
 */
function snc_doInitIsotope ( containerName, data, itemSelector, site ) {

	msgTxtElem = document.getElementById( 'sncMsgTxt' );

	var $container = jQuery( "#" + containerName ),
		isoOptions = {
			itemSelector: "." + itemSelector,
			layoutMode: "masonry",
			masonry:{
				columnWidth: 250,
				isFitWidth: true,
			},
			transitionDuration: 0,
			sortBy: "sncTimestamp",
			sortAscending: false,
			getSortData: {
				sncTimestamp: function( itemElem ) { // function
					var sncTimestamp = parseInt( jQuery( itemElem ).find( ".sncTimestamp" ).text() );
					//alert( "sncTimestamp=" + sncTimestamp );
					return sncTimestamp;
				}
			}
		};

	// initialize the Isotope sortable and filterable layer
	$container.isotope( isoOptions );

	// Populate the container with boxes
	if ( data != "" ) {
		var $newItems = jQuery( data );
		$container.isotope( 'insert', $newItems );
	}

	// Once images are loaded then sort the contents
	$container.imagesLoaded( function() {
		$container.isotope( 'layout' );
	});
	
	// Parse popup content for media links that if clicked will appear in replacement popups
	snc_doParsePopupLinks();

	// Parse container to render any Facebook widgets generated by AJAX
	if ( site == 'facebook' && typeof( FB ) != 'undefined' ) {
		FB.XFBML.parse( document.getElementById( containerName ) );
	}

	// Check to see if any posts have been displayed
	elemsList = $container.isotope( 'getItemElements' );
	errorMsg = "No latest Posts found.";
	if ( elemsList.length == 0 ) {
		msgTxtElem.innerHTML = errorMsg;
	} else if ( elemsList.length > 0 ) {
		msgTxtElem.innerHTML = "";
	}
}

/*
 * Function to load Popup Social Media window.
 * 
 * Parameters:
 * - path			: Path of current script, used to construct AJAX call.
 * - site			: Name of Social Media network.
 * - id				: ID of item to be loaded within Popup.
 */
function snc_getLoadSocialPopup ( path, site, id ) {
	
	// Make the AJAX call
	var infoType = "";
	var numPosts = 0;
	
	if ( site == "facebook" ) {
		numPosts = 1;
		if ( id.indexOf( "_" ) >= 0 ) {
			infoType = "post";
		} else {
			infoType = "profile";
		}
		FB.getLoginStatus(
			function ( response ) {
				snc_doCheckLoginStatus( response );
				
				// Retrieve Social Media content
				snc_getSocialMediaContent( path, site, id, infoType, numPosts );
			}, 
			true
		);
	} else if ( site == "instagram" ) {

		if ( id.substring( 0, 1 ) == "@" ) {
			infoType = "profile";
			numPosts = 1;
		} else {
			infoType = "post";
			numPosts = 1;
		}

		// Retrieve Social Media content
		snc_getSocialMediaContent( path, site, id, infoType, numPosts );
	} else if ( site == "twitter" ) {
		
		if ( id.substring( 0, 1 ) == "#" ) {
			infoType = "hashtag";
			numPosts = 10;
		} else if ( id.substring( 0, 1 ) == "@" ) {
			infoType = "profile";
			numPosts = 1;
		} else if ( id.substring( 0, 1 ) == "$" ) {
			infoType = "symbol";
			numPosts = 10;
		}

		// Retrieve Social Media content
		snc_getSocialMediaContent( path, site, id, infoType, numPosts );
	}
}

/*
 * Function to test Social Media network API settings.
 * 
 * Parameters:
 * - site			: Name of Social Media network.
 * - formId			: ID of HTML Form for retrieving API settings.
 */
function snc_doTestSocialMediaSettings ( site, formId ) {
	
	//alert( "Testing " +site +", form ID=" +formId );
	switch ( site ) {
		case 'facebook':
			FACEBOOK_APP_ID = document.getElementById( "snc_facebook_app_id" ).value;
			FACEBOOK_SECRET = document.getElementById( "snc_facebook_secret" ).value;
			
			//alert( "Testing '" +site +"' settings: FACEBOOK_APP_ID=" +FACEBOOK_APP_ID +", FACEBOOK_SECRET=" +FACEBOOK_SECRET );

			// AJAX call to verify Facebook credentials
			action = "snc_facebook_verify_creds";

			// Wordpress AJAX call to server
			jQuery.post( the_ajax_script.ajax_url,
				{
					action:	action,
					FACEBOOK_APP_ID: FACEBOOK_APP_ID,
					FACEBOOK_SECRET: FACEBOOK_SECRET
				},
				function( response, status ) {
					//alert( "response=" + JSON.stringify( response, null, 2 ) );
					var json = JSON.parse( response );
					//alert( "response=" + JSON.stringify( json, null, 2 ) );
					if ( status == "success" ) {

						// Check if credentials were verified
						if ( typeof( json.verified ) != 'undefined' && json.verified == true ) {
							alert( "Success! Able to verify '" +site +"' credentials." );
						} else if ( typeof( json.error ) != 'undefined' && json.error != "" ) {
							alert( "Unable to verify '" +site +"' credentials due to: " +json.error );
						} else {
							alert( "Unable to verify '" +site +"' credentials, please check the settings." );
						}
					} else {
						alert( "Unable to verify '" +site +"' credentials due to: " +status );
					}
				}
			);
			break;
		case 'instagram':
			access_token = document.getElementById( "snc_instagram_access_token" ).value;
			access_token_status = document.getElementById( "snc_instagram_access_token_status" ).value;

			//alert( "Testing '" +site +"' settings:" 
			//	+"\n- access_token=" +access_token 
			//	+"\n- access_token_status=" +access_token_status 
			//);

			// Check needed parameters are present
			if ( access_token == "" ) {
				$msg = "Missing Instagram parameters:";
				if ( access_token == "" ) {
					$msg = $msg +"\n" +"- Access Token (generated by Instagram API)";
				}
				alert( $msg );
			} else if ( access_token_status != "valid" ) {
				$msg = "Invalid Access Token - please generate again";
				alert( $msg );
			} else {
			
				// AJAX call to verify Instagram credentials
				action = "snc_instagram_verify_creds";

				// Wordpress AJAX call to server
				jQuery.post( the_ajax_script.ajax_url,
					{
						action:	action,
						access_token: access_token,
					},
					function( response, status ) {
						//alert( "response=" + JSON.stringify( response, null, 2 ) );
						var json = JSON.parse( response );
						//alert( "response=" + JSON.stringify( json, null, 2 ) );
						if ( status == "success" ) {

							// Check if credentials were verified
							if ( typeof( json.verified ) != 'undefined' && json.verified == true ) {
								alert( "Success! Able to verify '" +site +"' credentials." );
							} else if ( typeof( json.error ) != 'undefined' && json.error != "" ) {
								alert( "Unable to verify '" +site +"' credentials due to: " +json.error );
							} else {
								alert( "Unable to verify '" +site +"' credentials, please check the settings." );
							}
						} else {
							alert( "Unable to verify '" +site +"' credentials due to: " +status );
						}
					}
				);
			}
			break;
		case 'twitter':
			consumer_key = document.getElementById( "snc_twitter_consumer_key" ).value;
			consumer_secret = document.getElementById( "snc_twitter_consumer_secret" ).value;
			oauth_access_token = document.getElementById( "snc_twitter_oauth_access_token" ).value;
			oauth_access_token_secret = document.getElementById( "snc_twitter_oauth_access_token_secret" ).value;
			
			//alert( "Testing '" +site +"' settings: consumer_key=" +consumer_key +", consumer_secret=" +consumer_secret +", oauth_access_token=" +oauth_access_token +", oauth_access_token_secret=" +oauth_access_token_secret );

			// AJAX call to verify Twitter credentials
			action = "snc_twitter_verify_creds";

			// Wordpress AJAX call to server
			jQuery.post( the_ajax_script.ajax_url,
				{
					action:	action,
					consumer_key: consumer_key,
					consumer_secret: consumer_secret,
					oauth_access_token: oauth_access_token,
					oauth_access_token_secret: oauth_access_token_secret
				},
				function( response, status ) {
					//alert( "response=" + JSON.stringify( response, null, 2 ) );
					var json = JSON.parse( response );
					//alert( "response=" + JSON.stringify( json, null, 2 ) );
					if ( status == "success" ) {

						// Check if credentials were verified
						if ( typeof( json.verified ) != 'undefined' && json.verified == true ) {
							alert( "Success! Able to verify '" +site +"' credentials." );
						} else if ( typeof( json.error ) != 'undefined' && json.error != "" ) {
							alert( "Unable to verify '" +site +"' credentials due to: " +json.error );
						} else {
							alert( "Unable to verify '" +site +"' credentials, please check the settings." );
						}
					} else {
						alert( "Unable to verify '" +site +"' credentials due to: " +status );
					}
				}
			);
			break;
		default:
			alert( "Social Media network '" +site +"' not defined, please contact support!" );
	}
}