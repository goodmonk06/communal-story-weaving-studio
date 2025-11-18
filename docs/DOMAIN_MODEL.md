# Domain Model

This document describes the entities, relationships, and core concepts in the Communal Story Weaving Studio.

## Entity Relationship Overview

```
Community (1) ──── (N) Member
    │                    │
    │                    ├─── (N) RawStoryFragment
    │                    ├─── (N) FragmentReaction
    │                    ├─── (N) Comment
    │                    ├─── (N) ProjectCollaborator
    │                    └─── (N) ActivityLog
    │
    ├─── (N) Tag
    ├─── (N) RawStoryFragment
    └─── (N) StoryWeaveProject
              │
              ├─── (N) StoryFragmentSelection ──── (1) RawStoryFragment
              ├─── (N) WovenStoryVersion
              ├─── (N) ProjectCollaborator ──── (1) Member
              └─── (N) Comment

RawStoryFragment (1) ──── (N) FragmentTag ──── (1) Tag
                 │
                 ├─── (N) FragmentReaction ──── (1) Member
                 ├─── (N) Comment ──── (1) Member
                 └─── (N) StoryFragmentSelection

Comment (1) ──── (N) Comment (threaded replies)
```

## Core Entities

### Community

Represents an organization or group that creates and weaves stories.

**Fields:**
- `id`: Unique identifier
- `name`: Display name
- `slug`: URL-friendly identifier
- `description`: Community description
- `settings`: JSON configuration (theme, permissions, limits)
- `avatarUrl`: Community logo/avatar
- `createdAt`, `updatedAt`: Timestamps

**Relationships:**
- Has many Members
- Has many RawStoryFragments
- Has many StoryWeaveProjects
- Has many Tags

**Settings Schema:**
```typescript
{
  allowPublicFragments: boolean
  requireApproval: boolean
  maxFragmentsPerMember: number
  aiProvider: 'openai' | 'anthropic' | 'local'
  theme: 'light' | 'dark'
}
```

### Member

A user within a community who can create fragments, projects, and participate in discussions.

**Fields:**
- `id`: Unique identifier
- `communityId`: Foreign key to Community
- `externalUserId`: Optional external auth system ID
- `username`: Unique within community
- `email`: Optional email address
- `displayName`: Display name
- `bio`: Member biography
- `avatarUrl`: Profile picture
- `preferences`: JSON user preferences
- `status`: ACTIVE | INACTIVE | SUSPENDED
- `createdAt`, `updatedAt`: Timestamps

**Relationships:**
- Belongs to one Community
- Has many RawStoryFragments (authored)
- Has many FragmentReactions
- Has many Comments
- Has many ProjectCollaborator entries
- Has many ActivityLog entries

**Preferences Schema:**
```typescript
{
  emailNotifications: boolean
  digestFrequency: 'daily' | 'weekly' | 'monthly'
  timezone: string
  language: string
}
```

### RawStoryFragment

Individual story contributions from community members.

**Fields:**
- `id`: Unique identifier
- `memberId`: Foreign key to Member (author)
- `communityId`: Foreign key to Community
- `title`: Fragment title
- `bodyMarkdown`: Story content in markdown
- `status`: DRAFT | PUBLISHED | ARCHIVED
- `visibility`: PRIVATE | COMMUNITY | PUBLIC
- `metadata`: JSON extensible metadata
- `editCount`: Number of edits
- `viewCount`: Number of views
- `createdAt`, `updatedAt`: Timestamps
- `lastEditedAt`: Last edit timestamp
- `deletedAt`: Soft delete timestamp

**Relationships:**
- Belongs to one Member
- Belongs to one Community
- Has many StoryFragmentSelections (projects using this fragment)
- Has many FragmentTags
- Has many FragmentReactions
- Has many Comments

**Status Flow:**
```
DRAFT → PUBLISHED → ARCHIVED
  ↓         ↓
DELETED  DELETED
```

