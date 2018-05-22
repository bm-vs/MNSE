'use strict';

// Initializes Chat
function Chat(container) {
	this.checkSetup();

	// ID
	this.id = $(container).attr('ref');
	
	// Elements
	this.messageList = $(container).children('.message-list');
	this.messageForm = $(container).children('.message-form');
	this.messageInput = $(container).find('.message-input');
	this.submitButton = $(container).find('.message-submit');
	this.userPic = $('#user-pic');
	this.userName = $('#user-name');
	this.signInButton = $('#sign-in');
	this.signOutButton = $('#sign-out');
	
	// Listeners
	$(this.signInButton).on('click', this.signIn.bind(this));
	$(this.signOutButton).on('click', this.signOut.bind(this));
	$(this.messageForm).on('submit', this.saveMessage.bind(this));
	$(this.messageInput).on('keyup', this.toggleButton.bind(this));
	$(this.messageInput).on('change', this.toggleButton.bind(this));
	this.initFirebase();
	this.loadMessages();
}

// Initializes Firebase
Chat.prototype.initFirebase = function() {
	this.auth = firebase.auth();
	this.database = firebase.database();
	this.storage = firebase.storage();
	this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Sign in
Chat.prototype.signIn = function() {
	var provider = new firebase.auth.GoogleAuthProvider();
	this.auth.signInWithPopup(provider);
};

// Sign out
Chat.prototype.signOut = function() {
	this.auth.signOut();
};

// Triggers when the user signs in/out
Chat.prototype.onAuthStateChanged = function(user) {
	if (user) {
		var profilePicUrl = user.photoURL;
		var userName = user.displayName;
		
		$(this.userName).text(userName);
		$(this.userPic).css('background-image', 'url(' + profilePicUrl + ')');

		$(this.userName).removeAttr('hidden');
		$(this.userPic).removeAttr('hidden');
		$(this.signOutButton).removeAttr('hidden');
		$(this.signInButton).attr('hidden', 'true');
	} else {
		$(this.userName).attr('hidden', 'true');
		$(this.userPic).attr('hidden', 'true');
		$(this.signOutButton).attr('hidden', 'true');
		$(this.signInButton).removeAttr('hidden');
	}
};

// Loads messages and listens for upcoming ones
Chat.prototype.loadMessages = function() {
	this.chatRef = this.database.ref(this.id);
	this.chatRef.off();

	var setMessage = function(data) {
		var val = data.val();
		this.displayMessage(data.key, val.name, val.text, val.photoUrl);
	}.bind(this);
	
	this.chatRef.limitToLast(12).on('child_added', setMessage);
	this.chatRef.limitToLast(12).on('child_changed', setMessage);
};

// Displays message
Chat.prototype.displayMessage = function(key, name, text, picUrl) {
	var div = $('#'+key);
	if (!div.length) {
		$(this.messageList).append(this.createMessageElement(key));
		div = $('#'+key);
		console.log($(this.messageList).children());
	}
	if (picUrl) {
		$(div).children('.pic').css('background-image', 'url(' + picUrl + ')');
	}
	$(div).children('.name').text(name);
	$(div).children('.message').text(text);
};

// Creates message element
Chat.prototype.createMessageElement = function(id) {
	var elem =
		'<div class="message-container" id="' + id + '">'+
			'<div class="pic"></div>'+
			'<div class="message"></div>'+
			'<div class="name"></div>'+
		'</div>';
	
	return elem;
}		

// Saves message to Firebase DB
Chat.prototype.saveMessage = function(e) {
	e.preventDefault();
	if (this.checkSignedInWithMessage()) {
		var content = $(this.messageInput).val();
		if (content) {
			var currentUser = this.auth.currentUser;
			this.chatRef.push({
				name: currentUser.displayName,
				text: content,
				photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
			}).then(function() {
				$(this.messageInput).val('');
				this.toggleButton();
			}.bind(this)).catch(function(error) {
				console.error('Error writing new message to Firebase Database', error);
			});
		}
	}
	else {
		this.signIn();
	}
};

// Returns true if user is signed in
Chat.prototype.checkSignedInWithMessage = function() {
	if (this.auth.currentUser) {
		return true;
	}
	return false;
};

// Enables/disables input button
Chat.prototype.toggleButton = function() {
	if ($(this.messageInput).val()) {
		$(this.submitButton).removeAttr('disabled');
	} else {
		$(this.submitButton).attr('disabled', 'true');
	}
};

// Checks that the Firebase SDK has been correctly setup and configured
Chat.prototype.checkSetup = function() {
	if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
		window.alert('You have not configured and imported the Firebase SDK. ' +
				'Make sure you go through the codelab setup instructions and make ' +
				'sure you are running the codelab using `firebase serve`');
	}
};