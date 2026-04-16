# Forms Pro (Vercel-Ready Monorepo)

## Deploy Target

Single Vercel project:
- Frontend: Vite build output (`dist`)
- Backend: Vercel Serverless Functions under [api](api)

## Project Structure

- [api](api): serverless API routes
- [lib](lib): shared backend DB/auth/models/middleware
- [src](src): React frontend
- [vercel.json](vercel.json): Vercel routing and build config

## Environment Variables (Vercel)

Set these in Vercel Project Settings -> Environment Variables:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `VITE_API_URL=/api`

You can copy from [.env.example](.env.example).

## Local Run

1. Install dependencies:

```bash
npm install
npm --prefix server install
```

2. Start backend (local Express compatibility server):

```bash
npm --prefix server run dev
```

3. Start frontend:

```bash
npm run dev
```

## Production Build Check

```bash
npm run build
```

## Vercel Deploy

1. Push to GitHub.
2. Import repo in Vercel.
3. Confirm build settings:
   - Build Command: `vite build`
   - Output Directory: `dist`
4. Add environment variables above.
5. Deploy.

## Notes

- API calls use `VITE_API_URL` and should be `/api` in Vercel.
- Refresh token is sent via httpOnly cookie from auth endpoints.