**Visibility Levels:**
- `PRIVATE`: Only visible to author
- `COMMUNITY`: Visible to community members
- `PUBLIC`: Visible to everyone

### Tag

Categorization system for fragments.

**Fields:**
- `id`: Unique identifier
- `communityId`: Foreign key to Community
- `name`: Tag display name
- `slug`: URL-friendly identifier
- `description`: Tag description
- `color`: Hex color for UI display
- `usageCount`: Number of fragments using this tag
- `createdAt`: Timestamp

**Relationships:**
- Belongs to one Community
- Has many FragmentTags (fragments with this tag)

### StoryWeaveProject

A project that combines multiple fragments into a woven narrative.

**Fields:**
- `id`: Unique identifier
- `communityId`: Foreign key to Community
- `createdBy`: Member ID of creator
- `title`: Project title
- `descriptionMarkdown`: Project description and goals
- `status`: DRAFT | ACTIVE | ARCHIVED | COMPLETED
- `visibility`: PRIVATE | COMMUNITY | PUBLIC
- `metadata`: JSON extensible metadata
- `aiGenerationCost`: Total AI cost for this project
- `createdAt`, `updatedAt`: Timestamps
- `deletedAt`: Soft delete timestamp

**Relationships:**
- Belongs to one Community
- Has many StoryFragmentSelections (selected fragments)
- Has many WovenStoryVersions (generated narratives)
- Has many ProjectCollaborators
- Has many Comments

**Status Flow:**
```
DRAFT → ACTIVE → COMPLETED
  ↓       ↓          ↓
DELETED ARCHIVED  ARCHIVED
```

### StoryFragmentSelection

Join table linking fragments to projects with assigned roles.

**Fields:**
- `id`: Unique identifier
- `projectId`: Foreign key to StoryWeaveProject
- `fragmentId`: Foreign key to RawStoryFragment
- `role`: CORE | SUPPORTING | QUOTE
- `createdAt`: Timestamp

**Fragment Roles:**
- `CORE`: Central to the narrative, primary storylines
- `SUPPORTING`: Add depth and context
- `QUOTE`: Use as highlights or pull quotes

**Unique Constraint:** (projectId, fragmentId) - each fragment can only be added once per project

### WovenStoryVersion

AI-generated narrative with complete traceability.

**Fields:**
- `id`: Unique identifier
- `projectId`: Foreign key to StoryWeaveProject
- `versionNumber`: Sequential version number
- `bodyMarkdown`: The woven narrative
- `aiMetadataJson`: Complete AI generation metadata
- `generationCost`: Cost of this specific generation
- `createdAt`: Timestamp

**AI Metadata Schema:**
```typescript
{
  model: string                    // e.g., 'gpt-4-turbo-preview'
  temperature: number              // e.g., 0.7
  fragmentMapping: {
    [fragmentId: string]: {
      role: 'CORE' | 'SUPPORTING' | 'QUOTE'
      sections: string[]           // Which sections used this fragment
      usage: string                // How it was incorporated
    }
  }
  promptUsed: string              // The actual prompt sent
  generatedAt: string             // ISO timestamp
  tokensUsed: number              // Total tokens consumed
}
```

**Unique Constraint:** (projectId, versionNumber)

## Engagement & Collaboration Entities

### FragmentReaction

Reactions on story fragments.

**Fields:**
- `id`: Unique identifier
- `fragmentId`: Foreign key to RawStoryFragment
- `memberId`: Foreign key to Member
- `reactionType`: LIKE | LOVE | INSIGHTFUL | INSPIRING
- `createdAt`: Timestamp

**Reaction Types:**
- `LIKE`: General appreciation
- `LOVE`: Strong positive response
- `INSIGHTFUL`: Thought-provoking content
- `INSPIRING`: Motivating and uplifting

**Unique Constraint:** (fragmentId, memberId, reactionType) - one reaction of each type per member per fragment

### ProjectCollaborator

