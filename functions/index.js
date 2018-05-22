'use strict';

const functions = require('firebase-functions');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');

const textToSpeech = new TextToSpeechV1({
	username: '5dbdab7a-cc5f-4af4-93ac-235033155bcf',
	password: 'rI2xbfncQpgP',
	url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});

exports.hello = functions.https.onRequest((req, res) => {
	res.status(200).send('hello');	
});

exports.tts = functions.https.onRequest((req, res) => {
	let params = {
		text: req.query.text,
		voice: 'en-US-AllisonVoice',
		accept: 'audio/wav'
	}
	
	textToSpeech.synthesize(params, function(err, audio) {
		res.status(200).send(audio);
	});
});