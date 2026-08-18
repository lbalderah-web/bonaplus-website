# Bonaplus Website Management

This file defines the approved operating rules for the Bonaplus website.

## Production

- Website: https://www.bonaplus.com.do/
- Repository: `lbalderah-web/bonaplus-website`
- Production branch: `main`
- Hosting: Vercel

## Brand and company identity

These identity rules are permanent unless the owner explicitly changes them:

- **Bonaplus** is the public-facing product brand and the preferred website/search site name.
- **Industria Plus B&G** is the official company name behind the Bonaplus brand.
- Never rename the Bonaplus product brand to Industria Plus B&G or present Industria Plus B&G as a product brand.
- Keep both identities clearly connected so searches for either `Bonaplus` or `Industria Plus B&G` can lead users to the official Bonaplus website.
- Prefer `WebSite`/site-name signals for **Bonaplus** and `Organization`/publisher/company signals for **Industria Plus B&G**.
- Structured data may explicitly connect Industria Plus B&G to the Bonaplus brand, but should not confuse the public-facing site name.
- The public website is Spanish-only unless the owner explicitly authorizes another language version in the future.

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

## SEO growth priorities

The official site is indexed in Google. Ongoing SEO should prioritize growth rather than treating indexing as unresolved:

- Improve non-branded Dominican wholesale rankings.
- Improve individual product/category search visibility using the approved catalog.
- Maintain and improve local SEO and the association between the Bonaplus brand and Industria Plus B&G.
- Maintain `/mayoristas/` for Spanish wholesale discovery.
- Keep canonical, sitemap, structured-data and internal-link relationships correct.
- Build useful product landing pages when they add genuine search value; use unique copy and never invent specifications or publish prices.
- Improve page speed, Core Web Vitals, accessibility, mobile usability, security and conversion flow.
- Avoid low-value daily code churn; make changes only when they materially improve the site or search visibility.

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
- Check search visibility for `Bonaplus`, `Industria Plus B&G`, priority Dominican wholesale terms and product-category terms.
- Document every material change with a clear Git commit message.
