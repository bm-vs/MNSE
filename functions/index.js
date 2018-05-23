//const admin = require('firebase-admin');
const functions = require('firebase-functions');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

//admin.initializeApp(functions.config().firebase);

const textToSpeech = new TextToSpeechV1({
	username: '5dbdab7a-cc5f-4af4-93ac-235033155bcf',
	password: 'rI2xbfncQpgP',
	url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});

exports.tts = functions.https.onRequest((req, res) => {	
	let params = {
		text: req.query.text,
		accept: 'audio/wav'
	}
	
	textToSpeech.synthesize(params, function(err, audio) {
		res.status(200).send(audio);
	});
});