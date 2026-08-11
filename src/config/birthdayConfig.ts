export interface Milestone {
  month: string;
  title: string;
  date: string;
  image: string;
  description: string;
  icon: string;
  sparkleLevel?: "small" | "large";
  objectPosition?: string;
}


export interface FirstMemory {
  id: string;
  title: string;
  backDescription: string;
  dateText: string;
  icon: string;
  color: string;
}

export interface FavoriteThing {
  category: string;
  name: string;
  icon: string;
  bg: string;
  accent: string;
}

export interface FamilyPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
  rotation: string;
}

export interface HangingPhoto {
  id: string;
  title: string;
  caption: string;
  image: string;
  rotation: string;
}

export const birthdayConfig = {
  babyName: "Y S Hanvika",
  parentsNames: "Suganya & Yogarajan",
  turningAge: 1,
  tagline: "A VERY SPECIAL DAY IS HERE",
  heroSubtitle: "Our Little Sunshine",
  themeTitle: "A Magical First Trip Around the Sun",
  heroDescription: "One year of giggles, cuddles, and endless love.",
  
  event: {
    date: "Wednesday, 14 October 2026",
    isoDate: "2026-10-14T18:00:00",
    time: "6:00 PM onwards",
    cakeCuttingTime: "7:00 PM",
    venueName: "Kalaignar Thirumana Maligai",
    locationAddress: "Cemetry Road, Royapuram, Chennai - 600013 (Opp. R S R M Hospital)",
    themeDressCode: "Pastel Colors",
    themeDescription: "Come dressed in cheerful pastel shades (yellow, peach, sky blue, lavender)",
    googleMapsUrl: "https://maps.app.goo.gl/9RZRQYT8Cgn6QViYA",
    whatsappNumber: "919884948318",
    notificationEmail: "harish02102006@gmail.com",
    web3formsKey: "5c020812-6d1b-41b8-8931-9a3d1440f653",
    sharedAlbumUrl: "https://photos.google.com", // Replace with your Google Drive / Google Photos shared link!
  },



  images: {
    hero: "/images/hero.jpg",
    newborn: "/images/newborn.jpg",
    birthday: "/images/birthday.jpg",
    finalCelebration: "/images/month-12.jpg",
    newbornObjectPosition: "center 20%", // Focus on newborn baby face
    birthdayObjectPosition: "center", // Natural centered focus for 1-year birthday photo
  },



  welcomeMessage: {
    p1: "One year ago, our little sunshine Y S Hanvika came into our lives and made everything brighter. Since then, every smile, every tiny step, and every playful moment has become a beautiful memory for Suganya & Yogarajan.",
    p2: "Come celebrate this wonderful milestone with us as Y S Hanvika turns one!",
  },

  milestones: [
    {
      month: "01",
      title: "Hello, World",
      date: "October 2025",
      image: "/images/month-01.jpg",
      description: "The day our little sunshine arrived and changed our world forever.",
      icon: "baby",
      sparkleLevel: "small",
    },
    {
      month: "02",
      title: "The Sweetest Smile",
      date: "November 2025",
      image: "/images/month-02.jpg",
      description: "That tiny smile became our favorite sight in the whole world.",
      icon: "smile",
      sparkleLevel: "small",
    },
    {
      month: "03",
      title: "Little Giggles",
      date: "December 2025",
      image: "/images/month-03.jpg",
      description: "Our days became brighter with every adorable laugh.",
      icon: "music",
      sparkleLevel: "small",
    },
    {
      month: "04",
      title: "Curious Little Eyes",
      date: "January 2026",
      image: "/images/month-04.jpg",
      description: "Every color, sound, and face became a new discovery.",
      icon: "star",
      sparkleLevel: "small",
    },
    {
      month: "05",
      title: "Reaching for the World",
      date: "February 2026",
      image: "/images/month-05.jpg",
      description: "Tiny hands discovered new toys, textures, and adventures.",
      icon: "heart",
      sparkleLevel: "small",
    },
    {
      month: "06",
      title: "Halfway to One",
      date: "March 2026",
      image: "/images/month-06.jpg",
      description: "Six beautiful months filled with cuddles and unforgettable memories.",
      icon: "cake",
      sparkleLevel: "large",
    },
    {
      month: "07",
      title: "Little Explorer",
      date: "April 2026",
      image: "/images/month-07.jpg",
      description: "Every corner became an exciting place to explore.",
      icon: "compass",
      sparkleLevel: "small",
    },
    {
      month: "08",
      title: "Playtime Adventures",
      date: "May 2026",
      image: "/images/month-08.jpg",
      description: "Favorite toys and happy playtime filled our days.",
      icon: "gift",
      sparkleLevel: "small",
    },
    {
      month: "09",
      title: "Full of Wonder",
      date: "June 2026",
      image: "/images/month-09.jpg",
      description: "Every expression gave us another reason to smile.",
      icon: "camera",
      sparkleLevel: "small",
      objectPosition: "top",
    },

    {
      month: "10",
      title: "Tiny Adventures",
      date: "July 2026",
      image: "/images/month-10.jpg",
      description: "Family outings became beautiful little adventures.",
      icon: "balloon",
      sparkleLevel: "small",
    },
    {
      month: "11",
      title: "Almost One",
      date: "August 2026",
      image: "/images/month-11.jpg",
      description: "Our tiny baby is growing into the happiest little personality.",
      icon: "crown",
      sparkleLevel: "small",
    },
    {
      month: "12",
      title: "One Wonderful Year",
      date: "September 2026",
      image: "/images/month-12.jpg",
      description: "365 days of love, laughter, cuddles, and precious memories.",
      icon: "sparkles",
      sparkleLevel: "large",
    },
  ] as Milestone[],

  firsts: [
    { id: "1", title: "First Smile", backDescription: "The little smile that melted Suganya & Yogarajan's hearts.", dateText: "November 2025", icon: "😊", color: "#f5d6d0" },
    { id: "2", title: "First Laugh", backDescription: "A melody of pure joy that brightened the room.", dateText: "December 2025", icon: "😆", color: "#fff3d1" },
    { id: "3", title: "First Outing", backDescription: "Stepping outside to discover trees and sunshine.", dateText: "January 2026", icon: "🌿", color: "#e2f0d9" },
    { id: "4", title: "First Solid Food", backDescription: "Mashed banana giggles & messy cheeks!", dateText: "February 2026", icon: "🍌", color: "#dbebf2" },
    { id: "5", title: "First Tooth", backDescription: "The tiny little pearly white peeked through.", dateText: "April 2026", icon: "🦷", color: "#f3e5f5" },
    { id: "6", title: "First Word", backDescription: "Said 'Amma' & 'Appa' and filled our hearts with warmth.", dateText: "May 2026", icon: "💬", color: "#fff3e0" },
    { id: "7", title: "First Family Trip", backDescription: "Beach waves, soft sand & tiny footprints.", dateText: "June 2026", icon: "🏖️", color: "#e8f5e9" },
    { id: "8", title: "First Favorite Toy", backDescription: "Her soft teddy bear was never far away.", dateText: "July 2026", icon: "🧸", color: "#fce4ec" },
    { id: "9", title: "First Steps", backDescription: "Wobbly little steps into Amma & Appa's waiting arms!", dateText: "August 2026", icon: "👣", color: "#fff8e1" },
  ] as FirstMemory[],

  favoriteThings: [
    { category: "Favorite Food", name: "Sweet Banana Puree & Porridge", icon: "spoon", bg: "#f5d6d0", accent: "#f3a187" },
    { category: "Favorite Toy", name: "Fluffy Yellow Teddy & Musical Rattle", icon: "teddy", bg: "#fff3d1", accent: "#f5c65d" },
    { category: "Favorite Song", name: "The Wheels on the Bus Go Round and Round 🚌🎶", icon: "music", bg: "#dbebf2", accent: "#b9dde4" },
    { category: "Favorite Activity", name: "Peek-a-boo & Splashy Bath Time", icon: "balloon", bg: "#e2f0d9", accent: "#afc6a4" },
    { category: "Favorite Person", name: "Suganya & Yogarajan (Amma & Appa)", icon: "heart", bg: "#f3e5f5", accent: "#ba68c8" },
  ] as FavoriteThing[],

  familyPhotos: [
    { id: "fam1", title: "My Favorite People", caption: "Surrounded by love every single day", image: "/images/family-01.jpg", rotation: "-2deg" },
    { id: "fam2", title: "Always Surrounded by Love", caption: "Sweet moments with Amma & Appa", image: "/images/family-02.jpg", rotation: "3deg" },
    { id: "fam3", title: "Our Little Family", caption: "Suganya, Yogarajan & Y S Hanvika", image: "/images/family-03.jpg", rotation: "-4deg" },
    { id: "fam4", title: "The Happiest Cuddles", caption: "Laughter, hugs and warm bear cuddles", image: "/images/family-04.jpg", rotation: "2deg" },
  ] as FamilyPhoto[],

  hangingPhotos: [
    { id: "gal1", title: "Our Sweetest Smile", caption: "Her dimples melt our hearts every single time.", image: "/images/gallery-01.jpg", rotation: "-3deg" },
    { id: "gal2", title: "Little Hands, Big Dreams", caption: "Reaching for stars and high fives!", image: "/images/gallery-02.jpg", rotation: "2deg" },
    { id: "gal3", title: "Growing So Beautifully", caption: "Every single day brings a fresh adventure.", image: "/images/gallery-03.jpg", rotation: "-1deg" },
    { id: "gal4", title: "Family Cuddles", caption: "Warmest hugs from Amma & Appa.", image: "/images/gallery-04.jpg", rotation: "4deg" },
    { id: "gal5", title: "Tiny Explorer", caption: "Exploring nature & soft green grass.", image: "/images/gallery-05.jpg", rotation: "-2deg" },
    { id: "gal6", title: "Our Happy Place", caption: "Pure joy in her favorite little outfit.", image: "/images/gallery-06.jpg", rotation: "3deg" },
  ] as HangingPhoto[],
};
