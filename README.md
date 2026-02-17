# Work Order Forms - Distributed Svelte Application

A MAANG/enterprise-grade distributed Svelte application for work order form submissions with dynamic organization customization, real-time analytics, and template management.

## Features

### 🏗️ Architecture & Deployment
- **Single Svelte app** with dynamic subdomain routing
- **Vite + Bun** build system for optimal performance
- **Vercel deployment** with automatic subdomain handling
- **Environment-based isolation** using org_code validation

### 🎨 Customization & Branding
- **Dynamic theming** with organization-specific colors and logos
- **6 field types**: text, email, phone, textarea, select, checkbox
- **Flexible layouts** with 1-4 column grid support
- **Real-time preview** in admin interface

### 📊 Analytics & Templates
- **Comprehensive analytics**: views, submissions, conversion rates, field interactions
- **Template system**: Global, industry, and custom templates
- **Session tracking** with user behavior analysis
- **Performance monitoring** and optimization

### 🔒 Security & Reliability
- **6-digit org code** validation for secure access
- **Row Level Security** (RLS) in Supabase
- **Auto-save functionality** with localStorage persistence
- **Input validation** with Zod schemas

## Tech Stack

- **Frontend**: Svelte 5.51.2 + SvelteKit 2.52.0
- **Build Tool**: Vite 7.3.1
- **Package Manager**: Bun 1.2.19
- **Styling**: TailwindCSS 4.1.18
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod 4.3.6
- **Icons**: Lucide Svelte 0.564.0
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.2+
- Supabase project
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd form-app
bun install
```

2. **Environment setup**:
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

3. **Run development server**:
```bash
bun run dev
```

4. **Build for production**:
```bash
bun run build
```

## Project Structure

```
form-app/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── fields/          # Dynamic field components
│   │   │   └── DynamicForm.svelte  # Main form renderer
│   │   ├── stores.ts           # Form state management
│   │   ├── supabase.ts        # Database client
│   │   ├── types.ts            # TypeScript definitions
│   │   └── utils.ts            # Utility functions
│   ├── routes/
│   │   ├── [orgCode]/+page.svelte    # Dynamic form pages
│   │   └── api/submit/+server.ts      # Form submission endpoint
│   └── app.html
├── static/
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tailwind.config.js
└── vercel.json
```

## Database Schema

### Core Tables

#### `org_custom_forms`
- Organization form configurations
- Custom branding and theming
- Field definitions and layouts

#### `form_templates`
- Reusable form templates
- Global, industry, and custom categories
- Template management system

#### `form_analytics`
- Form interaction tracking
- Submission metrics
- Performance analytics

#### `form_field_analytics`
- Field-level interaction data
- Usage statistics
- Validation error tracking

#### `form_sessions`
- User session management
- Completion tracking
- Browser analytics

## API Endpoints

### `POST /api/submit`
Form submission endpoint with validation and analytics tracking.

**Request Body**:
```typescript
{
  form_id: string;
  org_code: string;
  data: Record<string, any>;
  session_id?: string;
  user_agent?: string;
  referrer?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  message?: string;
  data?: {
    submission_id: string;
    org_id: string;
    form_id: string;
    submitted_at: string;
  };
}
```

## Field Types

### Text Fields
- **Types**: text, email, phone
- **Validation**: Required, min/max length, patterns
- **Features**: Auto-formatting, error handling

### Textarea Fields
- **Features**: Character counting, auto-resize
- **Validation**: Min/max length limits
- **UI**: Character limit indicators

### Select Fields
- **Features**: Custom options, placeholder text
- **Validation**: Required selection
- **UI**: Dropdown with search (future)

### Checkbox Fields
- **Features**: Boolean values, custom labels
- **Validation**: Required checkboxes
- **UI**: Accessible toggle switches

## Analytics Features

### Form-Level Analytics
- **Views**: Total form views
- **Submissions**: Successful submissions
- **Conversion Rate**: Views to submissions ratio
- **Abandonment**: Uncompleted sessions

### Field-Level Analytics
- **Interactions**: Focus, blur, change events
- **Validation Errors**: Field-specific errors
- **Usage Patterns**: Most/least used fields

### Session Analytics
- **Duration**: Time spent on form
- **Browser Info**: Device and browser data
- **Completion**: Form completion rates

## Deployment

### Vercel Configuration

1. **Connect Repository**:
   - Link your Git repository to Vercel
   - Configure build settings

2. **Environment Variables**:
   ```
   PUBLIC_SUPABASE_URL=your-project.supabase.co
   PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Domain Setup**:
   - Configure wildcard subdomain: `*.forms.yourcompany.com`
   - Set up DNS records

4. **Deploy**:
   ```bash
   vercel --prod
   ```

## Security Features

### Authentication
- **6-digit org codes** for form access
- **Row Level Security** (RLS) policies
- **CORS restrictions** and headers

### Validation
- **Zod schemas** for input validation
- **Server-side validation** on all submissions
- **XSS protection** and sanitization

### Privacy
- **No personal data** stored unnecessarily
- **GDPR compliant** data handling
- **Secure headers** and CSP policies

## Performance Optimization

### Frontend
- **Code splitting** by routes
- **Lazy loading** of field components
- **Optimized images** and assets
- **Service worker** for caching (future)

### Backend
- **Database indexes** for fast queries
- **Connection pooling** in Supabase
- **Edge functions** for global distribution
- **CDN caching** for static assets

## Monitoring & Debugging

### Error Handling
- **Comprehensive error logging**
- **User-friendly error messages**
- **Fallback UI components**
- **Performance monitoring**

### Analytics Dashboard
- **Real-time metrics**
- **Conversion funnels**
- **Field performance**
- **User behavior insights**

## Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- **Documentation**: Check the project wiki
- **Issues**: Create a GitHub issue
- **Discussions**: Start a GitHub discussion

---

**Built with ❤️ by Work Smart Management**
