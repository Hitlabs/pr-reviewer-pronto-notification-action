# PR Review Pronto Notify Action

This action will post a message to a chat in Pronto when a new PR is opened.

# Adding the action to your project

In your `./github/workflows` directory, add a `pronto_post.yml`. Add the following as contents:

```yml
name: Post to Pronto
on: [pull_request]
jobs:
  post-to-pronto:
    if: github.event.action == 'opened' || github.event.action == 'closed' || github.event.action == 'reopened'
    runs-on: ubuntu-latest
    steps:
      - name: post
        uses: Hitlabs/pr-reviewer-pronto-notification-action@main
        with:
          chat-id: 000000
          api-token: ${{ secrets.PRONTO_BOT_API_TOKEN }}
```

Change the `chat-id` input property to be whatever chat you want the message to appear in. The API Token will be pulled in automatically from the organization's shared secret store.

You can also optionally change the `if` clause to change the triggering events. You can find possible action values here: https://docs.github.com/en/developers/webhooks-and-events/events/github-event-types#event-payload-object-9

Commit and push this file to your repo.

Test it out by creating a test PR.
