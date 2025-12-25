# Premium Green Life Expo Website

**Premium, Professional, High-Conversion Exhibition Platform**

## 🌐 Live Demo

Coming soon after deployment!

## ✨ Features

### Premium Website (8 Pages)
- ✅ **Homepage** - Hero, value proposition, sectors, stats, CTAs
- ✅ **About** - Vision, mission, market gap, regional ambition
- ✅ **Sectors** - 6 curated sectors with market data
- ✅ **Exhibitors** - ROI-focused, zone-based participation
- ✅ **Sponsors** - Executive-level, ESG positioning
- ✅ **Content & Talks** - Expert sessions, thought leadership
- ✅ **Visitors** - Event info, schedule, free registration
- ✅ **Contact** - Professional form, trust signals, map

### Complete Admin Dashboard
- ✅ **Dashboard** - Overview & statistics
- ✅ **Site Settings** - General info, hero, stats, contact
- ✅ **SEO Settings** - Meta tags & Open Graph
- ✅ **Logo & Branding** - Logo & favicon upload
- ✅ **Design & Colors** - Brand color customization
- ✅ **Page Content** - Edit all page content
- ✅ **Packages** - Exhibitor & sponsor packages
- ✅ **FAQs** - Manage questions & answers
- ✅ **Submissions** - View form submissions

## 🎨 Design System

### Premium Color Palette
- **Pure White** (#FFFFFF) - Clean background
- **Deep Natural Green** (#2D5016) - Primary brand
- **Soft Light Green** (#A8D5BA) - Secondary accents
- **Premium Gold** (#C9A961) - Accent highlights
- **Dark Gray** (#262626) - Professional typography

### Key Features
- Premium, clean design
- Sticky navigation with CTAs
- Smooth animations
- Mobile-first responsive
- Professional imagery
- SEO optimized

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/omarfouad01/premium-website.git
cd Premium-website

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the website!

## 📊 Database Setup

The project uses Supabase with separate database tables:

### Tables
- `site_settings_premium_20251225` - Site settings, SEO, branding
- `page_content_premium_20251225` - All page content
- `packages_premium_20251225` - Exhibitor & sponsor packages
- `faqs_premium_20251225` - FAQs
- `contact_submissions_premium_20251225` - Form submissions

### Storage
- `premium_logos` - Logo and favicon uploads

### Setup Steps

1. **Create Supabase Project** at https://supabase.com
2. **Run Migrations** - Execute SQL files in `supabase/migrations/`
3. **Update Environment** - Add your Supabase credentials to `src/integrations/supabase/client.ts`
4. **Create Admin User** - Add user in Supabase Authentication

## 🔐 Admin Access

### Create Admin User

1. Go to your Supabase project
2. Navigate to **Authentication** → **Users**
3. Click **Add User** → **Create new user**
4. Enter email and password
5. Click **Create user**

### Login

Visit `your-domain.com/#/admin/login` and use your credentials.

## 🛠️ Technologies

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend & database
- **React Router** - Navigation
- **Shadcn/ui** - UI components

## 📁 Project Structure

```
premium_website/
├── src/
│   ├── components/          # Reusable components
│   │   ├── PremiumHeader.tsx
│   │   ├── PremiumFooter.tsx
│   │   └── admin/           # Admin components
│   ├── pages/               # Page components
│   │   ├── PremiumIndex.tsx
│   │   ├── PremiumAbout.tsx
│   │   ├── PremiumExhibitors.tsx
│   │   ├── PremiumSponsors.tsx
│   │   ├── PremiumSectors.tsx
│   │   ├── PremiumContent.tsx
│   │   ├── PremiumVisitors.tsx
│   │   ├── PremiumContact.tsx
│   │   └── admin/           # Admin pages
│   ├── integrations/        # Supabase integration
│   ├── contexts/            # React contexts
│   └── lib/                 # Utilities
├── public/                  # Static assets
└── supabase/               # Database migrations
```

## 🎯 Key Pages

### Homepage (`/`)
- Premium hero with event details
- Value proposition (4 benefits)
- Curated sectors (6 sectors)
- Why participate section
- Content preview
- Multiple CTAs

### Exhibitors (`/exhibitors`)
- ROI-focused messaging
- Zone-based participation
- Audience quality metrics
- Early participation benefits
- Business-focused tone

### Sponsors (`/sponsors`)
- Executive-level positioning
- ESG & CSR focus
- 3-tier packages
- Custom opportunities
- Media exposure metrics

## 🎨 Customization

### Update Colors

Edit `src/index.css`:

```css
:root {
  --primary: 95 55% 20%;      /* Deep Natural Green */
  --secondary: 145 35% 75%;   /* Soft Light Green */
  --accent: 43 45% 58%;       /* Premium Gold */
  --background: 0 0% 100%;    /* Pure White */
}
```

### Update Content

Use the admin dashboard at `/#/admin` to update:
- Site settings
- Page content
- SEO metadata
- Logos
- Colors
- Packages
- FAQs

## 📱 Mobile Optimization

- Mobile-first design
- Touch-friendly navigation
- Responsive layouts
- Optimized images
- Fast loading

## 🔍 SEO Features

- Semantic HTML
- Meta tags management
- Open Graph tags
- Proper heading hierarchy
- Alt texts for images
- Clean URLs

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel** - Recommended
- **Netlify**
- **GitHub Pages**
- **Your own hosting**

## 📞 Support

For questions or issues:
- Email: info@greenlifeexpo.com
- GitHub Issues: [Create an issue](https://github.com/omarfouad01/premium-website/issues)

## 📄 License

This project is proprietary and confidential.

## 🎉 Credits

Built with ❤️ for Green Life Expo - Egypt's Leading Go Green & Healthy Living Expo

---

**Transform your exhibition platform with premium design and professional features!**
