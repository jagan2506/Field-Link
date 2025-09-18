# VS Code Supabase Integration Guide

## 1. Install Supabase Extension
- Open VS Code
- Go to Extensions (Ctrl+Shift+X)
- Search "Supabase"
- Install "Supabase" by Supabase

## 2. Install Supabase CLI
```bash
npm install -g supabase
```

## 3. Login to Supabase
```bash
supabase login
```

## 4. Initialize Project
```bash
cd "c:\Users\jagan\Downloads\Rooted Harvest\project"
supabase init
```

## 5. Link to Remote Project
```bash
supabase link --project-ref your-project-id
```

## 6. VS Code Configuration
Create `.vscode/settings.json`:
```json
{
  "supabase.projectRef": "your-project-id",
  "supabase.localDbUrl": "postgresql://postgres:postgres@localhost:54322/postgres"
}
```

## 7. Environment Setup
Create `.env.local`:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## 8. VS Code Features
- **Database Schema**: View tables in sidebar
- **SQL Editor**: Run queries directly
- **Type Generation**: Auto-generate TypeScript types
- **Local Development**: Start local Supabase instance

## 9. Generate Types
```bash
supabase gen types typescript --local > src/types/database.types.ts
```

## 10. Start Local Development
```bash
supabase start
npm run dev
```