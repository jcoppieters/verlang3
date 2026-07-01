# Email Configuration Setup

## 📧 Email Setup voor verlanglijstje.be

### Development (conf.dev.ts)
De development configuratie is al ingesteld en gebruikt de huidige SMTP settings.

### Production (conf.prod.ts)
Voor productie moet je de volgende stappen doorlopen:

## Stap 1: Email Account Aanmaken bij Combell

1. Log in op je **Combell control panel** (cPanel/Plesk)
2. Ga naar **Email Accounts**
3. Maak een nieuw email account aan: `noreply@verlanglijstje.be`
4. Kies een sterk wachtwoord
5. Noteer de SMTP instellingen (meestal onder "Email Client Setup")

**Typische Combell SMTP Settings:**
- **Host:** `smtp.combell.com` (of `mail.verlanglijstje.be`)
- **Port:** `587` (STARTTLS) of `465` (SSL)
- **Security:** STARTTLS of SSL
- **Username:** `noreply@verlanglijstje.be`
- **Password:** [jouw gekozen wachtwoord]

## Stap 2: Update conf.prod.ts

Open `server/config/conf.prod.ts` en update de SMTP sectie:

```typescript
smtp: {
  host: 'smtp.combell.com',  // Of mail.verlanglijstje.be
  port: 587,                  // Of 465 voor SSL
  secure: false,              // true voor port 465, false voor 587
  user: 'noreply@verlanglijstje.be',
  password: 'JOUW_EMAIL_WACHTWOORD_HIER',
  from: 'noreply@verlanglijstje.be',
  fromName: 'Verlanglijstje.be'
}
```

**Ook verplicht aan te passen:**
```typescript
jwt: {
  secret: 'GENEREER_RANDOM_SECRET',  // Zie stap 3
  expiresIn: '7d'
},

session: {
  secret: 'GENEREER_RANDOM_SECRET'  // Zie stap 3
},

database: {
  host: 'localhost',
  user: 'verlang_user',
  password: 'PRODUCTION_DB_PASSWORD',
  name: 'verlang',
  port: 3306
}
```

## Stap 3: Genereer Random Secrets

Run deze commando's om sterke secrets te genereren:

```bash
# Voor jwt.secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Voor session.secret  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Kopieer de output naar conf.prod.ts.

## Stap 4: DNS Records Instellen (Anti-Spam)

In je Combell DNS admin, voeg deze records toe om spam filters te vermijden:

### SPF Record
Voorkomt dat anderen je domein kunnen spoofen:
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.combell.com ~all
```

### DMARC Record
Email policy:
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:postmaster@verlanglijstje.be
```

### DKIM (Optioneel maar aanbevolen)
Vraag Combell support om DKIM te activeren voor `verlanglijstje.be`. Dit voegt een digitale handtekening toe aan je emails.

## Stap 5: Test Email Configuratie

### Development Test:
```bash
npm run test-email
```

Dit gebruikt de development config (conf.dev.ts).

### Production Test:
```bash
NODE_ENV=production npm run test-email
```

Of test met een specifiek email adres:
```bash
npm run test-email jouw-email@example.com
NODE_ENV=production npm run test-email jouw-email@example.com
```

Het script test:
- ✅ SMTP verbinding
- ✅ Basis email verzending
- ✅ Welcome email template
- ✅ Password reset email template  
- ✅ Share notification email template

### Output Voorbeeld:
```
╔════════════════════════════════════════════════╗
║   📧 Verlanglijstje Email Configuration Test  ║
╚════════════════════════════════════════════════╝

=== Email Configuration ===
Environment: development
SMTP Host: smtp.verlanglijstje.be
SMTP Port: 587
SMTP Secure: false
SMTP User: admin@verlanglijstje.be
From Email: admin@verlanglijstje.be
===========================

✓ Email server ready

📧 Sending test email to johan@coppieters.be...
✓ Email sent to johan@coppieters.be
✅ Test email sent successfully!

👋 Testing welcome email template...
✅ Welcome email sent successfully!

🔑 Testing password reset email template...
✅ Password reset email sent successfully!

🎁 Testing share notification email template...
✅ Share notification email sent successfully!

📊 Test Summary:
✅ All tests passed! (4/4)

🎉 Email configuration is working correctly!
Check your inbox at: johan@coppieters.be
```

## Troubleshooting

### Als emails niet aankomen:

1. ✅ **Check spam folder** - Eerste keer kunnen emails in spam terecht komen
2. ✅ **Verificeer credentials** - Check SMTP user/password in conf.prod.ts
3. ✅ **Port check** - Controleer of port 587/465 open is op je firewall
4. ✅ **Email account exists** - Controleer of noreply@verlanglijstje.be bestaat
5. ✅ **DNS records** - Wacht tot SPF/DMARC records actief zijn (kan 24u duren)
6. ✅ **Server logs** - Check console output voor error details
7. ✅ **Combell logs** - Vraag Combell om SMTP logs te checken

### Test SMTP verbinding handmatig:
```bash
telnet smtp.combell.com 587
# Of
telnet mail.verlanglijstje.be 587
```

### Verificeer DNS records:
```bash
dig TXT verlanglijstje.be
dig TXT _dmarc.verlanglijstje.be
```

## Email Templates

De app gebruikt deze email templates:

1. **Welcome Email** - Verstuurd bij nieuwe account registratie
2. **Password Reset** - Verstuurd bij "Forgot Password" request
3. **Share Notification** - Verstuurd wanneer iemand een lijst deelt

Alle templates zijn te vinden in: `server/utils/email.ts`

## Security Best Practices

✅ Gebruik **noreply@** voor automated emails  
✅ Configureer **SPF/DMARC/DKIM** voor betere deliverability  
✅ Gebruik **sterke passwords** voor email accounts  
✅ **Versleutel** SMTP verbinding (TLS/SSL)  
✅ **Rate limit** email sending om spam te voorkomen (al ingebouwd)  
✅ **Geen secrets** in git committen (conf.prod.ts staat in .gitignore)

## Alternative: Transactional Email Services

Voor grotere betrouwbaarheid kun je ook een service gebruiken:

### SendGrid (100 emails/dag gratis):
```typescript
smtp: {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  user: 'apikey',
  password: '[YOUR_SENDGRID_API_KEY]',
  from: 'noreply@verlanglijstje.be',
  fromName: 'Verlanglijstje.be'
}
```

### Mailgun (5000 emails/maand gratis):
```typescript
smtp: {
  host: 'smtp.eu.mailgun.org',
  port: 587,
  secure: false,
  user: 'postmaster@verlanglijstje.be',
  password: '[YOUR_MAILGUN_PASSWORD]',
  from: 'noreply@verlanglijstje.be',
  fromName: 'Verlanglijstje.be'
}
```

Voordelen:
- Betere deliverability
- Automatische bounce/complaint handling
- Email analytics
- Templates met drag-and-drop editor
