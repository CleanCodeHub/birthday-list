# MySQL Database Setup

This application now uses your MySQL database on the server instead of Supabase.

## Database Setup

1. Import the database schema located in `api/database.sql` into your MySQL server:

```bash
mysql -u root -p < api/database.sql
```

Or if you want to specify the database:

```bash
mysql -u root -p birthday_rsvp < api/database.sql
```

2. Update the database credentials in `api/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'birthday_rsvp');
define('DB_USER', 'root');
define('DB_PASS', '');
```

## Database Schema

The MySQL schema includes:

### Tables:

1. **rsvps** - Stores RSVP submissions
   - `id` - Unique identifier (VARCHAR 36)
   - `name` - Guest name (VARCHAR 255)
   - `attending` - Whether guest is attending (BOOLEAN)
   - `adults` - Number of adults (INT)
   - `kids` - Number of kids (INT)
   - `comment` - Optional comment (TEXT)
   - `created_at` - Timestamp of creation

2. **admin_users** - Admin authentication
   - `id` - Auto-increment ID
   - `email` - Admin email
   - `password_hash` - Hashed password
   - `created_at` - Timestamp

3. **birthday_info** - Birthday person information
   - `id` - Unique identifier (VARCHAR 36)
   - `birthday_person_name` - Name of birthday person
   - `created_at` - Timestamp
   - `updated_at` - Last update timestamp

## Default Admin Account

Email: `admin@birthday.com`
Password: `admin123`

**IMPORTANT: Change this password immediately after first login!**

## API Endpoints

The PHP backend provides these endpoints:

- `GET /api/rsvps.php` - Get all RSVPs
- `POST /api/rsvps.php` - Create new RSVP
- `PUT /api/rsvps.php` - Update RSVP (admin only)
- `DELETE /api/rsvps.php?id={id}` - Delete RSVP (admin only)
- `DELETE /api/rsvps.php?id=all` - Delete all RSVPs (admin only)
- `GET /api/rsvps.php?action=get_birthday_info` - Get birthday person info
- `PATCH /api/rsvps.php` - Update birthday person name (admin only)
- `POST /api/auth.php` - Admin login
- `DELETE /api/auth.php` - Admin logout
- `GET /api/auth.php` - Check session

## Development

For local development with Vite, the proxy is configured in `vite.config.ts` to forward `/api` requests to `http://localhost/api`.

Make sure your PHP server is running on `http://localhost` or update the proxy configuration accordingly.
