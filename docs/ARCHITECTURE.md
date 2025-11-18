# Architecture

## System Overview

The Communal Story Weaving Studio is built as a modern fullstack application with a clear separation of concerns and extensible architecture.

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
│                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  Fragments │  │  Projects  │  │ Communities │           │
│  │     UI     │  │     UI     │  │     UI      │           │
│  └────────────┘  └────────────┘  └────────────┘           │
└───────────────────────────┬──────────────────────────────────┘
                           │ HTTP/HTTPS
                           │
┌───────────────────────────▼──────────────────────────────────┐
│                      Next.js Application                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  /api/fragments  /api/projects  /api/communities     │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │               Business Logic Layer                    │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Services │  │ Adapters │  │  Events  │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────┬───────────────────────────────────────┘  │
│                 │                                            │
│  ┌──────────────▼───────────────────────────────────────┐  │
│  │             Data Access Layer (Prisma)                │  │
│  └──────────────┬───────────────────────────────────────┘  │
└─────────────────┼────────────────────────────────────────────┘
                  │
┌─────────────────▼────────────────────────────────────────────┐
│                     PostgreSQL Database                       │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│                    External Services                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │  OpenAI  │  │  Redis   │  │ Storage  │  │Analytics │    │
│  │   API    │  │  Cache   │  │  (S3)    │  │ Service  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└───────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. Presentation Layer (UI)

**Location:** `src/app/**/*.tsx`

**Responsibilities:**
- Render user interfaces
- Handle user interactions
- Client-side state management
- Form validation and submission
- Display API data

**Key Components:**
- Fragment pages (`/fragments`, `/fragments/[id]`)
- Project pages (`/projects`, `/projects/[id]`)
- Community pages (future)
- Shared components and layouts

**Tech Stack:**
- React 18
- Next.js 14 App Router
- Tailwind CSS
- React Markdown

### 2. API Layer

**Location:** `src/app/api/**`

**Responsibilities:**
- HTTP request handling
- Input validation (Zod schemas)
- Error handling and formatting
- Response serialization
- Authentication/authorization (future)

**Endpoints:**

```
/api/fragments
  GET    - List fragments
  POST   - Create fragment

/api/fragments/[id]
  GET    - Get fragment details
  PATCH  - Update fragment
  DELETE - Delete fragment

/api/projects
  GET    - List projects
  POST   - Create project

/api/projects/[id]
  GET    - Get project details
  PATCH  - Update project
  DELETE - Delete project

/api/projects/[id]/fragments
  POST   - Add fragment to project
  DELETE - Remove fragment from project

/api/projects/[id]/ai-weave
  POST   - Generate woven story version
```

**Patterns:**
- RESTful design
- Consistent error responses
- Type-safe request/response
- Centralized error handling

### 3. Business Logic Layer

**Location:** `src/lib/**`

**Responsibilities:**
- Core business logic
- Domain rules and validation
- External service integration
- Event emission
- Metrics collection

**Key Modules:**

**Services:**
- Story weaving logic (`ai-weaver.ts`)
- Fragment processing
- Project management
- Community operations

**Adapters:** (`src/lib/adapters/`)
- AI Provider (OpenAI, mock)
- Notifications (email, push)
- Storage (S3, local)
- Analytics (segment, mixpanel)

**Events:** (`src/lib/events/`)
- Domain event bus
- Event types and handlers
- Async event processing

**Utilities:**
- Error handling (`errors.ts`)
- Logging (`logger.ts`)
- Metrics (`metrics.ts`)

### 4. Data Access Layer

**Location:** Prisma Client

**Responsibilities:**
- Database queries and mutations
- Transaction management
- Schema migrations
- Type generation

**Patterns:**
- Repository pattern (via Prisma)
- Query optimization
- Relationship loading
- Connection pooling

## Cross-Cutting Concerns

### Logging

**Implementation:** Pino structured logging

**Levels:**
- `debug`: Detailed diagnostic info
- `info`: General informational messages
- `warn`: Warning messages
- `error`: Error messages with stack traces

**Context:**
- Request IDs (future)
- User IDs (future)
- Action types
- Entity IDs

**Usage:**
```typescript
import { logger, logInfo, logError } from '@/lib/logger'

logInfo('Fragment created', { fragmentId, memberId })
logError(new Error('AI generation failed'), { projectId })
```

### Error Handling

**Implementation:** Centralized error classes and handler

**Error Types:**
- `AppError`: Base error class
- `NotFoundError`: Resource not found (404)
- `ValidationError`: Input validation failed (400)
- `UnauthorizedError`: Authentication required (401)
- `ForbiddenError`: Permission denied (403)
- `ConflictError`: Resource conflict (409)
- `ExternalServiceError`: External API failure (502)

**Usage:**
```typescript
import { NotFoundError, handleError } from '@/lib/errors'

if (!fragment) {
  throw new NotFoundError('Fragment', id)
}

// In API routes
export async function GET(req: NextRequest) {
  try {
    // ... logic
  } catch (error) {
    return handleError(error)
  }
}
```

