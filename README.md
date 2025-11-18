# 🧵 Communal Story Weaving Studio

Transform individual voices into powerful collective narratives using AI-powered story weaving.

メンバーの体験談や声を束ねて「共同ストーリー」に仕立てる、AI支援ストーリーウィービングスタジオ。

## Overview

The Communal Story Weaving Studio is a fullstack application that collects personal stories and experiences from community members and uses AI to weave them into cohesive, compelling narratives. Each woven story maintains full traceability back to its source fragments, honoring every contributor's voice while creating something greater than the sum of its parts.

## Features

### 📝 Story Fragment Collection
- Create and manage individual story contributions
- Rich markdown support for formatted content
- Tag-based organization
- Member and community attribution

### 🧵 AI-Powered Story Weaving
- Select fragments and assign roles (Core, Supporting, Quote)
- Generate cohesive narratives using GPT-4
- Multiple versions with full version history
- Complete traceability and attribution

### 🎨 Intuitive Interface
- Browse and manage fragments
- Visual project editor
- Fragment selection with role assignment
- Real-time preview of woven narratives

### 🔍 Full Traceability
- Every woven version links back to source fragments
- AI metadata tracking (model, parameters, fragment mapping)
- Version history and comparison

## Tech Stack

- **Frontend:** Next.js 14 with React and TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM
- **AI:** OpenAI GPT-4 for narrative generation
- **Dev Environment:** Docker Compose for local PostgreSQL

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- Docker and Docker Compose
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd communal-story-weaving-studio
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/dev-setup.sh
   ./scripts/dev-setup.sh
   ```

   This will:
   - Start PostgreSQL in Docker
   - Install npm dependencies
   - Generate Prisma client
   - Run database migrations
   - Seed demo data

3. **Configure your environment**

   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY="sk-your-key-here"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Manual Setup (if script doesn't work)

```bash
# Start PostgreSQL
docker-compose up -d

# Install dependencies
npm install

