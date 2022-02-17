const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios')

try {
  // `who-to-greet` input defined in action metadata file
  const chatId = core.getInput('chat-id');
  console.log(`Chat ID: ${chatId}`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}


// console.log()
// console.log('============================')
// console.log('ENV VARS', JSON.stringify(process.env, null, 4))
// console.log('============================')
// console.log()

// const {
// 	PR_ACTION,
// 	PR_TITLE,
// 	PR_ID,
// 	PR_USER,
// 	PR_MERGED,
// 	PRONTO_TOKEN,
// 	PRONTO_GROUP_ID,
// 	PRONTO_DOMAIN,
// } = process.env

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

// const action = PR_MERGED === 'true' || PR_MERGED === true ? 'merged' : PR_ACTION

// axios({
// 	method: 'post',
// 	url: `https://${PRONTO_DOMAIN}/api/chats/${PRONTO_GROUP_ID}/messages`,
// 	headers: {
// 		'Content-Type': 'application/json',
// 		Authorization: `Bearer ${PRONTO_TOKEN}`,
// 	},
// 	data: {
// 		text: [
// 			PR_TITLE,
// 			`https://github.com/Hitlabs/pronto-web/pull/${PR_ID}`,
// 			`PR #${PR_ID} ${action} by @${PR_USER}`,
// 		].join('\n'),
// 	},
// })
// 	.then((data) => {
// 		console.log('Message Successfully Posted to Pronto!', data)
// 	})
// 	.catch((e) => {
// 		console.log('ERROR', e)
// 	})