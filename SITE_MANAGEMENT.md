# Bonaplus Website Management

This file defines the approved operating rules for the Bonaplus website.

## Production

- Website: https://www.bonaplus.com.do/
- Repository: `lbalderah-web/bonaplus-website`
- Production branch: `main`
- Hosting: Vercel

## Approved brand and business rules

These rules must be preserved unless the owner explicitly requests a change:

- Use the original Bonaplus logo with its existing blue background.
- Keep the current clean blue, white and green visual direction.
- Main headline: **Calidad que se nota. Confianza que construye.**
- The website targets distributors and wholesale buyers in the Dominican Republic.
- Do not publish product prices.
- Orders and quotations are coordinated through WhatsApp.
- Typical wholesale orders are approximately 400 boxes or more.
- Maintain nationwide distribution messaging.
- Phone: `(809) 379-1396`.
- Email: `industriaplusbyg@gmail.com`.
- Business hours: Monday through Friday, 8:00 a.m. to 6:00 p.m.
- Preserve the current product catalog unless the owner provides a confirmed change.
- Do not publish private warehouse or plant photographs.

## Autonomous maintenance allowed

The website manager may make safe, reversible changes without requesting approval for each one:

- Fix broken links, layout issues and mobile problems.
- Improve accessibility and keyboard navigation.
- Improve page speed and image delivery without visibly lowering quality.
- Improve SEO metadata, structured data, sitemap and robots configuration.
- Improve security headers and safe browser behavior.
- Refactor code without changing approved business behavior.
- Correct grammar, spacing and minor presentation inconsistencies.
- Improve the catalog and WhatsApp order flow without adding public prices.
- Add monitoring, documentation and analytics preparation.
- Restore production after a failed deployment using the last known good version.

## Changes that require owner authorization

Approval is required before:

- Changing the logo, company name, brand colors or main visual identity.
- Publishing prices, discounts or commercial offers.
- Changing the phone number, email, address, hours or company claims.
- Adding online payment processing.
- Collecting sensitive customer information.
- Starting a paid subscription or purchasing a service.
- Transferring the domain or making risky DNS changes.
- Removing products or changing official product specifications.
- Publishing legal claims, certifications or testimonials that have not been verified.

## Maintenance checklist

- Confirm the production deployment is ready.
- Confirm `bonaplus.com.do` returns HTTP 200.
- Confirm SSL, domain and security headers are working.
- Test header navigation and mobile menu.
- Test product selection, quantities, modal and WhatsApp order generation.
- Check phone, email, map and WhatsApp links.
- Check desktop and mobile layouts.
- Check console/runtime errors and failed deployments.
- Check robots.txt, sitemap.xml and canonical metadata.
- Check image loading and page weight.
- Document every material change with a clear Git commit message.
