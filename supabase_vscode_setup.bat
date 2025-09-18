@echo off
echo Installing Supabase CLI and VS Code Extension...

REM Install Supabase CLI
npm install -g supabase

REM Create VS Code settings directory
mkdir .vscode 2>nul

REM Create VS Code settings file
echo {> .vscode\settings.json
echo   "supabase.projectRef": "your-project-id",>> .vscode\settings.json
echo   "supabase.localDbUrl": "postgresql://postgres:postgres@localhost:54322/postgres",>> .vscode\settings.json
echo   "typescript.preferences.includePackageJsonAutoImports": "on",>> .vscode\settings.json
echo   "editor.formatOnSave": true>> .vscode\settings.json
echo }>> .vscode\settings.json

REM Create environment file
echo REACT_APP_SUPABASE_URL=https://your-project.supabase.co> .env.local
echo REACT_APP_SUPABASE_ANON_KEY=your-anon-key>> .env.local

echo Setup complete! 
echo 1. Install Supabase extension in VS Code
echo 2. Run: supabase login
echo 3. Run: supabase init
echo 4. Update .env.local with your credentials
pause