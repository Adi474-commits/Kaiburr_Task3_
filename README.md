# Kaiburr Task Manager - Frontend

React 19 + TypeScript + Ant Design web UI for the Kaiburr Task API.

# Author

**Adithya N Reddy**  
B.Tech, Amrita School of Engineering, Bengaluru  
Email: adithyasnr@gmail.com


## Features

1) **Full CRUD Operations** - Create, Read, Update, Delete tasks  
2) **Task Search** - Real-time search by task name  
3)  **Command Execution** - Execute tasks and view output  
4)  **Execution History** - View detailed execution logs with timestamps  
5) **Accessible UI** - ARIA labels, keyboard navigation, screen reader support  
6) **Responsive Design** - Works on desktop, tablet, and mobile  
7) **Real-time Updates** - Auto-refresh after operations  
8) **Error Handling** - User-friendly error messages  

## Tech Stack

- **React 19** - Latest React with improved performance
- **TypeScript** - Type-safe development
- **Ant Design 5** - Enterprise-grade UI components
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **Day.js** - Date/time formatting

## Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:30088`

## Installation

```powershell
# Navigate to frontend directory
cd task-frontend

# Install dependencies
npm install
```

## Development

```powershell
# Start development server (http://localhost:3000)
npm run dev
```

The dev server includes proxy configuration to forward `/api` requests to `http://localhost:30088`.

## Build

```powershell
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
task-frontend/
├── src/
│   ├── components/
│   │   ├── TaskForm.tsx          # Create/Edit task form
│   │   ├── TaskList.tsx          # Task table with actions
│   │   └── SearchBar.tsx         # Search functionality
│   ├── services/
│   │   └── taskService.ts        # API client
│   ├── types/
│   │   └── task.ts               # TypeScript interfaces
│   ├── App.tsx                   # Main application
│   ├── main.tsx                  # Entry point
│   └── App.css                   # Styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

## API Integration

The frontend connects to the backend REST API:

- **Base URL:** `http://localhost:30088`
- **Endpoints:**
  - `GET /tasks` - Get all tasks
  - `GET /tasks?id={id}` - Get task by ID
  - `PUT /tasks` - Create/Update task
  - `DELETE /tasks/{id}` - Delete task
  - `GET /tasks/search?name={name}` - Search tasks
  - `PUT /tasks/{id}/execute` - Execute task

## Accessibility Features

-  ARIA labels on all interactive elements
-  Keyboard navigation support
-  Focus indicators for better visibility
-  Screen reader compatible
-  High contrast mode support
-  Reduced motion support

## Usage

### Creating a Task

1. Fill in the "Create New Task" form:
   - **Task Name:** Descriptive name (e.g., "Check System Date")
   - **Owner Name:** Your name
   - **Command:** Select from allowed commands (echo, date, uname, pwd, whoami)
2. Click "Create Task"

### Executing a Task

1. Find the task in the list
2. Click the "Run" button
3. View execution status in the "Status" column
4. Click "View Details" to see complete output

### Searching Tasks

1. Type task name in the search bar
2. Press Enter or click search icon
3. Click "Show All" to return to full list

### Viewing Execution History

1. Click "View Details" (eye icon) on any task
2. See all executions with:
   - Start/End timestamps
   - Duration
   - Exit code
   - Complete output
   - Success/Failure status

## Allowed Commands

For security, only these commands are whitelisted:
- `echo` - Print text
- `date` - Show current date/time
- `uname` - System information
- `pwd` - Present working directory
- `whoami` - Current user

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Environment Variables

Create `.env` file to customize:

```env
VITE_API_BASE_URL=http://localhost:30088
```

## Troubleshooting

### API Connection Error

- Ensure backend is running on `http://localhost:30088`
- Check CORS configuration
- Verify Kubernetes pods are running: `kubectl get pods`

### Build Errors

```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

## Screenshots

<img width="1269" height="682" alt="image" src="https://github.com/user-attachments/assets/40dfdffd-cc17-47e6-a008-cefc54ac5be6" />

<img width="1274" height="430" alt="image" src="https://github.com/user-attachments/assets/56bce946-2cb4-405c-ac4c-1ed9b78d25a0" />
