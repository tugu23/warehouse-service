# Quick Start Guide

This guide will help you get the Warehouse Management System backend up and running in minutes.

## Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] PostgreSQL v14+ installed and running
- [ ] npm or yarn installed
- [ ] Git (if cloning from repository)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including Express, Prisma, TypeScript, and more.

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following values:

```env
# Database Connection
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/warehouse_db?schema=public"

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Important**: Replace `YOUR_USERNAME` and `YOUR_PASSWORD` with your PostgreSQL credentials.

### 3. Create Database

Create a new PostgreSQL database:

```bash
# Using createdb command
createdb warehouse_db

# Or using psql
psql -U postgres
CREATE DATABASE warehouse_db;
\q
```

### 4. Run Database Migrations

Generate Prisma Client and create database tables:

```bash
npm run prisma:generate
npm run prisma:migrate
```

When prompted for a migration name, you can enter: `init`

### 5. Seed the Database (Optional but Recommended)

Populate the database with sample data and default users:

```bash
npm run seed
```

This creates:

- **Admin user**: admin@warehouse.com / admin123
- **Manager user**: manager@warehouse.com / manager123
- **Sales Agent**: agent@warehouse.com / agent123
- Sample products and customer types

### 6. Start the Development Server

```bash
npm run dev
```

You should see output like:

```
Server is running on port 3000 in development mode
Database connected successfully
Health check: http://localhost:3000/health
```

### 7. Test the API

Open your browser or use curl to test the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "success",
  "message": "Server is running",
  "timestamp": "2025-10-25T12:00:00.000Z"
}
```

### 8. Login and Get a Token

Test the login endpoint:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@warehouse.com",
    "password": "admin123"
  }'
```

Save the token from the response - you'll need it for authenticated requests.

## Common Issues and Solutions

### Issue: Database connection error

**Solution**:

- Check if PostgreSQL is running: `pg_isready`
- Verify your DATABASE_URL in `.env`
- Ensure the database exists: `psql -l | grep warehouse_db`

### Issue: Port already in use

**Solution**:

- Change the PORT in `.env` to another value (e.g., 3001)
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

### Issue: Prisma Client not generated

**Solution**:

```bash
npm run prisma:generate
```

### Issue: TypeScript compilation errors

**Solution**:

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install
```

## Development Tools

### Prisma Studio (Database GUI)

View and edit your database with a visual interface:

```bash
npm run prisma:studio
```

Opens at http://localhost:5555

### Build for Production

```bash
npm run build
npm start
```

### View Logs

Logs are stored in the `logs/` directory:

- `logs/error.log` - Error logs only
- `logs/combined.log` - All logs

```bash
# Watch error logs in real-time
tail -f logs/error.log

# View combined logs
tail -f logs/combined.log
```

## Next Steps

1. **Read the API Documentation**: Check `README.md` for complete API endpoint documentation
2. **Test with Postman**: Import the API endpoints and test the full workflow
3. **Customize**: Modify the code to fit your specific requirements
4. **Deploy**: When ready, build for production and deploy to your server

## Getting Help

- Check the main `README.md` for detailed API documentation
- Review the code comments in the `src/` directory
- Check Prisma schema in `prisma/schema.prisma`

## Security Checklist for Production

Before deploying to production:

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Update DATABASE_URL with production credentials
- [ ] Set NODE_ENV=production
- [ ] Configure ALLOWED_ORIGINS with your actual frontend URLs
- [ ] Change default user passwords
- [ ] Set up SSL/TLS for database connection
- [ ] Configure proper CORS settings
- [ ] Set up proper logging and monitoring
- [ ] Enable database backups
- [ ] Review and adjust rate limiting settings

---

**Happy Coding! 🚀**

If you encounter any issues not covered here, please consult the main README.md or contact the development team.
