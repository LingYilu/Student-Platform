var loaded=0;//this var is the post number that have loaded

//initial
window.scrollTo(0, 0);
loadpost();

//loadpost();
$(window).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()){
	    loadpost();
	}
});

function loadpost(){
    load(1);//loading posts first
    setTimeout(function(){//loading reply of posts after 1 second 
        load(2);
        loaded+=20;
    }, 1000);
}


//----------------------------------request the posts from server----------------------------------
var loading=document.getElementById("loading");
var mode;
function load(mode) {
    if (totalposts>loaded){
    document.getElementById("loading").style.visibility = "visible";
	$.ajax({// ajax getting data from server
		url: '?p=st_loadposts&load='+loaded+'&mode='+mode,
		type: 'POST',
		data: {
			page:$(this).data('page'),
		},
		success: function(response){
			if(response){
				loading.style.visibility = "hidden";
				if(mode==1){//mode 1 for post
					eval(response);//eval the response form server, about add post to var post, below:
					//post.push([id,studentno,username,text,time,plus1,boolean plused,image])
					
					//append post to postlist(layout)
					for(i=0;i<post.length;i++){
					    $('#PostList').append(
					        "<div class=\"cmt\" id=\"" + post[i][0] + "\">" +   //postid
					        "<div id=\"cmtauthor\">"                        +
					        "<a id=\"plused\">+" + post[i][5] + "</a>"       +   //plus1
					        "<a id=\"user\" href=\"?p=profile&studentno=" + post[i][1] + "\">" + post[i][2] + "</a>"  +   //username
					        "<a id=\"report\" onclick=\"report($(this))\">report</a>"                         +
					        "<date>" + post[i][4] + "</date></div>"         +   //time
					        
					        "<div id=\"Pcontent\"><div id=\"text\">" + post[i][3] + "</div></div>"     +   //text
					        
					        (post[i][7] ? ("<img id=\"postimg\" onclick=\"bigimg($(this))\" src=\"uploads/" + post[i][7] + "\"></img><br>") : "") +  //image     //if have image return image filename
					        (post[i][6] ? ("<a id=\"plus1\" onclick=\"plus1($(this))\"></a>") : "")    +   //plus1(like) button    //if user did like this post, no button for use to press
					        "<a id=\"reply\" onclick=\"doreply($(this))\"></a><br class=\"clear\"></div>"
					    );
					    
					    
					}
					
					post=[];//emty post[]
				}
				if(mode==2){//mode 2 for reply
				    eval(response);//eval the response form server, about add reply to var reply, below:
				    //reply.push([parentpostid,studentno,username,text,time])
				    for(i=0;i<reply.length;i++){
					    if($(".cmt#" + reply[i][0])){    //id   //if the post with indicated id existed
					        $(".cmt#" + reply[i][0]).append(
    					        "<div class=\"reply\"><div id=\"cmtauthor\">"   +
    					        "<a id=\"user\" href=\"?p=profile&studentno=" + reply[i][1] + "\">" + reply[i][2] + "</a>"                     +   //username
    					        "<date>" + reply[i][4] + "</date></div>"        +   //time
    					        "<div id=\"Pcontent\"><div id=\"text\">" + reply[i][3] + "</div></div></div>"     //text
					        );
					    }
				    }
                    reply=[]; //emty reply
                    
				}
				chkOverFlowText();
			}
		}
	});
    }
//if database have no more post,so this element will show "no more"
    else if (totalposts<loaded){
    	loading.style.visibility = "hidden";
    	document.getElementById("loadstatus").innerHTML="no more";
    }
}


//-----------------------------------------function()--------------------------------------------------
//some action listener
var PostID;

function readmore(THIS){
    THIS.closest("#Pcontent").find("#text").css({"maxHeight":"none","overflow":"auto"});
    THIS.remove();
}
function doreply(THIS){
    PostID=THIS.parent().attr("id");
    THIS.parent().append($('.cmt #Postbox'));
    $(".cmt #Postbox #PostID").attr('value',''+PostID);
}
function plus1(THIS){
    PostID=THIS.parent().attr("id");
    $.get("?p=st_post&mode=3&PostID="+PostID);
    var plused = THIS.parent().find('#plused');
    plused.text("+"+(parseInt(plused.text())+1));//clear the #plused
    THIS.remove();
}
function bigimg(THIS){
    THIS.css("maxHeight","none");
}
function report(THIS){
    POSTID=(THIS.parent().parent().attr("id"));
    window.location.href="?p=st_report&PostID="+POSTID;
}



//post
function chkPostingStatus(){
    var buttonSubmit=document.getElementById("buttonSubmit")
    buttonSubmit.style.backgroundColor="#d9534f";
    buttonSubmit.style.content="Posting...";
    
    $("#PostAction").load(function(){
        window.location.href = "?p=storytelling";
    });
}

//text overflow;
function chkOverFlowText(){
    $("*#readmore").remove();
    for(var i=0;i<$("*#Pcontent").length;i++){
        if($("*#text")[i].scrollHeight >  $('#text').innerHeight()){
            $("*#Pcontent")[i].innerHTML += "<a id=\"readmore\" onclick=\"readmore($(this))\">read more</a>";
        }
    }
}

