$(document).ready(function(){
	
    $("#search-btn").on("click", function(e){
    	e.preventDefault();
        $("#search-results").html('<div class="loader"><img src="./images/ajax-loader.gif" alt="loading..."/></div>');

    	var username = $("#user-input").val();
    	var useruri = 'https://api.github.com/users/'+username;
        var repouri  = 'https://api.github.com/users/'+username+'/repos';

        requestJSON(useruri, function(json){

            if(json.message == "Not Found" || username == ''){
                $("#search-results").html('<h2>User Info Not Found</h2>');
            } 
            
            else {

                //Grab stuff that you need from the json file returned
                var fullname   = json.name;
                var usersname   = json.login;
                var aviurl     = json.avatar_url;
                var profileurl = json.html_url;
                var location   = json.location;
                var followersnum = json.followers;
                var followingnum = json.following;
                var reposnum     = json.public_repos;

                if(fullname == undefined){
                    fullname = usersname;
                }

                var outhtml = '<h2>'+fullname+'<span class="smallname">(@<a href="'+profileurl+'"target="_blank">'+usersname+'</a>)</span></h2>';
                outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="'+profileurl+'" target="_blank"><img src="'+aviurl+'" width="80" height="80" alt="'+username+'"></a></div>';
                outhtml = outhtml + '<p>Followers: '+followersnum+' - Following: '+followingnum+'<br>Repos: '+reposnum+'</p></div>';
                outhtml = outhtml + '<div class="repolist clearfix">';

                //Getting list of repos
                var repos;
                $.getJSON(repouri, function(json){
                    repos = json;
                    outputPageContent();
                    });
                function outputPageContent(){
                    if(repos.length == 0){
                        outhtml = outhtml + '<p>No repos!</p></div>'; 
                    } 
                    else {
                        outhtml = outhtml + '<p><strong>Repositories List:</strong></p> <ul>';
                        //Looping through the list of repos and pushing each into an <li>
                        $.each(repos, function(index){
                            outhtml = outhtml + '<li><a href="'+repos[index].html_url+'" target="_blank">'+repos[index].name + '</a></li>';
                        });
                         outhtml = outhtml + '</ul></div>';
                    }
                    $('#search-results').html(outhtml);
                }//end of outputPageContent()
            }//end of else statement
        });//end of requestJSON function
    });//end of button onclick


       //=====callback function for all ajax calls including other button presses===
        function requestJSON(url, callback){
                $.ajax({
                    url: url,
                    complete: function(xhr){
                        callback.call(null,xhr.responseJSON);
                    }
                });

        }
});//End of document