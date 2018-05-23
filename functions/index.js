const functions = require('firebase-functions');
const cors = require('cors');
const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const textToSpeech = new TextToSpeechV1({
	username: '5dbdab7a-cc5f-4af4-93ac-235033155bcf',
	password: 'rI2xbfncQpgP',
	url: 'https://stream.watsonplatform.net/text-to-speech/api/'
});

exports.tts = functions.https.onRequest((req, res) => {
	var c = cors();
	c(req, res, () => {
		let params = {
			text: req.query.text,
			accept: 'audio/wav'
		}
		
		textToSpeech.synthesize(params, (err, audio) => {
			if (err) {
				res.status(500).send('Error converting to speech');
			}
			
			textToSpeech.repairWavHeader(audio);
			res.status(200).send(audio.toString('base64'));
		});
	});
});