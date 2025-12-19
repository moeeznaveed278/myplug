# MyPlug Canada - Quick Deployment Checklist

## ✅ Pre-Deployment Status

- [x] Build test passed successfully
- [x] TypeScript errors fixed
- [x] All "SneakerDrop" references changed to "MyPlug"
- [x] Email template updated with customer info
- [x] SEO metadata configured
- [x] Sitemap generation implemented

## 🚀 Ready to Deploy!

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment - MyPlug rebranding complete"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings

#### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Step 3: Add Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

#### Required Variables:
```
DATABASE_URL=mongodb+srv://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 4: Configure Stripe Webhook

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhooks/stripe`
3. Select events: `checkout.session.completed`
4. Copy webhook secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

### Step 5: Configure Clerk

1. Clerk Dashboard → Configure → Domains
2. Add your Vercel domain
3. Set up admin users (add `{"role": "admin"}` to public metadata)

### Step 6: Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] Products display properly
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Stripe payments process
- [ ] Order confirmation emails sent
- [ ] Admin panel accessible
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Image uploads work

## 📝 Notes

- The build completed successfully with no errors
- All TypeScript types are correct
- SEO is configured for production
- Email templates are ready

## 🆘 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify all environment variables are set
3. Test Stripe webhook in Stripe dashboard
4. Check Resend email delivery status

Contact: support@myplug.ca

