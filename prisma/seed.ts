import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo story fragments
  const fragment1 = await prisma.rawStoryFragment.create({
    data: {
      memberId: 'member-alice',
      communityId: 'demo-community',
      title: 'My Journey Learning to Code',
      bodyMarkdown: `
I still remember my first line of code. It was a simple "Hello, World!" in Python, but it felt magical.
The cursor blinked, waiting for my command, and when I hit enter, the words appeared on the screen.
That moment of creation sparked something in me.

Over the next months, I struggled. Error messages became my constant companion. But each bug I fixed
taught me something new. The community helped me through the tough times, answering my questions
with patience and encouragement.
      `.trim(),
      tagsJson: JSON.stringify(['programming', 'learning', 'journey', 'community']),
    },
  })

  const fragment2 = await prisma.rawStoryFragment.create({
    data: {
      memberId: 'member-bob',
      communityId: 'demo-community',
      title: 'Building My First Open Source Project',
      bodyMarkdown: `
After six months of learning, I decided to build something that could help others. A simple tool for
tracking daily habits. I was terrified to publish it - what if people found bugs? What if no one cared?

But I hit publish anyway. The first contributor opened a pull request three days later. They fixed a
bug I didn't even know existed and added a feature I hadn't thought of. That collaboration taught me
that open source isn't just about code - it's about building together.
      `.trim(),
      tagsJson: JSON.stringify(['open-source', 'collaboration', 'project', 'community']),
    },
  })

  const fragment3 = await prisma.rawStoryFragment.create({
    data: {
      memberId: 'member-carol',
      communityId: 'demo-community',
      title: 'Teaching What I Learned',
      bodyMarkdown: `
A year into my coding journey, a beginner reached out asking for help. I almost said no - I'm still
learning myself! But I remembered how patient others had been with me, so I agreed.

Teaching forced me to truly understand concepts I thought I knew. Explaining loops, variables, and
functions to someone else revealed gaps in my own knowledge. We both grew from the experience.
Now I mentor regularly - it's become my favorite part of being in this community.
      `.trim(),
      tagsJson: JSON.stringify(['teaching', 'mentorship', 'community', 'growth']),
    },
  })

  const fragment4 = await prisma.rawStoryFragment.create({
    data: {
      memberId: 'member-david',
      communityId: 'demo-community',
      title: 'A Simple Thank You',
      bodyMarkdown: `
"Thank you for helping me debug that function. You saved my project!"

That message arrived late one evening. I'd spent an hour helping a community member work through
a tricky issue. I didn't think much of it - just paying forward the help I'd received.

But those simple words of gratitude reminded me why community matters. We're all here, lifting each
other up, one line of code at a time.
      `.trim(),
      tagsJson: JSON.stringify(['gratitude', 'community', 'helping', 'connection']),
    },
  })

  // Create a weaving project
  const project = await prisma.storyWeaveProject.create({
    data: {
      communityId: 'demo-community',
      title: 'Our Collective Coding Journey',
      descriptionMarkdown: `
A collaborative narrative weaving together the experiences of community members as they learn,
build, and teach in the world of programming. This story celebrates the power of community
support and mutual growth.
      `.trim(),
    },
  })

  // Select fragments for the project
  await prisma.storyFragmentSelection.create({
    data: {
      projectId: project.id,
      fragmentId: fragment1.id,
      role: 'CORE',
    },
  })

  await prisma.storyFragmentSelection.create({
    data: {
      projectId: project.id,
      fragmentId: fragment2.id,
      role: 'CORE',
    },
  })

  await prisma.storyFragmentSelection.create({
    data: {
      projectId: project.id,
      fragmentId: fragment3.id,
      role: 'SUPPORTING',
    },
  })

  await prisma.storyFragmentSelection.create({
    data: {
      projectId: project.id,
      fragmentId: fragment4.id,
      role: 'QUOTE',
    },
  })

  // Create a woven story version
  await prisma.wovenStoryVersion.create({
    data: {
      projectId: project.id,
      versionNumber: 1,
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
        promptUsed: 'Weave these story fragments into a cohesive narrative about collective learning and community growth',
        generatedAt: new Date().toISOString(),
      }),
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`   - Created ${4} story fragments`)
  console.log(`   - Created 1 weaving project`)
  console.log(`   - Created 1 woven story version`)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