### Metrics

**Implementation:** In-memory metrics collector

**Metric Types:**
- Counters: Incrementing values (e.g., fragments created)
- Gauges: Point-in-time values (e.g., active users)
- Histograms: Distribution of values (e.g., generation times)

**Usage:**
```typescript
import { incrementCounter, recordTiming } from '@/lib/metrics'

incrementCounter('fragment.created', { status: 'published' })

await recordTiming('ai.generation', async () => {
  return await generateStory()
})
```

### Events

**Implementation:** In-memory event bus

**Event Types:**
- `fragment.created`
- `fragment.updated`
- `project.created`
- `story.woven`
- `comment.created`
- `reaction.added`

**Usage:**
```typescript
import { emitEvent, onEvent } from '@/lib/events'

// Emit event
await emitEvent('fragment.created', {
  fragmentId,
  memberId,
  communityId,
  title,
})

// Handle event
onEvent('fragment.created', async (event) => {
  await sendNotification({
    to: event.payload.memberId,
    message: 'Your fragment was published!',
  })
})
```

## Extension Points

### 1. Adapter Pattern

All external integrations use adapters:

```typescript
interface INotificationAdapter {
  send(payload: NotificationPayload): Promise<void>
}

// Implementation
class EmailNotificationAdapter implements INotificationAdapter {
  async send(payload) {
    // Email-specific logic
  }
}

// Usage
setNotificationAdapter(new EmailNotificationAdapter())
```

### 2. Event System

Decouple features using events:

```typescript
// Publisher
await emitEvent('story.woven', { projectId, cost })

// Subscriber (in a plugin)
onEvent('story.woven', async (event) => {
  await updateAnalytics(event.payload)
  await notifyCollaborators(event.payload)
})
```

### 3. Metadata Fields

Extensible without schema changes:

```typescript
// Store custom data
await prisma.fragment.create({
  data: {
    // ... other fields
    metadata: JSON.stringify({
      customField: 'value',
      externalId: '123',
    }),
  },
})
```

## Data Flow Examples

### Creating a Fragment

```
User Input → UI Form
    ↓
Validation (Client)
    ↓
POST /api/fragments
    ↓
Validation (Zod Schema)
    ↓
Prisma Create
    ↓
Emit fragment.created Event
    ↓
Return Fragment to Client
    ↓
Update UI
```

### Weaving a Story

```
User Clicks "Weave Story"
    ↓
POST /api/projects/:id/ai-weave
    ↓
Fetch Project + Fragments
    ↓
Build AI Prompt
    ↓
Call AI Provider Adapter
    ↓
OpenAI API Request
    ↓
Parse AI Response
    ↓
Create WovenStoryVersion
    ↓
Update Project Cost
    ↓
Emit story.woven Event
    ↓
Return Version to Client
    ↓
Display Woven Narrative
```

## Security Considerations

### Current State
- No authentication (demo/prototype)
- No authorization checks
- No rate limiting
- No input sanitization beyond validation

### Future Enhancements
- JWT-based authentication
- Role-based access control (RBAC)
- Rate limiting middleware
- XSS prevention
- CSRF protection
- SQL injection prevention (Prisma handles this)
- Secure headers
- API key management

## Performance Optimization

### Database
- Indexes on foreign keys
- Indexes on query columns (status, createdAt)
- Connection pooling
- Query optimization

### Caching (Future)
- Redis for session data
- Cache AI responses
- Fragment view counts
- Tag usage statistics

### AI Generation
- Response caching
- Batch processing
- Queue system for long operations
- Cost optimization

## Deployment Architecture

### Development
```
Local Machine
  ├── Next.js Dev Server (port 3000)
  ├── PostgreSQL (Docker, port 5432)
  └── Redis (Docker, port 6379)
```

### Production (Future)
```
Load Balancer
    ↓
Next.js App (Containers)
    ↓
PostgreSQL (Managed Service)
Redis (Managed Service)
S3 (File Storage)
OpenAI API
```

## Testing Strategy

### Unit Tests
- Business logic functions
- Utility functions
- Adapters (with mocks)
- Event handlers

### Integration Tests
- API endpoints
- Database operations
- Full vertical slices

### E2E Tests (Future)
- User workflows
- Critical paths
- UI interactions

## Monitoring & Observability

### Metrics
- Request counts
- Error rates
- AI generation times
- Database query performance

### Logging
- Structured JSON logs
- Log aggregation (future)
- Error tracking
- Audit trails

### Health Checks (Future)
- `/api/health` endpoint
- Database connectivity
- External service status
- Memory/CPU usage

## Scalability Considerations

### Horizontal Scaling
- Stateless Next.js apps
- Session in Redis
- Database read replicas

### Vertical Scaling
- Database optimization
- Connection pooling
- Query caching

### Background Jobs (Future)
- Queue for AI generation
- Batch processing
- Scheduled tasks
- Cleanup jobs
