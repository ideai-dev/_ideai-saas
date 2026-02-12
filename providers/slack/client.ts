import { WebClient } from '@slack/web-api'

// Slack Client Configuration
export const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN)

// Helper Functions
export async function sendMessage(channel: string, text: string) {
  const result = await slackClient.chat.postMessage({
    channel,
    text,
  })
  return result
}

export async function sendRichMessage(channel: string, blocks: any[], text?: string) {
  const result = await slackClient.chat.postMessage({
    channel,
    blocks,
    text,
  })
  return result
}

export async function listChannels() {
  const result = await slackClient.conversations.list()
  return result.channels
}

export async function getChannelInfo(channel: string) {
  const result = await slackClient.conversations.info({ channel })
  return result.channel
}

export async function getUserInfo(user: string) {
  const result = await slackClient.users.info({ user })
  return result.user
}

export async function uploadFile(channels: string, file: Buffer, filename: string) {
  const result = await slackClient.files.uploadV2({
    channels,
    file,
    filename,
  })
  return result
}