# Create .env file
cp .env.local.example .env
# Edit .env and add your OPENAI_API_KEY

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start dev server
npm run dev
```

## Usage Guide

### 1. Explore Demo Data

After seeding, you'll have:
- 4 sample story fragments about coding journeys
- 1 demo project "Our Collective Coding Journey"
- 1 pre-generated woven narrative

### 2. Create Story Fragments

1. Navigate to **Fragments** page
2. Click **+ New Fragment**
3. Fill in:
   - Member ID (e.g., `member-alice`)
   - Community ID (e.g., `demo-community`)
   - Title
   - Story content in Markdown
   - Tags (comma-separated)
4. Submit to create the fragment

### 3. Create a Weaving Project

1. Navigate to **Projects** page
2. Click **+ New Project**
3. Provide:
   - Community ID
   - Project title
   - Description (what narrative you want to create)

### 4. Add Fragments to Project

1. Open your project
2. Click **+ Add Fragment**
3. Select fragments and assign roles:
   - **⭐ Core:** Central to the narrative
   - **📚 Supporting:** Add depth and context
   - **💬 Quote:** Use as highlights or pull quotes

### 5. Weave the Story

1. Once you have fragments selected, click **🧵 Weave Story with AI**
2. The AI will analyze your fragments and create a cohesive narrative
3. View the result in the **Woven Versions** tab
4. Generate multiple versions to explore different approaches

### 6. Review and Use

- Read the generated narrative
- View AI metadata to see how fragments were used
- Share or publish the woven story
- Generate new versions as you add more fragments

## Use Cases

### 📖 Community Blogs & Publications
Collect member experiences and weave them into engaging blog posts or newsletter content.

### 📚 Collaborative Books & Anthologies
Gather stories from multiple contributors and create unified chapters or sections.

### 🎥 Documentary Scripts
Transform interview transcripts and personal accounts into compelling narrative scripts.

### 🎓 Educational Case Studies
Combine student experiences or field reports into comprehensive case studies.

### 💼 Organizational Storytelling
Weave employee stories into company culture narratives or impact reports.

### 🌍 Community Impact Reports
Transform individual testimonials into powerful collective impact stories.

### 🎤 Podcast Scripts
Create narrative podcast episodes from community voice recordings and stories.

### 📝 Research Narratives
Synthesize qualitative research data into coherent narrative findings.

## Domain Model

### RawStoryFragment
Individual story contributions from community members.

```typescript
{
  id: string
  memberId: string          // Who contributed this
  communityId: string       // Which community
  title: string
  bodyMarkdown: string      // Story content in Markdown
  tagsJson: string          // Tags as JSON array
  createdAt: DateTime
}
```

### StoryWeaveProject
A project that combines multiple fragments into a narrative.

```typescript
{
  id: string
  communityId: string
  title: string
  descriptionMarkdown: string  // Project goals and theme
  createdAt: DateTime
}
```

### StoryFragmentSelection
Links fragments to projects with assigned roles.

```typescript
{
  id: string
  projectId: string
  fragmentId: string
  role: 'CORE' | 'SUPPORTING' | 'QUOTE'
  createdAt: DateTime
}
```

### WovenStoryVersion
AI-generated narratives with full traceability.

```typescript
{
  id: string
  projectId: string
  versionNumber: number
  bodyMarkdown: string         // The woven narrative
  aiMetadataJson: string       // AI model, params, fragment mapping
  createdAt: DateTime
}
```

## API Reference

### Fragments

- `GET /api/fragments` - List all fragments
- `POST /api/fragments` - Create new fragment
- `GET /api/fragments/:id` - Get fragment details
- `PATCH /api/fragments/:id` - Update fragment
- `DELETE /api/fragments/:id` - Delete fragment

### Projects

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project with fragments and versions
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Project Fragments

- `POST /api/projects/:id/fragments` - Add fragment to project
- `DELETE /api/projects/:id/fragments?fragmentId=:fragmentId` - Remove fragment

### AI Weaving

- `POST /api/projects/:id/ai-weave` - Generate new woven version

## Development Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:seed      # Seed demo data
npm run db:studio    # Open Prisma Studio (database GUI)

# Docker
docker-compose up -d    # Start PostgreSQL
docker-compose down     # Stop PostgreSQL
docker-compose logs -f  # View logs
```

## Environment Variables

Create a `.env` file with:

```env
# Database connection
DATABASE_URL="postgresql://storyweaver:weavingpass@localhost:5432/story_weaving?schema=public"

# OpenAI API key (required)
OPENAI_API_KEY="sk-your-key-here"

# Optional: OpenAI model selection
OPENAI_MODEL="gpt-4-turbo-preview"
```

## Architecture

```
src/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── fragments/           # Fragment CRUD
│   │   └── projects/            # Project management & AI weaving
│   ├── fragments/               # Fragments UI
│   ├── projects/                # Projects UI
│   │   └── [id]/               # Project detail page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/                         # Shared utilities
│   ├── prisma.ts               # Prisma client
│   └── ai-weaver.ts            # AI weaving logic
prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Seed data script
```

## Traceability & Attribution

Every woven story maintains complete traceability:

1. **Fragment Mapping:** AI metadata includes which fragments were used and how
2. **Version History:** All woven versions are preserved with timestamps
3. **Role Attribution:** Each fragment's role (Core/Supporting/Quote) is tracked
4. **Model Transparency:** AI model and parameters are recorded for each generation

This ensures:
- Contributors are properly credited
- The weaving process is transparent
- Stories can be regenerated or modified with confidence
- Audit trails for content sourcing

## Contributing

This is a demonstration project showcasing AI-powered narrative weaving. Feel free to:
- Report issues
- Suggest improvements
- Fork and extend for your use case

## License

MIT License - see LICENSE file for details

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Note:** This application requires an OpenAI API key. API usage will incur costs based on your OpenAI plan. Monitor your usage at [OpenAI Platform](https://platform.openai.com/usage).
