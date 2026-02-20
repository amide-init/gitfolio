#!/usr/bin/env node

// Simple build-time GitHub fetcher & CLI.
// Fetches profile + repos and writes a typed TS module under src/generated/githubData.ts
// so the React app can use static, hardcoded data at runtime.
//
// Usage (locals):
//   node scripts/generate-github-data.js usedamru --type org
//   GITHUB_OWNER=usedamru GITHUB_PROFILE_TYPE=org node scripts/generate-github-data.js
//   pnpm generate:github
//
// Defaults to the Damru org if no env vars are provided.

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const rootDir = new URL('..', import.meta.url).pathname
const generatedDir = path.join(rootDir, 'src', 'generated')
const tsOutputFile = path.join(generatedDir, 'githubData.ts')
const siteContentJsonPath = path.join(rootDir, 'src', 'siteContent.json')
const configPath = path.join(rootDir, 'gitforge.config.json')

/**
 * Minimal shape we care about for GitHub profile.
 * We intentionally narrow the fields so the generated file stays small and stable.
 */
function pickProfileFields(json, owner, profileType) {
  if (!json || typeof json !== 'object') return null

  return {
    login: json.login ?? owner,
    name: json.name ?? null,
    avatar_url: json.avatar_url ?? null,
    html_url: json.html_url ?? (profileType === 'org'
      ? `https://github.com/${owner}`
      : `https://github.com/${owner}`),
    description: json.description ?? null,
    email: json.email ?? null,
    location: json.location ?? null,
    company: json.company ?? null,
    blog: json.blog ?? null,
    twitter_username: json.twitter_username ?? null,
    public_repos: json.public_repos ?? 0,
    followers: json.followers ?? 0,
    following: json.following ?? 0,
    updated_at: json.updated_at ?? null,
    type: json.type ?? (profileType === 'org' ? 'Organization' : 'User'),
  }
}

/**
 * Minimal shape we care about for GitHub repos.
 */
function pickRepoFields(json) {
  if (!json || typeof json !== 'object') return null

  return {
    id: json.id,
    name: json.name,
    full_name: json.full_name,
    html_url: json.html_url,
    description: json.description,
    stargazers_count: json.stargazers_count,
    language: json.language,
    open_issues_count: json.open_issues_count,
    topics: json.topics ?? [],
    archived: json.archived ?? false,
    disabled: json.disabled ?? false,
    fork: json.fork ?? false,
    private: json.private ?? false,
    pushed_at: json.pushed_at,
    updated_at: json.updated_at,
  }
}

async function fetchJson(url, label, token) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'damru-site-build-script',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(url, { headers })

  if (!res.ok) {
    throw new Error(`${label} request failed with ${res.status} ${res.statusText}`)
  }

  return res.json()
}

async function fetchGraphQL(query, variables, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
    'User-Agent': 'damru-site-build-script',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  })

  if (!res.ok) {
    throw new Error(`GraphQL request failed with ${res.status} ${res.statusText}`)
  }

  const json = await res.json()
  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  }

  return json.data
}

