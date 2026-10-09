/* =========================================================
   ✏️  THIS IS THE FILE TO EDIT!
   Change the settings, add new drawings, mark things as sold.
   ========================================================= */

const SITE = {
  // Formspree form that emails requests and orders to a grown-up
  formEndpoint: "https://formspree.io/f/xzedrnjo",

  // Which charity the kids are supporting
  charityName: "our chosen charity",
  charityPercent: 25,

  currency: "£",

  // Update these as money comes in 💰
  raisedForCharity: 0,   // total given to charity so far
  charityGoal: 20,       // the target for the charity jar
};

const ARTISTS = {
  poppy: {
    name: "Poppy",
    emoji: "🌸",
    colour: "#ff6fa5",
    bio: "Hi, I'm Poppy! I'm 10 and I love drawing animals, rainbows and anything with LOTS of colour.",
    favourite: "Felt tips and glitter pens",
  },
  joseph: {
    name: "Joseph",
    emoji: "🚀",
    colour: "#3fa7ff",
    bio: "Hi, I'm Joseph! I love drawing rockets, dinosaurs and funny cartoons.",
    favourite: "Pencils and colouring crayons",
  },
};

/*
  Commission price list: things people can ask us to draw specially.
  Change the prices, or add and remove items, here.
*/
const COMMISSIONS = [
  {
    name: "Mini doodle",
    emoji: "✏️",
    description: "A small doodle of anything you like. Perfect for a card or bookmark.",
    price: 1,
  },
  {
    name: "Your name in bubble letters",
    emoji: "🔤",
    description: "Your name (or any word) in big, colourful, decorated letters.",
    price: 2,
  },
  {
    name: "Phrase or slogan",
    emoji: "💬",
    description: "A saying, motto or funny phrase, decorated with doodles.",
    price: 3,
  },
  {
    name: "Pet portrait",
    emoji: "🐶",
    description: "A drawing of your pet. Tell us their name and we'll email you back to ask for a photo.",
    price: 5,
  },
  {
    name: "Custom picture",
    emoji: "🎨",
    description: "A full coloured picture of whatever you can dream up.",
    price: 5,
  },
];

/*
  To add a new drawing:
  1. Take a photo or scan of it and put it in the "images" folder
  2. Copy one of the blocks below and change the details
  3. When something sells, change  sold: false  to  sold: true
*/
const ARTWORKS = [
  {
    title: "Mr Whiskers",
    artist: "poppy",
    image: "images/cat.svg",
    caption: "A very fluffy cat who likes naps in the sunshine.",
    price: 3,
    sold: false,
  },
  {
    title: "Rocket to the Moon",
    artist: "joseph",
    image: "images/rocket.svg",
    caption: "3… 2… 1… BLAST OFF! Next stop: the Moon.",
    price: 4,
    sold: false,
  },
  {
    title: "Rainbow Day",
    artist: "poppy",
    image: "images/rainbow.svg",
    caption: "A happy rainbow to cheer up a rainy day.",
    price: 2,
    sold: false,
  },
  {
    title: "Dino Stomp",
    artist: "joseph",
    image: "images/dino.svg",
    caption: "A friendly T-Rex who only eats broccoli. Probably.",
    price: 4,
    sold: true,
  },
  {
    title: "Be Kind",
    artist: "poppy",
    image: "images/be-kind.svg",
    caption: "A little reminder for your bedroom wall.",
    price: 3,
    sold: false,
  },
  {
    title: "Sunny Smile",
    artist: "joseph",
    image: "images/sun.svg",
    caption: "The sun is always smiling, even behind the clouds.",
    price: 2,
    sold: false,
  },
];
