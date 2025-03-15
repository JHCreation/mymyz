// import CryptoJS from 'crypto-js';

export default function guidQ1 () {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
export { guidQ1 };
export function guidS4() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
}

export function generateUID() {
	// I generate the UID from two parts here 
	// to ensure the random number provide enough bits.
	let firstPart:any = (Math.random() * 46656) | 0;
	let secondPart:any = (Math.random() * 46656) | 0;
	firstPart = ("000" + firstPart.toString(36)).slice(-3);
	secondPart = ("000" + secondPart.toString(36)).slice(-3);
	return firstPart + secondPart;
}

export function generateUIDWithCollisionChecking() {
	var _generatedUIDs = {};
	while (true) {
			var uid = ("0000" + ((Math.random() * Math.pow(36, 4)) | 0).toString(36)).slice(-4);
			if (!_generatedUIDs.hasOwnProperty(uid)) {
					_generatedUIDs[uid] = true;
					return uid;
			}
	}
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}


/* export function ncloudMakeSignature({ timestamp }) {
	var space = " ";				// one space
	var newLine = "\n";				// new line
	var method = "POST";				// method
	var url = "/sms/v2/services/ncp:sms:kr:257063279563:jhc-message/messages";	// url (include query string)
	var timestamp:any = `${timestamp}`;			// current timestamp (epoch)
	var accessKey = "DfniYnHiwvbNVF2dEmjo";			// access key id (from portal or Sub Account)
	var secretKey = "pGHJknpOG3PrqfWajFDojC8RVJII2kVarhiHseE9";			// secret key (from portal or Sub Account)

	var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
	hmac.update(method);
	hmac.update(space);
	hmac.update(url);
	hmac.update(newLine);
	hmac.update(timestamp);
	hmac.update(newLine);
	hmac.update(accessKey);

	var hash = hmac.finalize();
	console.log( hash.toString(CryptoJS.enc.Base64) )

	return hash.toString(CryptoJS.enc.Base64);
} */