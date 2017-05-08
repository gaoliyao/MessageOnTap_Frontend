/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var listeningFirebaseRefs = [];
var nodes = [];
var index = -1;
var total_count = 0;

/**
 * Starts listening for new posts and populates posts lists.
 */
function sortProperties(obj)
{
  // convert object into array
	var sortable=[];
	for(var key in obj)
		if(obj.hasOwnProperty(key))
			sortable.push([key, obj[key]]); // each item is an array in format [key, value]
	
	// sort items by value
	sortable.sort(function(a, b)
	{
	  return a[1]-b[1]; // compare numbers
	});
  //Console.log(sortable);
  var result = [];
  for(var i=0;i<sortable.length;i++){
    result.push(sortable[i][0]);
  }
	return result; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

function startDatabaseQueries() {
  // [START my_top_posts_query]
  // var myUserId = firebase.auth().currentUser.uid;
  var ref = firebase.database().ref("Task1");
  ref.once('value').then(function(snapshot){
    var n = snapshot.val();
    nodes = sortProperties(n);
    console.log(nodes);
    alert('Complete!');
  },function(error){
    console.log("Error: "+ error.code);
  });

  var elememt = document.getElementById("timeline");
  var currentStatusRef = firebase.database().ref();
  currentStatusRef.on('child_changed', function(snapshot){
    var currentStatus;
    currentStatusRef.once('value').then(function(snapshot){
    var currentStatus = snapshot.val().CurrentStatus;
    console.log(currentStatus);


    if((index >=0 && currentStatus != nodes[index]) || index == -1){
    if(index > 2 && total_count > 4) alert('Task finished');
    else{
    if(total_count == 0){
      elememt.innerHTML = '<div class="dot">'+
	    '<span id="'+total_count+'"></span>'+
		  '<date>'+currentStatus+'</date>'+
	    '</div>';
      total_count = total_count + 1;
    }
    else{
      elememt.innerHTML = elememt.innerHTML + '<div class="dot">'+
	    '<span id="'+total_count+'"></span>'+
		  '<date>'+currentStatus+'</date>'+
	    '</div>';
            document.getElementById(total_count-1).style.background = "grey";
      total_count = total_count + 1;


    }
    }
    }
  });

    

});
}


function changeCurrentStatus(status){
  var ref = firebase.database().ref();
  ref.update({
      "CurrentStatus":status
    });
}

function move(){

  index = index + 1;
  var elememt = document.getElementById("timeline");
  if(nodes.length == 0) {
    alert('Please wait for loading');
    index = -1;
}
  else{
  if(total_count == 0){
      elememt.innerHTML = '<div class="dot">'+
	    '<span id="'+total_count+'"></span>'+
		  '<date>'+nodes[index]+'</date>'+
	    '</div>';
      total_count = total_count + 1;
      changeCurrentStatus(nodes[index]);


    }
    else if(index > 2){
      alert('Task finished');
    }
    else{
      elememt.innerHTML = elememt.innerHTML + '<div class="dot">'+
	    '<span id="'+total_count+'"></span>'+
		  '<date>'+nodes[index]+'</date>'+
	    '</div>';
      document.getElementById(index-1).style.background = "grey";
      total_count = total_count + 1;

      changeCurrentStatus(nodes[index]);
    }
  }
}



window.onload = function(){startDatabaseQueries();};


function clearAll(){
  index = -1;
  var elememt = document.getElementById("timeline");
      elememt.innerHTML = '';
}