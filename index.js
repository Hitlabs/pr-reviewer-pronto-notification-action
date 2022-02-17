const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

const apiToken = core.getInput('api-token');
const chatId = core.getInput('chat-id');
const { eventName, payload, ref } = github.context;
const pull_request = payload.pull_request;

console.log(`Chat ID: ${chatId}`);
console.log(`The event payload: ${ JSON.stringify(payload, undefined, 2) }`);

const PR_ACTION = payload.action;
const PR_TITLE = pull_request.title;
const PR_ID = pull_request.id;
const PR_USER = pull_request.user.login;
const PR_MERGED = pull_request.merged;
const PRONTO_TOKEN = apiToken;
const PRONTO_GROUP_ID = chatId;
const PRONTO_DOMAIN = "api.pronto.io";

// if (!['opened', 'closed', 'reopened'].includes(PR_ACTION)) {
// 	// possible types are found here:
// 	// https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#pullrequestevent
// 	console.log('IGNORING PR ACTION TYPE OF', PR_ACTION)
// 	return
// }

// const isValid = [
// 	'PR_ACTION',
// 	'PR_TITLE',
// 	'PR_ID',
// 	'PR_USER',
// 	'PRONTO_TOKEN',
// 	'PRONTO_GROUP_ID',
// 	'PRONTO_DOMAIN',
// ]
// 	.map((key) => {
// 		const envVar = process.env[key]
// 		if (!envVar) console.log('********** Invalid arg:', key, envVar)
// 		return !!envVar
// 	})
// 	.every((k) => k)

// if (!isValid) return

const action = PR_MERGED === 'true' || PR_MERGED === true ? 'merged' : PR_ACTION

axios({
	method: 'post',
	url: `https://${PRONTO_DOMAIN}/api/chats/${PRONTO_GROUP_ID}/messages`,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${PRONTO_TOKEN}`,
	},
	data: {
		text: [
			PR_TITLE,
			`https://github.com/Hitlabs/pronto-web/pull/${PR_ID}`,
			`PR #${PR_ID} ${action} by @${PR_USER}`,
		].join('\n'),
	},
})
	.then((data) => {
		console.log('Message Successfully Posted to Pronto!', data)
	})
	.catch((e) => {
		console.log('ERROR', e)
	})