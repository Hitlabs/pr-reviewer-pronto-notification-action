# PR Review Pronto Notify Action

This action will post a message to a chat in Pronto when a new PR is opened.

# Adding the action to your project

In your `./github/workflows` directory, add a `pronto_post.yml`. Add the following as contents:

```yml
name: Post to Pronto
on: [pull_request]
jobs:
  post-to-pronto:
    runs-on: ubuntu-latest
    steps:
      - name: post
        uses: Hitlabs/pr-reviewer-pronto-notification-action@v1
        with:
          chat-id: 000000
          api-token: ${{ secrets.PRONTO_BOT_API_TOKEN }}
```

Change the `chat-id` input property to be whatever chat you want the message to appear in. The API Token will be pulled in automatically from the organization's shared secret store.

Commit and push this file to your repo.

Test it out by creating a test PR.
