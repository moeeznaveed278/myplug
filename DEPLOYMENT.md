# MyPlug Canada - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables (Required in Vercel)

Add these environment variables in your Vercel project settings:

#### Database
- `DATABASE_URL` - MongoDB connection string (e.g., `mongodb+srv://...`)

#### Authentication (Clerk)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key

#### Payment Processing (Stripe)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (starts with `pk_`)
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret (starts with `whsec_`)

#### Email Service (Resend)
- `RESEND_API_KEY` - Your Resend API key (starts with `re_`)

#### Image Upload (Cloudinary)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret

#### Application URL
- `NEXT_PUBLIC_APP_URL` - Your production URL (e.g., `https://myplug.vercel.app`)

#### Optional (for testing)
- `TEST_EMAIL` - Email address for testing (optional, defaults to `delivered@resend.dev`)

### 2. Stripe Webhook Configuration

1. Go to your Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. Copy the webhook signing secret and add it as `STRIPE_WEBHOOK_SECRET` in Vercel

### 3. Clerk Configuration

1. In Clerk Dashboard, add your production URL to allowed origins
2. Set up admin users:
   - Go to Users → Select User → Metadata → Public Metadata
   - Add: `{"role": "admin"}`

### 4. Database Setup

1. Ensure your MongoDB database is accessible from Vercel
2. Run Prisma migrations if needed:
   ```bash
   npx prisma generate
   ```

### 5. Build Scripts

Vercel will automatically:
- Run `npm install`
- Run `npm run build`
- Deploy the application

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add all environment variables
6. Click "Deploy"

## Post-Deployment

### 1. Verify Environment Variables
- Check that all environment variables are set correctly in Vercel dashboard

### 2. Test Key Features
- [ ] Homepage loads
- [ ] Product pages load
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Stripe payment processing
- [ ] Order confirmation emails are sent
- [ ] Admin panel access works
- [ ] Image uploads work

### 3. SEO Verification
- Visit `https://your-domain.vercel.app/sitemap.xml` to verify sitemap is generated
- Submit sitemap to Google Search Console

### 4. Monitor Logs
- Check Vercel function logs for any errors
- Monitor Stripe webhook deliveries
- Check Resend email delivery status

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `DATABASE_URL` is correct
- Check Prisma schema is valid

### Webhook Not Working
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook endpoint URL in Stripe dashboard
- Review Vercel function logs

### Emails Not Sending
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for delivery status
- Verify email addresses are valid

### Images Not Uploading
- Verify Cloudinary environment variables are set
- Check Cloudinary dashboard for uploads
- Verify image upload widget configuration

## Support

For issues, contact: support@myplug.ca

