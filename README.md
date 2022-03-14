<p align="center">
    <img src="https://user-images.githubusercontent.com/1246744/154675392-9102309f-d430-467c-86ea-7a418a7568bb.svg" width="25%">
</p>


# YAGO Content

YAGO Content is a CMS.

## Development requirements

- Preferably [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install)
- [Docker](https://www.docker.com/)

## Installing YAGO Content
```bash
composer create-project yago-cms/yago-content myproject
```

## Configure YAGO Content
Go to project directory

```bash
cd myproject
```


Edit `.env` and update the following variables:

```bash
APP_URL=http://myproject.test
DB_DATABASE=myproject
DB_USERNAME=myproject
DB_PASSWORD=myproject
```

Start the docker envirmonment

```bash
./vendor/bin/sail up -d
```

Create first migration and seed database

```bash
./vendor/bin/sail artisan migrate --seed

```

Install dependencies

```bash
npm i
```

Create storage link

```bash
./vendor/bin/sail storage:link
```

Build backend JS & CSS

```bash
npm run dev -w backend
```

## Add a superuser

```bash
./vendor/bin/sail artisan tinker
```

```php
$user = \App\Models\User::factory()->create([
    'name' => 'John Doe',
    'email' => 'john@doe.se',
    'password' => bcrypt('johnspassword'),
]);
$user->assignRole('writer', 'superadmin');
```

## Install a starter template
```bash
./vendor/bin/sail artisan yago:install-template default
```

Install any Node dependencies

```bash
npm i
```

## Install a package
```bash
composer require yago-cms/form
```

Publish (copy) its assets

```bash
./vendor/bin/sail artisan vendor:publish --provider "Yago\Form\PackageServiceProvider" --force
```

Run any migrations

```bash
./vendor/bin/sail artisan migrate
```

Rebuild backend JS

```bash
npm run dev -w backend
```

Available packages:
- yago-cms/form

## Install latest update
```bash
./vendor/bin/sail artisan yago:update
```

## Plesk

Follow these step-by-step instructions to setup deployment to Plesk.

### Add site
- Website & domains
- Add domain
- Blank website
- Temporary domain name
- Webspace settings
- Set username to `customer.domain`
- **Save the generated password for later use**
- Add domain

### Configure document root
- Hosting & DNS
- Hosting settings
- Change document root to `/httpdocs/public`

### Configure SSH
- Hosting & DNS
- Web hosting access
- Set `Access to the server over SSH` to `/bin/bash`

### Configure database
- Dashboard
- Databases
- Add database
- Set database name to `customer.domain`
- Related site `customer.domain`
- Set database username `customer.domain`
- **Save the generated password for later use**

### Deploy to Plesk

Upadate these values in `.env`:

```bash
GITHUB_USERNAME=xxx
GITHUB_PASSWORD=xxx
GITHUB_REPOSITORY=xxx/xxx.git
PLESK_URL=https://xxx
PLESK_SSH=username@host
PLESK_SITE="Site name"
PLESK_DB_HOST=x.x.x.x
PLESK_DB_DATABASE=xxx
PLESK_DB_USERNAME=xxx
PLESK_DB_PASSWORD=xxx
```

Deploy for the first time

```bash
./vendor/bin/envoy run init
```

This above command will erase all the contents on the site, so only do it once.

Redploy
```
./vendor/bin/envoy run deploy
```

The above command will compile and minify all JS and CSS assets locally and copy them to the server. It will also pull the latest git changes from the repository.
