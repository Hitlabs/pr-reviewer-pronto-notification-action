const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

const prontoApiToken = core.getInput('pronto-api-token');
const githubApiToken = core.getInput('github-api-token');
const chatId = core.getInput('chat-id');
const prontoDomain = core.getInput('api-domain') || 'api.pronto.io'
const { payload } = github.context;

const MSG_ID_REGEXP = /\[\[PRONTO_MSG_ID:(\d.*)\]\]/

console.log(`Chat ID: ${chatId}`);
console.log(`The event payload: ${JSON.stringify(payload, null, 2) }`);

if (!chatId || !prontoApiToken || !githubApiToken) {
	throw new Error(`Invalid parameters provided: ${JSON.stringify({ chatId, prontoApiToken, githubApiToken })}`)
}


let action = payload.action
if (payload.review && payload.review.state === 'approved') {
	action = 'approved'
} else if (payload.pull_request.merged) {
	action = 'merged'
}

function parseMsgId(str) {
	const matches = str.match(MSG_ID_REGEXP)
	return matches ? parseInt(matches[1]) : null
}

async function postToPronto(event, parentmessage_id) {
	console.log('POSTING TO PRONTO')
	const { pull_request, action, sender } = event;

	const text = parentmessage_id 
		? `${action} by @${sender.login}`
		: [
			pull_request.title,
			pull_request.html_url,
			`PR #${pull_request.number} ${action} by @${sender.login}`,
		].join('\n')

	const response = await axios({
		method: 'POST',
		url: `https://${prontoDomain}/api/chats/${chatId}/messages`,
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${prontoApiToken}`,
		},
		data: { parentmessage_id, text },
	})
	console.log('Message Successfully Posted to Pronto!', response)
	return response
}

async function updatePRWithProntoMessageId(event, msgId) {
	console.log('UPDATING PR WITH MESSAGE ID:', msgId)
	const { pull_request } = event
	const response = await axios({
		method: 'PATCH',
		url: pull_request._links.self.href,
		headers: {
			'Content-Type': 'application/vnd.github.v3+json',
			Authorization: `token ${githubApiToken}`,
		},
		data: {
			body: [
				pull_request.body,
				`[[PRONTO_MSG_ID:${msgId}]]`
			].join('\n\n'),
		},
	})
	console.log('PR Successfully updated', response)
	return response
}

async function handleEvent(event) {
	const parentMsgId = parseMsgId(event.pull_request.body)
	const message = await postToPronto(event, parentMsgId)
	await updatePRWithProntoMessageId(event, message.data.data.id)
	console.log('ALL DONE!')
}

handleEvent(payload)