Multi-user collaboration on weaving projects.

**Fields:**
- `id`: Unique identifier
- `projectId`: Foreign key to StoryWeaveProject
- `memberId`: Foreign key to Member
- `role`: VIEWER | EDITOR | ADMIN
- `addedAt`: Timestamp

**Collaborator Roles:**
- `VIEWER`: Can view project and versions
- `EDITOR`: Can add/remove fragments and generate versions
- `ADMIN`: Can modify project, manage collaborators

**Unique Constraint:** (projectId, memberId)

### Comment

Threaded comments on fragments and projects.

**Fields:**
- `id`: Unique identifier
- `memberId`: Foreign key to Member (author)
- `fragmentId`: Optional foreign key to RawStoryFragment
- `projectId`: Optional foreign key to StoryWeaveProject
- `parentId`: Optional foreign key to Comment (for threading)
- `content`: Comment text
- `createdAt`, `updatedAt`: Timestamps
- `deletedAt`: Soft delete timestamp

**Features:**
- Can comment on fragments OR projects (one of fragmentId/projectId must be set)
- Supports threaded replies via parentId
- Soft delete preserves comment trees

## Audit & Activity

### ActivityLog

Audit trail for all major actions in the system.

**Fields:**
- `id`: Unique identifier
- `memberId`: Optional foreign key to Member (null for system actions)
- `action`: Action type (e.g., 'fragment.created', 'project.woven')
- `entityType`: Type of entity affected
- `entityId`: ID of affected entity
- `metadata`: JSON with action details
- `createdAt`: Timestamp

**Common Actions:**
- `fragment.created`
- `fragment.updated`
- `fragment.deleted`
- `project.created`
- `project.updated`
- `story.woven`
- `comment.created`
- `reaction.added`
- `member.joined`
- `collaborator.added`

## Domain Concepts

### Story Weaving Workflow

1. **Collection Phase**
   - Members create RawStoryFragments
   - Fragments are tagged and categorized
   - Community members react and comment

2. **Project Setup**
   - Member creates a StoryWeaveProject
   - Defines project goals and theme
   - Optionally adds collaborators

3. **Fragment Selection**
   - Select relevant fragments from the community
   - Assign roles (CORE, SUPPORTING, QUOTE)
   - Multiple members can collaborate on selection

4. **AI Weaving**
   - System generates narrative from selected fragments
   - Creates a WovenStoryVersion with full traceability
   - Tracks AI costs and metadata

5. **Iteration**
   - Review generated narrative
   - Adjust fragment selection or roles
   - Generate new versions
   - Compare versions

6. **Publication**
   - Mark project as COMPLETED
   - Export woven story
   - Share with community or public

### Traceability

Every woven story maintains complete traceability:

- **Fragment Mapping**: Which fragments were used and how
- **Version History**: All versions preserved with timestamps
- **Role Attribution**: Each fragment's role is tracked
- **Model Transparency**: AI model and parameters recorded
- **Cost Tracking**: Generation costs at project and version level

### Visibility & Permissions

**Fragment Visibility:**
- `PRIVATE`: Author only
- `COMMUNITY`: All community members
- `PUBLIC`: Everyone (if community allows)

**Project Visibility:**
- `PRIVATE`: Creator and collaborators only
- `COMMUNITY`: All community members can view
- `PUBLIC`: Everyone can view

**Collaboration Roles:**
- Project creator has implicit ADMIN role
- Collaborators can be VIEWER, EDITOR, or ADMIN
- Community settings can restrict who can create projects

## Extension Points

The domain model supports future extensions through:

1. **Metadata Fields**: JSON fields on most entities allow adding data without schema changes
2. **Status Enums**: Can be extended with new states
3. **Activity Logging**: Captures all actions for analytics and auditing
4. **Soft Deletes**: Preserve data integrity while allowing "deletion"
5. **External Integration**: `externalUserId` allows linking to external auth systems
