const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

const apiToken = core.getInput('api-token');
const chatId = core.getInput('chat-id');
const prontoDomain = core.getInput('api-domain') || 'api.pronto.io'
const { payload } = github.context;
const { pull_request, review, sender } = payload;

console.log(`Chat ID: ${chatId}`);
console.log(`The event payload: ${JSON.stringify(payload, null, 2) }`);

if (!chatId || !apiToken) {
	throw new Error(`Invalid parameters provided: ${JSON.stringify({ chatId, apiToken })}`)
}


let action = payload.action
if (review && review.state === 'approved') {
	action = 'approved'
} else if (pull_request.merged) {
	action = 'merged'
}

axios({
	method: 'post',
	url: `https://${prontoDomain}/api/chats/${chatId}/messages`,
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiToken}`,
	},
	data: {
		text: [
			pull_request.title,
			pull_request.html_url,
			`PR #${pull_request.number} ${action} by @${sender.login}`,
		].join('\n'),
	},
})
	.then((data) => {
		console.log('Message Successfully Posted to Pronto!', data)
	})