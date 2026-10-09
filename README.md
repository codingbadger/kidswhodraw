# 🖍️ Kids Who Draw

A website for Poppy & Joseph's drawings. 25% of every sale goes to charity.

It's a plain static site (HTML, CSS and JavaScript). There's no server, database or build step.

## Before you go live (5 minutes)

Open **`js/artworks.js`** and change:

- `charityName`: the charity the kids pick.
- `charityGoal`: the target for the charity jar.

## Adding a new drawing

1. Photograph or scan the drawing. Square photos look best. Save it in `images/`, e.g. `images/unicorn.jpg`.
2. In `js/artworks.js`, copy one of the blocks in `ARTWORKS` and edit it:

   ```js
   {
     title: "Sparkle the Unicorn",
     artist: "poppy",            // "poppy" or "joseph"
     image: "images/unicorn.jpg",
     caption: "She runs on rainbows.",
     price: 3,
     sold: false,
   },
   ```

3. When it sells, change `sold: false` to `sold: true`. It stays in the gallery with a SOLD! stamp.
4. When money goes to charity, update `raisedForCharity`. The jar fills up.

You can delete the six placeholder drawings (`images/*.svg`) once the real ones are in.

## Commission prices

The "Draw Me Something!" price list is the `COMMISSIONS` list in `js/artworks.js`. Change prices,
descriptions or emojis, or add and remove items. The form's "What would you like?" dropdown updates automatically.

## How requests work

The request form sends to [Formspree](https://formspree.io) (`formEndpoint` in `js/artworks.js`),
which emails each request to the address on the Formspree account. Each request includes the
person's name, email, what they want, who should draw it and their message. Hit *Reply* in your
inbox to answer them; Formspree sets the reply-to to their email.

The "I want it!" and "Ask for this" buttons fill in the form for the visitor.
Payment is sorted out by email, so no card details ever touch the site.

The form has a hidden spam trap (`_gotcha`), and Formspree also filters spam.

## Putting it online (free)

- **Netlify Drop**: drag this folder onto https://app.netlify.com/drop. Easiest option.
- **GitHub Pages**: push to a GitHub repo and enable Pages in the repo settings.
- **Cloudflare Pages**: also free and works the same way.

To preview locally, just open `index.html` in a browser.

## Keeping it kid-safe

- Use first names only. Don't add surnames, school, town or photos of the kids.
- Keep the contact email a grown-up's.
- Don't share personal details in replies until a grown-up has checked the request.
