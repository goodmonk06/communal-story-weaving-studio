import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface StoryFragment {
  id: string
  title: string
  bodyMarkdown: string
  role: 'CORE' | 'SUPPORTING' | 'QUOTE'
  memberId: string
}

export interface WeaveResult {
  bodyMarkdown: string
  metadata: {
    model: string
    temperature: number
    fragmentMapping: Record<string, { role: string; usage: string }>
    promptUsed: string
    generatedAt: string
  }
}

export async function weaveStoryFragments(
  projectTitle: string,
  projectDescription: string,
  fragments: StoryFragment[]
): Promise<WeaveResult> {
  const model = process.env.OPENAI_MODEL || 'gpt-4-turbo-preview'
  const temperature = 0.7

  // Organize fragments by role
  const coreFragments = fragments.filter((f) => f.role === 'CORE')
  const supportingFragments = fragments.filter((f) => f.role === 'SUPPORTING')
  const quoteFragments = fragments.filter((f) => f.role === 'QUOTE')

  // Build the prompt
  const prompt = buildWeavePrompt(
    projectTitle,
    projectDescription,
    coreFragments,
    supportingFragments,
    quoteFragments
  )

  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model,
    temperature,
    messages: [
      {
        role: 'system',
        content: `You are an expert narrative weaver who creates cohesive, compelling stories from multiple personal accounts and experiences. Your narratives honor each contributor's voice while creating a unified whole that's greater than the sum of its parts. You maintain traceability by clearly attributing content to source fragments.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const wovenText = response.choices[0].message.content || ''

  // Build metadata tracking which fragments were used and how
  const fragmentMapping: Record<string, { role: string; usage: string }> = {}
  fragments.forEach((fragment) => {
    fragmentMapping[fragment.id] = {
      role: fragment.role,
      usage: 'Incorporated into narrative', // In a production app, you'd track this more precisely
    }
  })

  return {
    bodyMarkdown: wovenText,
    metadata: {
      model,
      temperature,
      fragmentMapping,
      promptUsed: prompt,
      generatedAt: new Date().toISOString(),
    },
  }
}

function buildWeavePrompt(
  projectTitle: string,
  projectDescription: string,
  coreFragments: StoryFragment[],
  supportingFragments: StoryFragment[],
  quoteFragments: StoryFragment[]
): string {
  let prompt = `# Story Weaving Project: ${projectTitle}\n\n`
  prompt += `## Project Description\n${projectDescription}\n\n`
  prompt += `## Your Task\n`
  prompt += `Weave the following story fragments into a cohesive narrative. Create a unified story that:\n`
  prompt += `1. Maintains each contributor's authentic voice\n`
  prompt += `2. Creates a compelling arc that flows naturally\n`
  prompt += `3. Shows connections and themes across different experiences\n`
  prompt += `4. Includes attribution (mention contributors by name or context)\n`
  prompt += `5. Uses markdown formatting for structure and readability\n\n`

  if (coreFragments.length > 0) {
    prompt += `## Core Fragments (central to the narrative)\n\n`
    coreFragments.forEach((fragment, idx) => {
      prompt += `### Fragment ${idx + 1}: ${fragment.title}\n`
      prompt += `Author: ${fragment.memberId}\n\n`
      prompt += `${fragment.bodyMarkdown}\n\n`
      prompt += `---\n\n`
    })
  }

  if (supportingFragments.length > 0) {
    prompt += `## Supporting Fragments (add depth and context)\n\n`
    supportingFragments.forEach((fragment, idx) => {
      prompt += `### Fragment ${idx + 1}: ${fragment.title}\n`
      prompt += `Author: ${fragment.memberId}\n\n`
      prompt += `${fragment.bodyMarkdown}\n\n`
      prompt += `---\n\n`
    })
  }

  if (quoteFragments.length > 0) {
    prompt += `## Quote Fragments (use as highlights or pull quotes)\n\n`
    quoteFragments.forEach((fragment, idx) => {
      prompt += `### Fragment ${idx + 1}: ${fragment.title}\n`
      prompt += `Author: ${fragment.memberId}\n\n`
      prompt += `${fragment.bodyMarkdown}\n\n`
      prompt += `---\n\n`
    })
  }

  prompt += `\n## Guidelines\n`
  prompt += `- Create a narrative that honors all contributors\n`
  prompt += `- Weave fragments together naturally, not just concatenate them\n`
  prompt += `- Add transitions and connective tissue where needed\n`
  prompt += `- Maintain traceability - readers should sense where each voice appears\n`
  prompt += `- Format in markdown with clear sections\n`
  prompt += `- Add a brief attribution note at the end listing contributors\n\n`
  prompt += `Please generate the woven narrative now.`

  return prompt
}
