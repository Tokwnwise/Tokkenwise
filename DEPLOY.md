# How to Deploy Tokkenwise MVP
## Complete Beginner Guide — No Experience Needed

This guide takes you from zero to a live website at tokkenwise.com.
Follow each step in order. Do not skip anything.

---

## What You Will Need

- Your computer (Mac or Windows)
- 1 hour of time
- A credit card (for Supabase — free tier, no charge)
- Your domain: tokkenwise.com (you said you already have this)

---

## PART 1 — Install Tools on Your Computer

### Step 1: Install Node.js

Node.js is the engine that runs your app.

1. Go to https://nodejs.org
2. Click the big green button that says **"LTS"** (the left one)
3. Download and install it
4. When it asks questions during install, just click Next/Continue on everything

**Check it worked:**
- On Mac: Open Terminal (press Cmd+Space, type "terminal", press Enter)
- On Windows: Open Command Prompt (press Windows key, type "cmd", press Enter)

Type this and press Enter:
```
node --version
```

You should see something like `v20.11.0`. If you see a version number, it worked.

---

### Step 2: Install Git

Git is how you send your code to the internet.

- **Mac:** Git is probably already installed. Type `git --version` in Terminal. If you see a version number, skip this step.
- **Windows:** Go to https://git-scm.com/download/win and download + install it. Click Next on everything.

---

### Step 3: Install VS Code (optional but recommended)

This is a text editor for looking at code.

1. Go to https://code.visualstudio.com
2. Download and install it

---

## PART 2 — Set Up Supabase (Your Database + Auth)

Supabase stores your users and their data. It's free.

### Step 4: Create a Supabase account

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with your email or GitHub
4. Verify your email if asked

### Step 5: Create a new project

1. Click **"New project"**
2. Fill in:
   - **Name:** tokkenwise
   - **Database Password:** make a strong password — **write it down somewhere safe**
   - **Region:** pick the one closest to you
3. Click **"Create new project"**
4. Wait about 2 minutes for it to set up (you'll see a loading screen)

### Step 6: Get your Supabase credentials

You need 3 values from Supabase. Here's where to find them:

1. In your Supabase project, click **"Settings"** (gear icon, bottom left)
2. Click **"API"** in the left menu

You'll see a page with keys. Find and copy these — paste them into a notes app for now:

**Value 1 — Project URL:**
Looks like: `https://abcdefghijkl.supabase.co`
Copy the URL under "Project URL"

**Value 2 — Anon key:**
Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)
Copy the key under "anon" "public"

**Value 3 — Service role key:**
Looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (different long key)
Copy the key under "service_role" — **keep this secret, never share it**

**Value 4 — Database URL:**
1. Still in Settings, click **"Database"** in the left menu
2. Scroll down to **"Connection string"**
3. Select **"URI"** tab
4. Copy the string — it looks like:
   `postgresql://postgres:[YOUR-PASSWORD]@db.abcdefgh.supabase.co:5432/postgres`
5. Replace `[YOUR-PASSWORD]` with the password you created in Step 5

---

## PART 3 — Set Up Your Project Files

### Step 7: Unzip and prepare your files

1. Find the `tokkenwise-mvp.zip` file you downloaded
2. Unzip it — you'll get a folder called `mvp`
3. Rename the folder from `mvp` to `tokkenwise`
4. Move it somewhere easy to find, like your Desktop

### Step 8: Create your environment file

This file tells your app your secret credentials.

1. Open the `tokkenwise` folder
2. Find the file called `.env.example`
3. Make a copy of it
4. Rename the copy to `.env.local`

Now open `.env.local` in a text editor (Notepad on Windows, TextEdit on Mac, or VS Code).

Replace the contents with this — filling in YOUR values from Step 6:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key...
DATABASE_URL=postgresql://postgres:YOUR-PASSWORD@db.YOUR-PROJECT.supabase.co:5432/postgres
NEXT_PUBLIC_APP_URL=https://tokkenwise.com
```

Save the file.

---

## PART 4 — Set Up the Database

### Step 9: Open Terminal in your project folder

**On Mac:**
1. Open Terminal
2. Type `cd ` (with a space after cd)
3. Drag your `tokkenwise` folder into the Terminal window
4. Press Enter

**On Windows:**
1. Open the `tokkenwise` folder in File Explorer
2. Click the address bar at the top (where it shows the folder path)
3. Type `cmd` and press Enter
4. A Command Prompt window opens in that folder

### Step 10: Install dependencies

In your terminal, type this and press Enter:
```
npm install
```

You'll see a lot of text scrolling. Wait for it to finish (1-2 minutes). It's done when you see your cursor back.

### Step 11: Create the database tables

Type this and press Enter:
```
npx prisma db push
```

You'll see something like:
```
✓ Generated Prisma Client
✓ Your database is now in sync with your Prisma schema
```

That means your 3 database tables were created in Supabase. ✅

### Step 12: Test it locally (optional but recommended)

Type this and press Enter:
```
npm run dev
```

Open your browser and go to: `http://localhost:3000`

You should see your landing page! If you do, everything is working.

Press `Ctrl+C` in the terminal to stop it when done testing.

---

## PART 5 — Set Up GitHub

GitHub is where your code lives online. Vercel (your hosting) will read from GitHub.

### Step 13: Create a GitHub account

1. Go to https://github.com
2. Click **"Sign up"**
3. Enter your email, create a password, choose a username
4. Verify your email

### Step 14: Create a new repository

