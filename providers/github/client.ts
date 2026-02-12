import { Octokit } from '@octokit/rest'

// GitHub Client Configuration
export const githubClient = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

// Helper Functions
export async function getRepository(owner: string, repo: string) {
  const { data } = await githubClient.repos.get({ owner, repo })
  return data
}

export async function listIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open') {
  const { data } = await githubClient.issues.listForRepo({ owner, repo, state })
  return data
}

export async function createIssue(owner: string, repo: string, title: string, body?: string) {
  const { data } = await githubClient.issues.create({ owner, repo, title, body })
  return data
}

export async function listPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'open') {
  const { data } = await githubClient.pulls.list({ owner, repo, state })
  return data
}

export async function getFileContent(owner: string, repo: string, path: string, ref?: string) {
  const { data } = await githubClient.repos.getContent({ owner, repo, path, ref })
  return data
}

export async function createOrUpdateFile(
  owner: string,
  repo: string,
  path: string,
  message: string,
  content: string,
  sha?: string
) {
  const { data } = await githubClient.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha,
  })
  return data
}
