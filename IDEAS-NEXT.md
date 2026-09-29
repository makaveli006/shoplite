Ideas for what to build next

Roughly from easiest to biggest:
3. Auto-reload when a page file is missing after a new version, the gap from your last question
7. Real payments with Stripe: the order becomes paid when Stripe confirms, through a "webhook" (a message Stripe sends to your API)
8. Deploy it: Gunicorn + Nginx/Caddy + HTTPS on a small cloud server, following the checklist from Lesson 16.1
9. Live stock updates on product pages with WebSockets (Django Channels)



4. Deploy it: put ShopLite on a real server with HTTPS, then add the automatic deploy job from your README. This needs a small paid server, about $5–6 a month.

6. Live stock updates: stock numbers change on product pages instantly, without reloading, using WebSockets.
7. Auto-reload after a new version: fixes the rare "page file missing" error after you deploy. It's small, and matters mainly once the site is deployed.