1. Once logged into GitHub, click the **"+"** icon in the top right
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** tokkenwise
   - **Description:** AI Cost Intelligence (optional)
   - Select **"Private"** (so your code isn't public)
4. Click **"Create repository"**

### Step 15: Upload your code to GitHub

Back in your terminal (in the tokkenwise folder), run these commands one by one. Press Enter after each one and wait for it to finish:

```
git init
```

```
git add .
```

```
git commit -m "Initial commit"
```

```
git branch -M main
```

Now go back to GitHub. On the page for your new repository, you'll see a section called **"…or push an existing repository from the command line"**. Copy the line that looks like:

```
git remote add origin https://github.com/YOUR-USERNAME/tokkenwise.git
```

Paste it in your terminal and press Enter.

Then run:
```
git push -u origin main
```

It will ask for your GitHub username and password. Enter them.

**If it asks for a password and doesn't accept it:**
GitHub now uses tokens instead of passwords.
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name, select "repo" checkbox, click Generate
4. Copy the token and use it as your password

After this, refresh your GitHub repository page — you should see all your files there. ✅

---

## PART 6 — Deploy on Vercel

Vercel is where your website actually runs. It's free.

### Step 16: Create a Vercel account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** — this connects them automatically
4. Authorise Vercel to access GitHub when asked

### Step 17: Import your project

1. Once logged in to Vercel, click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"tokkenwise"** and click **"Import"**

### Step 18: Configure the project

Vercel will show you a configuration screen.

1. **Framework Preset:** It should auto-detect "Next.js". If not, select it.
2. **Root Directory:** Leave as is (should be `/`)
3. Click **"Environment Variables"** to expand it

Now add your environment variables. Click **"Add"** for each one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | your Supabase URL from Step 6 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key from Step 6 |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key from Step 6 |
| `DATABASE_URL` | your database URL from Step 6 |
| `NEXT_PUBLIC_APP_URL` | https://tokkenwise.com |

4. Click **"Deploy"**

Vercel will now build and deploy your app. This takes 2-3 minutes. You'll see a progress bar.

When it's done you'll see a big **"Congratulations!"** screen with a URL like:
`https://tokkenwise-xyz123.vercel.app`

Click it — your app is live! ✅

---

## PART 7 — Connect Your Domain

### Step 19: Add your domain to Vercel

1. In Vercel, go to your project
2. Click the **"Settings"** tab
3. Click **"Domains"** in the left menu
4. Type `tokkenwise.com` and click **"Add"**
5. Also add `www.tokkenwise.com` and click **"Add"**

Vercel will show you DNS records to add. You'll see something like:

```
Type: A
Name: @
Value: 76.76.21.21
```

and

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

Write these down or keep the page open.

### Step 20: Update your domain DNS

You need to point your domain to Vercel. This is done through wherever you bought `tokkenwise.com`.

**Finding your domain registrar:**
Where did you buy `tokkenwise.com`? Common ones are:
- GoDaddy → go to godaddy.com
- Namecheap → go to namecheap.com
- Google Domains → go to domains.google.com
- Cloudflare → go to cloudflare.com

Log in to wherever you bought it, find your domain, and look for **"DNS Settings"** or **"Manage DNS"** or **"DNS Records"**.

**Delete any existing A records** for `@` (the root domain).

Then **add the records Vercel gave you:**

1. Add an **A record:**
   - Type: A
   - Host/Name: @ (or leave blank)
   - Value/Points to: 76.76.21.21
   - TTL: leave as default

2. Add a **CNAME record:**
   - Type: CNAME
   - Host/Name: www
   - Value/Points to: cname.vercel-dns.com
   - TTL: leave as default

Save the changes.

### Step 21: Wait for DNS to propagate

DNS changes take 5 minutes to 48 hours to work (usually under 30 minutes).

Go back to Vercel → Settings → Domains. When it shows a green checkmark next to your domain, it's working.

**Test it:** Go to `https://tokkenwise.com` in your browser.

Your site is live. ✅

---

## PART 8 — Set Up Auth in Supabase

One last thing — tell Supabase what URLs are allowed to use auth.

### Step 22: Configure Supabase Auth

1. Go back to your Supabase project
2. Click **"Authentication"** in the left menu
3. Click **"URL Configuration"**
4. Set **"Site URL"** to: `https://tokkenwise.com`
5. Under **"Redirect URLs"**, click Add URL and add:
   - `https://tokkenwise.com/dashboard`
   - `https://tokkenwise.com/**`
   - `http://localhost:3000/**` (for local testing)
6. Click **Save**

---

## You're Done! 🎉

Your app is now live at **tokkenwise.com**.

**The full flow works:**
1. Someone visits tokkenwise.com
2. They sign up
3. They paste their OpenAI key
4. They see their spend + waste report in 60 seconds

---

## How to Make Updates Later

Whenever you change something in your code:

```
git add .
git commit -m "describe what you changed"
git push
```

Vercel automatically detects the push and redeploys. Takes about 2 minutes. Your site updates automatically.

---

## If Something Goes Wrong

**App won't start locally:**
Make sure `.env.local` exists and has all 4 values filled in.

**Database error:**
Run `npx prisma db push` again.

**Vercel build fails:**
Go to Vercel → your project → "Deployments" → click the failed deployment → read the error log. Usually it's a missing environment variable.

**Domain not working:**
Wait longer — DNS can take up to 48 hours. Check your DNS records are correct.

**Anything else:**
Email hello@tokkenwise.com from your own address and describe the error.

---

## Quick Reference — All the URLs You Need

| What | URL |
|------|-----|
| Your app | https://tokkenwise.com |
| Vercel dashboard | https://vercel.com/dashboard |
| Supabase dashboard | https://app.supabase.com |
| GitHub repo | https://github.com/YOUR-USERNAME/tokkenwise |
| Local dev | http://localhost:3000 |
