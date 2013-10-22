/**
 * advanced:
 * make this work offline
 * https://developer.mozilla.org/en-US/docs/HTML/Using_the_application_cache
 * note: you must edit the manifest to update files
 *
 */



var posts = [];

/**
 * form action
 *
 */
$('#submit-button-img').click( function(event){

    // stop form from trying to send & refresh page
    event.preventDefault();

    // create post from form
    var post = {};
    post.title = $('#title-text').val();
    post.content = $('#summary-text').val();
    post.img = $('input[name="inputFile"]').prop('files')[0];
    post.weather = $('#weather-text-value').val();

    // add post to posts
    posts.push(post);

    console.log('post: ',post);
    console.log('posts: ',posts);
	
    displayPost(post);
    storePosts(posts);
    closePopupAndClearValues();
});

function closePopupAndClearValues(){
	$('#modal-window').dialog('close');
	$('#title-text').val('');
	$('#summary-text').val('');
}

/**
 * display posts
 *
 */
function displayPost(post){
    var html = '<article><img src=images/' + post.weather + '.png id="weather-img" /><h2>'+ post.title +'</h2><p>'+ post.content +'</p><img src=images/' + post.img.name + ' id="post-img" /></article>';
    $('#feed').prepend(html);
	changeColor();
}


/**
 * store posts
 *
 * note: localStorage only stores STRINGS
 *          arrays/objects must be STRINGIFIED
 *          numbers are fine but will be returned as a strong
 *
 */

function storePosts(posts){

    console.log('array: ' + posts);

    // make the array a string
    posts = JSON.stringify(posts);
    console.log('json: ' + posts);

    // store the string
    localStorage.posts = posts;

}

function changeColor() {
	$('#feed article').click(function() {
		$(this).addClass('active');
		$(this).toggleClass('inactive');
	});
}

/**
 * localStorage = STRINGS only!!
 *
 * note: localStorage only stores STRINGS
 *  - arrays/objects must be STRINGIFIED before storage, PARSED after retrieval. 
 *  - numbers also: 
 *       var num = localStorage.mynumber;   // '10.123' 
 *           num = parseFloat(num);         // 10.123 
 *           num = parseInt(num);           // 10
 *
 */


/**
 * load posts
 *
 * note: localStorage only stores STRINGS
 *          arrays/objects must be PARSED
 *          numbers also: var num = parseInt(); 
 *
 */

function loadPosts(){

    // check for posts in storage
    if (localStorage.posts) { 

        posts = localStorage.posts;

        // turn string into an array
        posts = JSON.parse(posts);

        // loop thru items in the array
        for( i=0, count=posts.length; i<count; i++ ){

            var post = posts[i]
            console.log( post );
            displayPost(post);
        }
    } else { // nothing in storage?
    
        posts = []; 
    
    }
}

function clearLocalStorage() {
   	localStorage.clear();
}

// load posts on page load
$(function(){
	loadPosts();
});