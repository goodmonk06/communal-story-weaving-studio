import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with enhanced data...')

  // Create demo communities
  const techCommunity = await prisma.community.create({
    data: {
      name: 'Tech Learning Community',
      slug: 'tech-learning',
      description: 'A community for developers learning and growing together',
      settings: JSON.stringify({
        allowPublicFragments: true,
        requireApproval: false,
        maxFragmentsPerMember: 100,
        theme: 'light',
      }),
    },
  })

  const creativesCommunity = await prisma.community.create({
    data: {
      name: 'Creative Writers Collective',
      slug: 'creative-writers',
      description: 'Writers sharing stories and craft',
      settings: JSON.stringify({
        allowPublicFragments: true,
        requireApproval: true,
        theme: 'dark',
      }),
    },
  })

  console.log(`✓ Created ${2} communities`)

  // Create members
  const alice = await prisma.member.create({
    data: {
      communityId: techCommunity.id,
      username: 'alice',
      email: 'alice@example.com',
      displayName: 'Alice Chen',
      bio: 'Full-stack developer passionate about open source and mentorship',
      preferences: JSON.stringify({
        emailNotifications: true,
        digestFrequency: 'weekly',
        timezone: 'America/New_York',
      }),
    },
  })

  const bob = await prisma.member.create({
    data: {
      communityId: techCommunity.id,
      username: 'bob',
      email: 'bob@example.com',
      displayName: 'Bob Martinez',
      bio: 'Open source enthusiast and habit tracker builder',
      preferences: JSON.stringify({
        emailNotifications: false,
        digestFrequency: 'daily',
      }),
    },
  })

  const carol = await prisma.member.create({
    data: {
      communityId: techCommunity.id,
      username: 'carol',
      email: 'carol@example.com',
      displayName: 'Carol Johnson',
      bio: 'Developer and mentor who loves teaching',
    },
  })

  const david = await prisma.member.create({
    data: {
      communityId: techCommunity.id,
      username: 'david',
      email: 'david@example.com',
      displayName: 'David Kim',
      bio: 'Community builder and grateful learner',
    },
  })

  console.log(`✓ Created ${4} members`)

  // Create tags
  const programmingTag = await prisma.tag.create({
    data: {
      communityId: techCommunity.id,
      name: 'Programming',
      slug: 'programming',
      description: 'Code, development, and software engineering',
      color: '#3B82F6',
    },
  })

  const learningTag = await prisma.tag.create({
    data: {
      communityId: techCommunity.id,
      name: 'Learning',
      slug: 'learning',
      description: 'Educational journeys and growth',
      color: '#10B981',
    },
  })

  const communityTag = await prisma.tag.create({
    data: {
      communityId: techCommunity.id,
      name: 'Community',
      slug: 'community',
      description: 'Collaboration and support',
      color: '#F59E0B',
    },
  })

  const menorshipTag = await prisma.tag.create({
    data: {
      communityId: techCommunity.id,
      name: 'Mentorship',
      slug: 'mentorship',
      description: 'Teaching and learning from each other',
      color: '#8B5CF6',
    },
  })

  console.log(`✓ Created ${4} tags`)

  // Create story fragments
  const fragment1 = await prisma.rawStoryFragment.create({
    data: {
      memberId: alice.id,
      communityId: techCommunity.id,
      title: 'My Journey Learning to Code',
      bodyMarkdown: `
I still remember my first line of code. It was a simple "Hello, World!" in Python, but it felt magical.
The cursor blinked, waiting for my command, and when I hit enter, the words appeared on the screen.
That moment of creation sparked something in me.

Over the next months, I struggled. Error messages became my constant companion. But each bug I fixed
taught me something new. The community helped me through the tough times, answering my questions
with patience and encouragement.
      `.trim(),
      status: 'PUBLISHED',
      visibility: 'COMMUNITY',
      viewCount: 42,
      editCount: 2,
    },
  })

  const fragment2 = await prisma.rawStoryFragment.create({
    data: {
      memberId: bob.id,
      communityId: techCommunity.id,
      title: 'Building My First Open Source Project',
      bodyMarkdown: `
After six months of learning, I decided to build something that could help others. A simple tool for
tracking daily habits. I was terrified to publish it - what if people found bugs? What if no one cared?

But I hit publish anyway. The first contributor opened a pull request three days later. They fixed a
bug I didn't even know existed and added a feature I hadn't thought of. That collaboration taught me
that open source isn't just about code - it's about building together.
      `.trim(),
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      viewCount: 89,
      editCount: 1,
    },
  })

  const fragment3 = await prisma.rawStoryFragment.create({
    data: {
      memberId: carol.id,
      communityId: techCommunity.id,
      title: 'Teaching What I Learned',
      bodyMarkdown: `
A year into my coding journey, a beginner reached out asking for help. I almost said no - I'm still
learning myself! But I remembered how patient others had been with me, so I agreed.

Teaching forced me to truly understand concepts I thought I knew. Explaining loops, variables, and
functions to someone else revealed gaps in my own knowledge. We both grew from the experience.
Now I mentor regularly - it's become my favorite part of being in this community.
      `.trim(),
      status: 'PUBLISHED',
      visibility: 'COMMUNITY',
      viewCount: 67,
    },
  })

  const fragment4 = await prisma.rawStoryFragment.create({
    data: {
      memberId: david.id,
      communityId: techCommunity.id,
      title: 'A Simple Thank You',
      bodyMarkdown: `
"Thank you for helping me debug that function. You saved my project!"

That message arrived late one evening. I'd spent an hour helping a community member work through
a tricky issue. I didn't think much of it - just paying forward the help I'd received.

But those simple words of gratitude reminded me why community matters. We're all here, lifting each
other up, one line of code at a time.
      `.trim(),
      status: 'PUBLISHED',
      visibility: 'COMMUNITY',
      viewCount: 54,
    },
  })

  const fragment5 = await prisma.rawStoryFragment.create({
    data: {
      memberId: alice.id,
      communityId: techCommunity.id,
      title: 'Overcoming Imposter Syndrome',
      bodyMarkdown: `
Three years into my career, I still sometimes feel like a fraud. Am I really a "real" developer?
Do I deserve to be here? The doubts creep in, especially when surrounded by brilliant colleagues.

But I've learned that everyone feels this way sometimes. The senior developers I admire? They've
shared their own struggles with imposter syndrome. Realizing I'm not alone has been liberating.
Now I share my journey openly, hoping to help others feel less isolated in their doubts.
      `.trim(),
      status: 'DRAFT',
      visibility: 'PRIVATE',
      viewCount: 5,
    },
  })

  console.log(`✓ Created ${5} story fragments`)

  // Link fragments to tags
  await prisma.fragmentTag.createMany({
    data: [
      { fragmentId: fragment1.id, tagId: programmingTag.id },
      { fragmentId: fragment1.id, tagId: learningTag.id },
      { fragmentId: fragment1.id, tagId: communityTag.id },
      { fragmentId: fragment2.id, tagId: programmingTag.id },
      { fragmentId: fragment2.id, tagId: communityTag.id },
      { fragmentId: fragment3.id, tagId: menorshipTag.id },
      { fragmentId: fragment3.id, tagId: communityTag.id },
      { fragmentId: fragment3.id, tagId: learningTag.id },
      { fragmentId: fragment4.id, tagId: communityTag.id },
      { fragmentId: fragment5.id, tagId: learningTag.id },
    ],
  })

  // Update tag usage counts
  await prisma.tag.update({
    where: { id: programmingTag.id },
    data: { usageCount: 2 },
  })
  await prisma.tag.update({
    where: { id: learningTag.id },
    data: { usageCount: 3 },
  })
  await prisma.tag.update({
    where: { id: communityTag.id },
    data: { usageCount: 4 },
  })
  await prisma.tag.update({
    where: { id: mentorshipTag.id },
    data: { usageCount: 1 },
  })

  console.log(`✓ Linked fragments to tags`)

  // Add reactions
  await prisma.fragmentReaction.createMany({
    data: [
      { fragmentId: fragment1.id, memberId: bob.id, reactionType: 'INSIGHTFUL' },
      { fragmentId: fragment1.id, memberId: carol.id, reactionType: 'LOVE' },
      { fragmentId: fragment2.id, memberId: alice.id, reactionType: 'INSPIRING' },
      { fragmentId: fragment2.id, memberId: carol.id, reactionType: 'LIKE' },
      { fragmentId: fragment2.id, memberId: david.id, reactionType: 'LOVE' },
      { fragmentId: fragment3.id, memberId: alice.id, reactionType: 'INSIGHTFUL' },
      { fragmentId: fragment3.id, memberId: bob.id, reactionType: 'INSPIRING' },
      { fragmentId: fragment4.id, memberId: alice.id, reactionType: 'LOVE' },
      { fragmentId: fragment4.id, memberId: carol.id, reactionType: 'LOVE' },
    ],
  })

  console.log(`✓ Added reactions to fragments`)

  // Add comments
  const comment1 = await prisma.comment.create({
    data: {
      memberId: bob.id,
      fragmentId: fragment1.id,
      content: 'This really resonates with me! My first Hello World moment was just as magical.',
    },
  })

  await prisma.comment.create({
    data: {
      memberId: carol.id,
      fragmentId: fragment1.id,
      parentId: comment1.id,
      content: 'Same here! There's something special about that first moment of creation.',
    },
  })

  await prisma.comment.create({
    data: {
      memberId: alice.id,
      fragmentId: fragment3.id,
      content: 'Thank you for mentoring! Your patience and guidance made all the difference.',
    },
  })

  console.log(`✓ Added comments to fragments`)

  // Create a weaving project
  const project = await prisma.storyWeaveProject.create({
    data: {
      communityId: techCommunity.id,
      createdBy: alice.id,
      title: 'Our Collective Coding Journey',
      descriptionMarkdown: `
A collaborative narrative weaving together the experiences of community members as they learn,
build, and teach in the world of programming. This story celebrates the power of community
support and mutual growth.
      `.trim(),
      status: 'ACTIVE',
      visibility: 'COMMUNITY',
    },
  })

  console.log(`✓ Created weaving project`)

  // Add collaborators
  await prisma.projectCollaborator.createMany({
    data: [
      { projectId: project.id, memberId: bob.id, role: 'EDITOR' },
      { projectId: project.id, memberId: carol.id, role: 'VIEWER' },
    ],
  })

  console.log(`✓ Added project collaborators`)

  // Select fragments for the project
  await prisma.storyFragmentSelection.createMany({
    data: [
      { projectId: project.id, fragmentId: fragment1.id, role: 'CORE' },
      { projectId: project.id, fragmentId: fragment2.id, role: 'CORE' },
      { projectId: project.id, fragmentId: fragment3.id, role: 'SUPPORTING' },
      { fragmentId: fragment4.id, role: 'QUOTE' },
    ],
  })

  console.log(`✓ Selected fragments for project`)

  // Create a woven story version
  await prisma.wovenStoryVersion.create({
    data: {
      projectId: project.id,
      versionNumber: 1,
      generationCost: 0.15,
      bodyMarkdown: `
# Our Collective Coding Journey

## The Beginning

Every developer's journey starts with a single line of code. For Alice, it was "Hello, World!" in Python -
a simple command that sparked a profound transformation. The cursor blinked expectantly, and when she
pressed enter, those words appeared on screen like magic. That moment of creation changed everything.

The path wasn't smooth. Error messages became constant companions, red text filling screens with cryptic
warnings. But with each bug fixed, understanding deepened. The community was there through it all, offering
patience and encouragement when frustration mounted.

## Building Together

Six months into his journey, Bob faced a choice: keep learning in private or share something with the world.
He chose courage over comfort, publishing a simple habit-tracking tool despite his fears. What if people
found bugs? What if no one cared?

Three days later, a stranger opened a pull request. They fixed a bug Bob hadn't noticed and added a feature
he hadn't imagined. That moment revealed a profound truth: open source isn't just about writing code -
it's about building together, across boundaries and time zones, united by shared purpose.

## The Cycle Continues

Carol discovered this truth from another angle. When a beginner asked for help, her first instinct was
refusal - "I'm still learning myself!" But she remembered the patience others had shown her and said yes.

Teaching revealed gaps in her own understanding. Explaining loops and functions forced her to truly grasp
concepts she thought she knew. Both mentor and student grew together. Now mentorship is her favorite part
of community participation, a way to honor those who helped her while nurturing the next generation.

> "Thank you for helping me debug that function. You saved my project!"

David received this message late one evening after spending an hour helping a community member. He didn't
think much of it - just paying forward the help he'd received. But those words of gratitude crystallized
why community matters.

## Together We Rise

This is our story - not of individual heroics but collective growth. We learn together, build together,
and lift each other up, one line of code at a time. Each bug fixed, each pull request merged, each
question answered adds another thread to the tapestry we're weaving together.

The journey continues, with new voices joining the chorus every day. And that's exactly as it should be.

---

*This narrative was woven from the authentic experiences of community members: Alice's first steps,
Bob's open source adventure, Carol's teaching journey, and David's moment of gratitude. Their individual
stories combine to tell a larger truth about the power of learning together.*
      `.trim(),
      aiMetadataJson: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        temperature: 0.7,
        fragmentMapping: {
          [fragment1.id]: { role: 'CORE', sections: ['The Beginning'] },
          [fragment2.id]: { role: 'CORE', sections: ['Building Together'] },
          [fragment3.id]: { role: 'SUPPORTING', sections: ['The Cycle Continues'] },
          [fragment4.id]: { role: 'QUOTE', sections: ['The Cycle Continues'] },
        },
        promptUsed:
          'Weave these story fragments into a cohesive narrative about collective learning and community growth',
        generatedAt: new Date().toISOString(),
        tokensUsed: 1542,
      }),
    },
  })

  // Update project cost
  await prisma.storyWeaveProject.update({
    where: { id: project.id },
    data: { aiGenerationCost: 0.15 },
  })

  console.log(`✓ Created woven story version`)

  // Log activities
  await prisma.activityLog.createMany({
    data: [
      {
        memberId: alice.id,
        action: 'fragment.created',
        entityType: 'fragment',
        entityId: fragment1.id,
        metadata: JSON.stringify({ title: fragment1.title }),
      },
      {
        memberId: bob.id,
        action: 'fragment.created',
        entityType: 'fragment',
        entityId: fragment2.id,
        metadata: JSON.stringify({ title: fragment2.title }),
      },
      {
        memberId: alice.id,
        action: 'project.created',
        entityType: 'project',
        entityId: project.id,
        metadata: JSON.stringify({ title: project.title }),
      },
      {
        memberId: alice.id,
        action: 'story.woven',
        entityType: 'project',
        entityId: project.id,
        metadata: JSON.stringify({ versionNumber: 1, fragmentCount: 4, cost: 0.15 }),
      },
    ],
  })

  console.log(`✓ Logged activities`)

  console.log('\n✅ Database seeded successfully!')
  console.log(`   - ${2} communities`)
  console.log(`   - ${4} members`)
  console.log(`   - ${4} tags`)
  console.log(`   - ${5} story fragments`)
  console.log(`   - ${9} reactions`)
  console.log(`   - ${3} comments`)
  console.log(`   - 1 weaving project`)
  console.log(`   - 2 project collaborators`)
  console.log(`   - 1 woven story version`)
  console.log(`   - ${4} activity logs`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
