# FixIt Booking

A small booking website for local service providers (plumbers, electricians, cleaners, movers, and maintenance techs). Customers pick a service, get a live price estimate, and submit a request no backend, no database, just HTML/CSS/JS and the browser's localStorage.

Built as part of my frontend internship at ProCode Academy.

**Live demo:** _add your deployed link here_
**Video walkthrough:** _add your video link here_

---

## The problem

Small service businesses usually run leads through phone calls and WhatsApp messages, which means:
- Customers don't know roughly what a job will cost before they commit to calling.
- Owners waste time going back and forth just to collect basic details (what, where, when).

FixIt Booking solves the "what will this cost me" question upfront, and turns a visitor into a structured request the business can act on without needing them to call first.

## Who it's for

A one-person or small-team service business that wants a simple page they can send people to instead of "just call us." Not meant to replace a real scheduling system  it's a lead-capture tool.

## What it does

- Browse 6 service categories with starting prices (Plumbing, Electrical, Cleaning, Moving, HVAC, Painting).
- Click a service card or pick one from the form  both stay in sync.
- Get a live price estimate that updates as you change service, priority, distance, or number of rooms/items.
- Fill out contact + appointment details, with validation that catches missing or bad info before it submits.
- On successful submit: see a confirmation screen, and the request gets saved to `localStorage` so it survives a page refresh.
- View, mark as reviewed, or delete saved requests from the "My Requests" section.

## How the price is calculated

```
total = basePrice(service) + priorityFee + distanceFee + roomsFee
```

- **basePrice** — set per service (e.g. Plumbing = $25, Moving = $60).
- **priorityFee** — Standard = $0, Urgent = $15, Emergency = $30.
- **distanceFee** — $1 per km entered.
- **roomsFee** — $10 for every room/item beyond the first.

It's a flat, made-up formula for the demo  a real version would probably factor in technician availability, job complexity, and time of day. I kept it simple on purpose so the calculation logic stays easy to follow and to test.

## Validation rules

| Field | Rule |
|---|---|
| Full name | Required, can't be empty/whitespace |
| Phone | Must contain at least 7 digits |
| Area / address | Required |
| Date | Required, can't be in the past |

Errors show up under the specific field that's wrong, not as a generic alert I wanted it to feel like the form is actually helping you fix things, not just blocking you.

## How data is stored

There's no backend, so everything lives in the browser's `localStorage` under one key (`fixit_requests`), as a JSON array of request objects. That means:

- Data is local to your browser/device it won't sync across devices or show up for the business owner anywhere else.
- Clearing browser storage wipes all saved requests.
- It's meant to simulate what a real database would do, for practice purposes.

## Tech stack

Plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step open `index.html` and it works.

```
/
├── index.html
├── /css
│   └── styles.css
├── /js
│   └── app.js
└── /assets
    └── (icons/images if any)
```

## Known limitations

- No real backend  requests aren't visible to anyone but the person who submitted them, on that browser.
- No payment or SMS/email confirmation.
- No real calendar/technician availability check  any date/time can be picked.
- Pricing formula is illustrative, not based on real market rates.

## What I'd add with more time

- A basic backend (Node/Express + a real database) so requests reach an actual dashboard.
- Email or SMS confirmation on submit.
- An admin view for the business to manage incoming requests instead of the customer-side list.
- Real technician scheduling instead of open time slots.

## What I learned

This was mostly about forms  building real validation instead of relying on `required` alone, keeping calculation logic separate from DOM updates so it's actually testable, and using `localStorage` properly (remembering it only stores strings, so everything has to go through `JSON.stringify`/`JSON.parse`). Event delegation was new to me too  needed it for the "Delete" and "Mark Reviewed" buttons since those rows don't exist until JS renders them.