async function main() {
  // Load .env file if it exists
  const envPath = path.join(rootDir, '.env')
  try {
    const envContent = await fs.readFile(envPath, 'utf8')
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim()
          // Remove quotes if present
          const cleanValue = value.replace(/^["']|["']$/g, '')
          if (!process.env[key]) {
            process.env[key] = cleanValue
          }
        }
      }
    }
  } catch (error) {
    // .env file doesn't exist or can't be read - that's fine
    if (error && error.code !== 'ENOENT') {
      console.warn('Warning: Could not read .env file:', error.message)
    }
  }

  let fileConfig = {}

  try {
    const raw = await fs.readFile(configPath, 'utf8')
    fileConfig = JSON.parse(raw)
  } catch (error) {
    if (error && error.code !== 'ENOENT') {
      console.warn('Could not read gitforge.config.json, using defaults.')
    }
  }

  const defaultOwner = 'usedamru'
  const defaultProfileType = 'org'

  // --- CLI args: [owner] [--type user|org] ---
  const argv = process.argv.slice(2)
  let cliOwner = undefined
  let cliType = undefined

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (!arg) continue

    if (arg === '--type' && argv[i + 1]) {
      cliType = argv[i + 1]
      i += 1
      continue
    }

    if (arg.startsWith('--type=')) {
      cliType = arg.split('=')[1]
      continue
    }

    // First non-flag argument is treated as the owner
    if (!arg.startsWith('-') && !cliOwner) {
      cliOwner = arg
    }
  }

  const owner =
    cliOwner ??
    process.env.GITHUB_OWNER ??
    fileConfig.githubOwner ??
    defaultOwner

  const profileTypeEnv = (
    cliType ??
    process.env.GITHUB_PROFILE_TYPE ??
    fileConfig.profileType ??
    defaultProfileType
  ).toLowerCase()

  const profileType = profileTypeEnv === 'user' ? 'user' : 'org'

  // --- GitHub token for accessing private repos (optional) ---
  //
  // Priority:
  // 1. fileConfig.githubToken      (explicit, user-controlled)
  // 2. process.env.GITHUB_TOKEN    (built-in Actions token or a PAT)
  // 3. no token (public / unauthenticated requests)
  //
  // NOTE: The default GitHub Actions GITHUB_TOKEN may not have permission
  // for all REST/GraphQL APIs. If it returns 401s, users should provide
  // a real personal access token (ghp_... / github_pat_...) via either
  // gitforge.config.json or a repository secret.
  const rawEnvToken = process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim()

  const configToken =
    fileConfig.githubToken && typeof fileConfig.githubToken === 'string'
      ? fileConfig.githubToken.trim()
      : null

  const githubToken = configToken || rawEnvToken || null

  // Debug: Log token status (without exposing the actual token)
  if (githubToken) {
    const source = configToken
      ? 'config file (gitforge.config.json)'
      : 'environment (GITHUB_TOKEN)'
    console.log(
      `GitHub token found: ${githubToken.substring(0, 7)}... (from ${source})`,
    )
  } else {
    console.log(
      'No GitHub token found. Using unauthenticated GitHub API requests. ' +
        'To enable private-repo stats and higher limits, add a personal access token as GITHUB_TOKEN or set githubToken in gitforge.config.json.',
    )
  }

  const featuredReposFromConfig = Array.isArray(fileConfig.featuredRepos)
    ? fileConfig.featuredRepos.filter((name) => typeof name === 'string')
    : []

  const legacyCount =
    typeof fileConfig.maxFeaturedRepos === 'number' && fileConfig.maxFeaturedRepos > 0
      ? fileConfig.maxFeaturedRepos
      : undefined

  const listedRepoFromConfig = fileConfig.listedRepo ?? {}

  const listedRepoCount =
    typeof listedRepoFromConfig.count === 'number' && listedRepoFromConfig.count > 0
      ? listedRepoFromConfig.count
      : legacyCount ?? 4

  const listedRepoSortRaw = (listedRepoFromConfig.sort || '').toLowerCase()
  // Supported values:
  // - "date" (default): newest first
  // - "star" | "stars": most starred first
  // - "date-then-star": newest first, breaking ties by stars
  // - "star-then-date": most starred first, breaking ties by date
  const listedRepoSort =
    listedRepoSortRaw === 'star' || listedRepoSortRaw === 'stars'
      ? 'star'
      : listedRepoSortRaw === 'date-then-star' || listedRepoSortRaw === 'date_star'
        ? 'date-then-star'
        : listedRepoSortRaw === 'star-then-date' || listedRepoSortRaw === 'star_date'
          ? 'star-then-date'
          : 'date'

  // --- Hero config ---
  const heroConfig = fileConfig.hero ?? {}
  const customEyebrow =
    typeof heroConfig.eyebrow === 'string' && heroConfig.eyebrow.trim()
      ? heroConfig.eyebrow.trim()
      : 'Open-source, developer-first profile'
  const minorInfo =
    typeof heroConfig.minorInfo === 'string' && heroConfig.minorInfo.trim()
      ? heroConfig.minorInfo.trim()
      : null

  // --- Brief info config ---
  // --- Stats section config ---
  const showStats = fileConfig.showStats !== false // default true
  const statsConfig = fileConfig.stats ?? {}
  const showLanguageChart = statsConfig.showLanguageChart !== false // default true
  const showRepoActivityChart = statsConfig.showRepoActivityChart !== false // default true
  const showCommitActivityChart = statsConfig.showCommitActivityChart !== false // default true
  const showTopReposChart = statsConfig.showTopReposChart !== false // default true

  // --- Contact visibility config ---
  const contactConfig = fileConfig.contact ?? {}
  const showCompany = contactConfig.showCompany !== false // default true
  const showEmail = contactConfig.showEmail !== false // default true
  const showWebsite = contactConfig.showWebsite !== false // default true
  const showTwitter = contactConfig.showTwitter !== false // default true

  const profileUrl =
    profileType === 'org'
      ? `https://api.github.com/orgs/${owner}`
      : `https://api.github.com/users/${owner}`

  // Fetch all repos (including private) if token is provided, otherwise only public
  const reposUrl =
    profileType === 'org'
      ? `https://api.github.com/orgs/${owner}/repos?per_page=100&sort=updated${
          githubToken ? '&type=all' : ''
        }`
      : `https://api.github.com/users/${owner}/repos?per_page=100&sort=updated${
          githubToken ? '&type=all' : ''
        }`

  console.log(
    `Fetching GitHub data for ${profileType} "${owner}" from:\n  ${profileUrl}\n  ${reposUrl}`,
  )
  if (githubToken) {
    console.log('Using GitHub token - will include private repos in stats calculations')
  }

  const [profileJson, reposJson] = await Promise.all([
    fetchJson(profileUrl, 'Profile', githubToken),
    fetchJson(reposUrl, 'Repos', githubToken),
  ])

  // Fetch commit activity via GraphQL (only for users, requires token)
  // Note: GitHub GraphQL API only allows 1 year per query, so we fetch each year separately
  let commitActivityByYear = []
  if (
    profileType === 'user' &&
    githubToken &&
    showCommitActivityChart &&
    showStats
  ) {
    try {
      const currentYear = new Date().getFullYear()
      const startYear = currentYear - 4 // Last 5 years
      const query = `
        query($login: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `
      const commitsByYear = {}

      // Fetch each year separately (GitHub API limitation: max 1 year per query)
      const yearPromises = []
      for (let year = startYear; year <= currentYear; year++) {
        const variables = {
          login: owner,
          from: `${year}-01-01T00:00:00Z`,
          to: `${year}-12-31T23:59:59Z`,
        }
        yearPromises.push(
          fetchGraphQL(query, variables, githubToken)
            .then((graphqlData) => {
              if (
                graphqlData?.user?.contributionsCollection?.contributionCalendar
              ) {
                const calendar =
                  graphqlData.user.contributionsCollection.contributionCalendar
                let yearCommits = 0

                for (const week of calendar.weeks) {
                  for (const day of week.contributionDays) {
                    if (day.contributionCount > 0) {
                      yearCommits += day.contributionCount
                    }
                  }
                }

                if (yearCommits > 0) {
                  commitsByYear[year] = yearCommits
                }
              }
            })
            .catch((err) => {
              console.warn(
                `Warning: Could not fetch commit activity for year ${year}: ${err.message}`,
              )
            }),
        )
      }

      await Promise.allSettled(yearPromises)

      commitActivityByYear = Object.entries(commitsByYear)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([year, commits]) => ({
          year: Number(year),
          commits: Number(commits),
        }))

      if (commitActivityByYear.length > 0) {
        console.log(
          `Fetched commit activity for ${commitActivityByYear.length} year(s)`,
        )
      }
    } catch (error) {
      console.warn(
        `Warning: Could not fetch commit activity: ${error.message}. Skipping commit activity chart.`,
      )
    }
  } else if (profileType === 'user' && showCommitActivityChart && showStats) {
    console.log(
      'Skipping commit activity: GitHub token required (set GITHUB_TOKEN in .env or githubToken in config)',
    )
  }

  const profile = pickProfileFields(profileJson, owner, profileType)

  // Optional: fetch social accounts (LinkedIn, Instagram, etc.) for the
  // authenticated user when a token is available. This uses the /user/social_accounts
  // endpoint, which returns social links tied to the token's owner.
  // In the common GitHub Actions setup, the token owner matches GITHUB_OWNER,
  // so these links will be your own LinkedIn/Instagram URLs.
  let socialAccounts = []
  if (profileType === 'user' && githubToken && showWebsite) {
    try {
      const socialJson = await fetchJson(
        'https://api.github.com/user/social_accounts',
        'Social accounts',
        githubToken,
      )
      if (Array.isArray(socialJson)) {
        socialAccounts = socialJson
          .filter(
            (acc) =>
              acc &&
              typeof acc === 'object' &&
              typeof acc.provider === 'string' &&
              typeof acc.url === 'string',
          )
          .map((acc) => ({
            provider: acc.provider.toLowerCase(),
            url: acc.url,
          }))
      }
    } catch (error) {
      console.log(
        `Could not fetch social accounts for token owner: ${error.message}. Continuing without social links.`,
      )
    }
  }
  const reposRaw = Array.isArray(reposJson) ? reposJson : []
  const reposAllRaw = reposRaw.map(pickRepoFields).filter(Boolean)

  // Separate public repos (for display) from all repos (for stats)
  const reposPublic = reposAllRaw.filter((repo) => !repo.private)
  const reposAll = reposAllRaw

  // Sort public repos for display (most recently pushed first)
  const repos = reposPublic.sort((a, b) => {
    const aTime = a?.pushed_at ? Date.parse(a.pushed_at) : 0
    const bTime = b?.pushed_at ? Date.parse(b.pushed_at) : 0
    return bTime - aTime
  })

  // --- Support external featured repos like "org/repo-name"
  const externalFeaturedFullNames = featuredReposFromConfig.filter(
    (name) => typeof name === 'string' && name.includes('/'),
  )

  let externalFeaturedRepos = []
  if (externalFeaturedFullNames.length > 0) {
    const externalResults = await Promise.allSettled(
      externalFeaturedFullNames.map((fullName) =>
        fetchJson(
          `https://api.github.com/repos/${fullName}`,
          `Featured repo ${fullName}`,
          githubToken,
        ),
      ),
    )

    externalFeaturedRepos = externalResults
      .filter((r) => r.status === 'fulfilled')
      .map((r) => pickRepoFields(r.value))
      .filter(Boolean)
  }

  // Merge external featured repos into public repos (for display), de-duping by id
  const existingPublicIds = new Set(repos.map((repo) => repo.id))
  const mergedExternal = externalFeaturedRepos.filter(
    (repo) => repo && !existingPublicIds.has(repo.id),
  )
  const reposForDisplay = [...repos, ...mergedExternal]

  // Add external repos to all repos for stats (if not already present)
  const existingAllIds = new Set(reposAll.map((repo) => repo.id))
  const externalForStats = externalFeaturedRepos.filter(
    (repo) => repo && !existingAllIds.has(repo.id),
  )
  const reposAllForStats = [...reposAll, ...externalForStats]

  const clientConfig = {
    featuredRepos: featuredReposFromConfig,
    listedRepo: {
      count: listedRepoCount,
      sort: listedRepoSort,
    },
  }

  // ---------- Build siteContent JSON template used by the React app ----------
  // Use ALL repos (including private) for stats/language calculations
  const totalStars = reposAllForStats.reduce(
    (sum, repo) => sum + (repo.stargazers_count ?? 0),
    0,
  )

  const languageCounts = reposAllForStats.reduce((acc, repo) => {
    if (repo.language) {
      acc[repo.language] = (acc[repo.language] ?? 0) + 1
    }
    return acc
  }, /** @type {Record<string, number>} */ ({}))

  const topLanguageEntry = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]
  const topLanguage = topLanguageEntry ? topLanguageEntry[0] : null

  const mostStarredRepo =
    reposAllForStats
      .slice()
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))[0] ?? null

  const allTopics = Array.from(
    new Set(
      reposAllForStats
        .flatMap((repo) => repo.topics ?? [])
        .filter((topic) => Boolean(topic)),
    ),
  )
  const topTopics = allTopics.slice(0, 5)

  // Derive a compact "top skills" summary from languages & topics
  const topLanguagesList = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([language]) => language)

  const topLanguageNames = topLanguagesList.slice(0, 3)
  const topTopicNames = topTopics.slice(0, 3)

  let snapshotSubtitle = null
  if (topLanguageNames.length > 0 || topTopicNames.length > 0) {
    const parts = []
    if (topLanguageNames.length > 0) {
      parts.push(topLanguageNames.join(', '))
    }
    if (topTopicNames.length > 0) {
      parts.push(topTopicNames.join(', '))
    }
    snapshotSubtitle = `${parts.join(' · ')}`
  }

  // Use PUBLIC repos only for display/featured repos
  const featuredReposRaw =
    clientConfig.featuredRepos && clientConfig.featuredRepos.length > 0
      ? clientConfig.featuredRepos
          .map((name) => {
            if (typeof name !== 'string') return null
            // Support both "repoName" and "owner/repoName"
            if (name.includes('/')) {
              return reposForDisplay.find((repo) => repo.full_name === name) ?? null
            }
            return reposForDisplay.find((repo) => repo.name === name) ?? null
          })
          .filter(Boolean)
      : []

  const remainingReposRaw = reposForDisplay.filter(
    (repo) => !featuredReposRaw.some((f) => f.id === repo.id),
  )

  let additionalSource = remainingReposRaw
  if (clientConfig.listedRepo.sort === 'star') {
    additionalSource = [...remainingReposRaw].sort(
      (a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0),
    )
  } else if (clientConfig.listedRepo.sort === 'date-then-star') {
    additionalSource = [...remainingReposRaw].sort((a, b) => {
      const aTime = a?.pushed_at ? Date.parse(a.pushed_at) : 0
      const bTime = b?.pushed_at ? Date.parse(b.pushed_at) : 0
      if (bTime !== aTime) return bTime - aTime
      const aStars = a?.stargazers_count ?? 0
      const bStars = b?.stargazers_count ?? 0
      return bStars - aStars
    })
  } else if (clientConfig.listedRepo.sort === 'star-then-date') {
    additionalSource = [...remainingReposRaw].sort((a, b) => {
      const aStars = a?.stargazers_count ?? 0
      const bStars = b?.stargazers_count ?? 0
      if (bStars !== aStars) return bStars - aStars
      const aTime = a?.pushed_at ? Date.parse(a.pushed_at) : 0
      const bTime = b?.pushed_at ? Date.parse(b.pushed_at) : 0
      return bTime - aTime
    })
  }

  const additionalReposRaw = additionalSource.slice(0, clientConfig.listedRepo.count)

  const toNormalizedRepo = (repo, featured) => ({
    name: repo.name,
    description:
      repo.description ??
      'Repository on GitHub. Edit siteContent.json to customise this copy.',
    url: repo.html_url,
    stars: repo.stargazers_count ?? 0,
    language: repo.language,
    topics: repo.topics ?? [],
    lastUpdated: repo.updated_at,
    featured: Boolean(featured),
  })

  const featuredReposNormalized = [
    ...featuredReposRaw.map((repo) => toNormalizedRepo(repo, true)),
    ...additionalReposRaw.map((repo) => toNormalizedRepo(repo, false)),
  ]

  const displayName = profile.name || profile.login
  let heroDescription = (profile.description || '').trim()

  if (!heroDescription) {
    const sentences = []

    // Sentence 1: activity + stars
    const starsPart =
      totalStars > 0 ? ` with ${totalStars} stars across these projects` : ''
    sentences.push(
      `${displayName} maintains ${profile.public_repos} public repositories on GitHub${starsPart}.`,
    )

    // Sentence 2: language + topics
    const languagePart = topLanguage
      ? `Most of the work centers around ${topLanguage}`
      : null
    const topicsPreview =
      topTopics.length > 0 ? topTopics.slice(0, 3).join(', ') : null

    if (languagePart && topicsPreview) {
      sentences.push(
        `${languagePart}, with repositories touching topics like ${topicsPreview}.`,
      )
    } else if (languagePart) {
      sentences.push(`${languagePart}.`)
    } else if (topicsPreview) {
      sentences.push(
        `Repositories explore topics such as ${topicsPreview} and related tooling.`,
      )
    }

    heroDescription = sentences.join(' ')
  }

  const snapshotItems = [
    `${profile.public_repos} public repositories`,
    `${profile.followers} followers · ${profile.following} following`,
  ]

  if (profile.updated_at) {
    snapshotItems.push(
      `Profile updated on ${new Date(profile.updated_at).toLocaleDateString()}`,
    )
  }

  if (profile.location) {
    snapshotItems.unshift(`Based in ${profile.location}`)
  }

  const philosophyCards = [
    {
      title: 'Repositories & activity',
      body: `${profile.name || profile.login} has ${profile.public_repos} public repositories with a total of ${totalStars} stars across this profile.`,
    },
    {
      title: 'Languages in use',
      body: topLanguage
        ? `The most common language across these repositories is ${topLanguage}, alongside ${
            Object.keys(languageCounts).length - 1
          } other languages.`
        : 'GitHub does not report primary languages for these repositories yet.',
    },
    mostStarredRepo && {
      title: 'Most starred repository',
      body: `${mostStarredRepo.name} is the most starred repository with ${mostStarredRepo.stargazers_count} stars.`,
    },
    {
      title: 'Topics & domains',
      body:
        topTopics.length > 0
          ? `Repositories in this profile are tagged with topics like ${topTopics.join(
              ', ',
            )}${
              allTopics.length > topTopics.length
                ? ` and ${allTopics.length - topTopics.length} more.`
                : '.'
            }`
          : 'No GitHub topics are configured yet for these repositories.',
    },
  ].filter(Boolean)

  // ---------- Calculate stats for visualization ----------
  // Use ALL repos (including private) for aggregate stats
  const totalForks = reposAllForStats.reduce(
    (sum, repo) => sum + (repo.fork ? 1 : 0),
    0,
  )
  const totalOpenIssues = reposAllForStats.reduce(
    (sum, repo) => sum + (repo.open_issues_count ?? 0),
    0,
  )

  // Language distribution (top 8 languages) - includes private repos
  // Percentages are computed over repos that have a language set,
  // so language percentages feel intuitive and sum close to 100%.
  const totalReposWithLanguage = Object.values(languageCounts).reduce(
    (sum, count) => sum + count,
    0,
  )

  const languageDistribution = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([language, count]) => ({
      language,
      count,
      percentage:
        totalReposWithLanguage > 0
          ? Math.round((count / totalReposWithLanguage) * 100)
          : 0,
    }))

  // Repository activity by year (based on last push date) - includes private repos
  const reposByYear = reposAllForStats.reduce((acc, repo) => {
    if (repo.pushed_at) {
      const year = new Date(repo.pushed_at).getFullYear()
      acc[year] = (acc[year] || 0) + 1
    }
    return acc
  }, /** @type {Record<number, number>} */ ({}))

  const activityByYear = Object.entries(reposByYear)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({
      year: Number(year),
      repos: count,
    }))
    .slice(-5) // Last 5 years

  // Top repositories by stars - only PUBLIC repos for display
  const topReposByStars = reposForDisplay
    .slice()
    .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
    .slice(0, 5)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count ?? 0,
      language: repo.language || 'Other',
    }))

  // Normalize website/blog URL: ensure it has a protocol, or return null if empty
  const normalizeWebsiteUrl = (url) => {
    if (!url || typeof url !== 'string') return null
    const trimmed = url.trim()
    if (!trimmed) return null
    // If it already has a protocol, return as-is
    if (/^https?:\/\//i.test(trimmed)) return trimmed
    // Otherwise, prepend https://
    return `https://${trimmed}`
  }

  const normalizedWebsite = normalizeWebsiteUrl(profile.blog)

  const siteContent = {
    hero: {
      eyebrow: customEyebrow,
      title: profile.name || profile.login,
      description: heroDescription,
      minorInfo: minorInfo,
      avatarUrl: profile.avatar_url,
      primaryCtaLabel: 'View on GitHub',
      primaryCtaHref: profile.html_url,
      caption: '',
      contact: {
        email: showEmail ? profile.email : null,
        location: profile.location,
        company: showCompany ? profile.company : null,
        website: showWebsite ? normalizedWebsite : null,
        social:
          showWebsite && Array.isArray(socialAccounts) && socialAccounts.length > 0
            ? socialAccounts
            : [],
        twitter: showTwitter ? profile.twitter_username : null,
      },
    },
    snapshot: {
      title: 'Top skills',
      items: snapshotItems,
      subtitle: snapshotSubtitle,
    },
    philosophy: {
      title: 'Philosophy',
      body:
        'Guardrails over guesswork. The goal is to keep infrastructure and developer tooling deterministic, explainable, and easy to inspect — even when AI is part of the workflow.',
      cards: philosophyCards,
    },
    projects: {
      title: 'Projects',
      body:
        'A selection of repositories from this GitHub profile, captured at build time. Links take you directly to the source on GitHub.',
      repos: featuredReposNormalized,
    },
    stats: showStats
      ? {
          metrics: {
            totalRepos: reposAllForStats.length, // Total including private
            publicRepos: profile.public_repos, // Public only
            totalStars: totalStars,
            totalForks: totalForks,
            totalOpenIssues: totalOpenIssues,
            languagesUsed: Object.keys(languageCounts).length,
            followers: profile.followers,
            following: profile.following,
          },
          languageDistribution: showLanguageChart ? languageDistribution : [],
          activityByYear: showRepoActivityChart ? activityByYear : [],
          commitActivityByYear: showCommitActivityChart ? commitActivityByYear : [],
          topReposByStars: showTopReposChart ? topReposByStars : [],
        }
      : null,
    footer: {
      text:
        'This page is generated from GitHub profile data and can be deployed as a fully static site.',
      subtleText:
        'Deterministic by default. Explainability over magic. Built for developers first.',
      githubLabel: 'GitHub',
      githubUrl: profile.html_url,
    },
  }

  // ---------- Write TypeScript data module ----------
  const fileHeader = `// This file is auto-generated by scripts/generate-github-data.js
// Do not edit by hand. Run the script again to refresh data.
//
// Source:
//   owner: ${owner}
//   type: ${profileType}

export const githubOwner = ${JSON.stringify(owner)} as const;
export const githubProfileType = ${JSON.stringify(profileType)} as const;

export const githubProfile = ${JSON.stringify(profile, null, 2)} as const;

export const githubRepos = ${JSON.stringify(reposAll, null, 2)} as const;

export const githubConfig = ${JSON.stringify(clientConfig, null, 2)} as const;

export type GitHubProfile = typeof githubProfile;
export type GitHubRepo = (typeof githubRepos)[number];
export type GitHubConfig = typeof githubConfig;
`

  await fs.mkdir(generatedDir, { recursive: true })
  await fs.writeFile(tsOutputFile, fileHeader, 'utf8')
  await fs.writeFile(siteContentJsonPath, JSON.stringify(siteContent, null, 2), 'utf8')

  console.log(
    `Wrote static GitHub data to ${path.relative(
      rootDir,
      tsOutputFile,
    )} and site content template to ${path.relative(rootDir, siteContentJsonPath)}`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})

