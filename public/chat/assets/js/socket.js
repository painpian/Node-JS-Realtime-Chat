$(function(){
	//create socket connection
	var socket = io.connect('http://localhost:8080/');

	//define dom variable
	var output 	= document.getElementById('output'),
		message	= document.getElementById('message'),
		btn = document.getElementById('btn');

	//get a user identity
	var username = document.querySelector('.username').innerHTML;
	var profile_img = document.querySelector('.profile-img').getAttribute('src'); 

	//set destination chat
	var destination_name = document.querySelector('.destination_name');
	var destination_img = document.querySelector('.destination_img');

	//emit event
	btn.addEventListener('click', function(){
		var date = new Date();
		var time = date.getHours() +':'+date.getMinutes();

		socket.emit('chat', {
			message : message.value,
			username : username,
			profile_img : profile_img,
			time : time
		});

		message.value = '';
		output.scrollTop +=200;
	});

	//listen for event
	socket.on('chat', function(data){

		//specify the position of the text chat
		if(data.username == username) {
			//right chat
			output.innerHTML += '<div class="row">'+
									'<div class="right-chat">'+
										'<span class="chat-text">'+
											data.message+
										'</span>'+
										'<br/>'+
										'<span class="chat-time" style="float: right;">'+
											data.time+
										'</span>'+
									'</div>'+
								'</div>';
		} else {
			//left chat
			output.innerHTML += '<div class="row">'+
									'<div class="left-chat">'+
										'<span class="chat-text">'+
											data.message+
										'</span>'+
										'<br/>'+
										'<span class="chat-time" style="float: right;">'+
											data.time+
										'</span>'+
									'</div>'+
								'</div>';
			
			//set profile destination
			destination_name.innerHTML = '<strong>'+data.username+'</strong>';
			destination_img.setAttribute('src', data.profile_img);
		}
	});
});