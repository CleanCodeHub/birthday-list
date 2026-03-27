# Birthday Party RSVP - Deployment Guide

This guide explains how to deploy the Birthday Party RSVP application on your Apache2 server with MySQL.

## Prerequisites

- Apache2 web server with mod_rewrite enabled
- PHP 7.4 or higher with PDO MySQL extension
- MySQL 5.7 or higher
- SSH access to your server

## Step 1: Prepare the Database

1. Log into your MySQL server:
   ```bash
   mysql -u root -p
   ```

2. Run the database setup script:
   ```bash
   mysql -u root -p < api/database.sql
   ```

   This creates:
   - Database: `birthday_rsvp`
   - Table: `rsvps` (stores guest RSVPs)
   - Table: `admin_users` (stores admin login)
   - Default admin: `admin@birthday.com` / `admin123`

3. **IMPORTANT**: Update the database credentials in `api/config.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'birthday_rsvp');
   define('DB_USER', 'your_mysql_username');
   define('DB_PASS', 'your_mysql_password');
   ```

## Step 2: Build the Frontend

On your local machine or server:

```bash
npm install
npm run build
```

This creates the `dist/` folder with production-ready files.

## Step 3: Deploy to Apache2 Server

1. Copy all files to your web server:
   ```bash
   # Upload the entire project directory
   scp -r dist/* your_user@your_server:/var/www/html/birthday-rsvp/
   scp -r api your_user@your_server:/var/www/html/birthday-rsvp/
   scp .htaccess your_user@your_server:/var/www/html/birthday-rsvp/
   ```

2. Ensure proper permissions:
   ```bash
   ssh your_user@your_server
   cd /var/www/html/birthday-rsvp
   chmod -R 755 .
   chmod 644 api/config.php
   ```

## Step 4: Configure Apache2

1. Enable required modules:
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

2. Ensure your Apache VirtualHost allows .htaccess:
   ```apache
   <Directory /var/www/html/birthday-rsvp>
       AllowOverride All
       Require all granted
   </Directory>
   ```

3. Restart Apache:
   ```bash
   sudo systemctl restart apache2
   ```

## Step 5: Test the Application

1. Visit your website: `http://your-domain.com/birthday-rsvp/`

2. Test guest RSVP submission (should work without login)

3. Access admin mode:
   - Click the cake icon 5 times
   - Login with: `admin@birthday.com` / `admin123`
   - **IMPORTANT**: Change this password immediately!

## Changing Admin Password

To create a new admin or change password:

1. Generate a password hash:
   ```php
   <?php
   echo password_hash('your_new_password', PASSWORD_DEFAULT);
   ?>
   ```

2. Update the database:
   ```sql
   UPDATE admin_users
   SET password_hash = 'your_generated_hash'
   WHERE email = 'admin@birthday.com';
   ```

## File Structure

```
/var/www/html/birthday-rsvp/
├── index.html              # Main app
├── assets/                 # CSS and JS files
├── .htaccess              # Apache rewrite rules
└── api/
    ├── .htaccess          # PHP configuration
    ├── config.php         # Database config
    ├── auth.php           # Admin authentication
    ├── rsvps.php          # RSVP operations
    └── database.sql       # Database schema
```

## Troubleshooting

### API not working
- Check PHP error logs: `tail -f /var/log/apache2/error.log`
- Verify database credentials in `api/config.php`
- Ensure PHP PDO MySQL extension is installed: `php -m | grep pdo_mysql`

### .htaccess not working
- Enable mod_rewrite: `sudo a2enmod rewrite`
- Check AllowOverride in Apache config
- Restart Apache

### Database connection error
- Verify MySQL is running: `sudo systemctl status mysql`
- Check database credentials
- Ensure database and tables exist

## Security Notes

- Change the default admin password immediately
- Keep `api/config.php` outside public_html if possible
- Use HTTPS in production
- Regularly update PHP and MySQL
- Consider IP-based access restrictions for admin

## Support

For issues or questions, check the Apache and PHP error logs first.
