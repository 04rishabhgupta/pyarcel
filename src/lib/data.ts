export interface MenuItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  isUnlimited?: boolean;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

export const PYARCEL_MENU: Category[] = [
  {
    id: "specials",
    name: "Specials",
    items: [
      { 
        id: "all_of_the_above", 
        name: "All of the Above", 
        description: "For someone extra special. Everything on the menu, perfectly packed into one ultimate bundle.", 
        icon: "🌟", 
        price: 69 
      }
    ]
  },
  {
    id: "love",
    name: "Love",
    items: [
      { id: "unlimited_love", name: "Unlimited Love", description: "Freshly packed. No expiry.", icon: "❤️", price: 1, isUnlimited: true },
      { id: "forever_love", name: "Forever Love", description: "Valid forever.", icon: "♾️", price: 1 },
      { id: "extra_love", name: "Extra Love", description: "Because regular wasn't enough.", icon: "💕", price: 1 },
      { id: "tiny_crush", name: "Tiny Crush", description: "Handle with butterflies.", icon: "🦋", price: 1 },
      { id: "i_choose_you", name: '"I Choose You"', description: "Like Pokémon, but romantic.", icon: "💖", price: 1 },
    ]
  },
  {
    id: "hugs",
    name: "Hugs",
    items: [
      { id: "warm_hug", name: "Warm Hug", description: "Best served immediately.", icon: "🫂", price: 1 },
      { id: "tight_hug", name: "Tight Hug", description: "Bone-crushing, in a good way.", icon: "🤗", price: 1 },
      { id: "side_hug", name: "Side Hug", description: "For casual moments.", icon: "🫣", price: 1 },
      { id: "bear_hug", name: "Bear Hug", description: "Warm and fuzzy.", icon: "🐻", price: 1 },
      { id: "long_hug", name: "Long Hug", description: "Don't let go.", icon: "⏳", price: 1 },
    ]
  },
  {
    id: "kisses",
    name: "Kisses",
    items: [
      { id: "cheek_kiss", name: "Cheek Kiss", description: "Sweet and innocent.", icon: "😘", price: 1 },
      { id: "forehead_kiss", name: "Forehead Kiss", description: "Soft. Warm. No delivery charge.", icon: "😚", price: 1 },
      { id: "flying_kiss", name: "Flying Kiss", description: "Airmail delivery.", icon: "🌬️💋", price: 1 },
      { id: "hand_kiss", name: "Hand Kiss", description: "Very royal of you.", icon: "🫱💋", price: 1 },
    ]
  },
  {
    id: "cute",
    name: "Cute",
    items: [
      { id: "blushing_cheeks", name: "Blushing Cheeks", description: "Automatic reaction included.", icon: "😳", price: 1 },
      { id: "nose_boop", name: "Nose Boop", description: "Boop!", icon: "👆", price: 1 },
      { id: "hair_playing", name: "Hair Playing", description: "Guaranteed to put them to sleep.", icon: "💆", price: 1 },
      { id: "pinky_promise", name: "Pinky Promise", description: "Legally binding.", icon: "🤞", price: 1 },
      { id: "matching_dp", name: "Matching DP", description: "Public declaration of cuteness.", icon: "🖼️", price: 1 },
      { id: "stolen_hoodie", name: "Stolen Hoodie", description: "It belongs to me now.", icon: "🧥", price: 1 },
    ]
  },
  {
    id: "comfort",
    name: "Comfort",
    items: [
      { id: "head_on_shoulder", name: "Head on Shoulder", description: "The best resting spot.", icon: "😴", price: 1 },
      { id: "holding_hands", name: "Holding Hands", description: "Perfect fit.", icon: "🤝", price: 1 },
      { id: "fingers_interlacing", name: "Fingers Interlacing", description: "Locked in.", icon: "🔐", price: 1 },
      { id: "shoulder_to_cry_on", name: "Shoulder to Cry On", description: "Always available.", icon: "🥺", price: 1 },
      { id: "virtual_hug", name: "Virtual Hug", description: "WiFi enabled warmth.", icon: "📶🫂", price: 1 },
    ]
  },
  {
    id: "dates",
    name: "Dates",
    items: [
      { id: "chai_date", name: "Chai Date", description: "Ek cup chai and lots of gossip.", icon: "☕", price: 1 },
      { id: "coffee_date", name: "Coffee Date", description: "Caffeine and you.", icon: "🥤", price: 1 },
      { id: "canteen_date", name: "Canteen Date", description: "Maggi and memories.", icon: "🍜", price: 1 },
      { id: "library_date", name: "Library Date", description: "\"Studying\" together.", icon: "📚", price: 1 },
      { id: "movie_night", name: "Movie Night", description: "Popcorn not included.", icon: "🎬", price: 1 },
      { id: "ice_cream_date", name: "Ice Cream Date", description: "Sweet treat.", icon: "🍦", price: 1 },
      { id: "long_walk", name: "Long Walk", description: "Talking about everything.", icon: "🚶", price: 1 },
      { id: "rooftop_talk", name: "Rooftop Talk", description: "Deep 2 AM conversations.", icon: "🌃", price: 1 },
    ]
  },
  {
    id: "care",
    name: "Care",
    items: [
      { id: "good_morning_text", name: "Good Morning Text", description: "First thought of the day.", icon: "🌅", price: 1 },
      { id: "good_night_call", name: "Good Night Call", description: "Last voice you hear.", icon: "📞", price: 1 },
      { id: "reached_home", name: "\"Reached Home?\" Text", description: "Mandatory check-in.", icon: "🏠", price: 1 },
      { id: "study_motivation", name: "Study Motivation", description: "You can do it!", icon: "📖", price: 1 },
      { id: "drink_water", name: "Drink Water Reminder", description: "Stay hydrated.", icon: "💧", price: 1 },
      { id: "sleep_reminder", name: "Sleep Reminder", description: "Go to bed, it's late.", icon: "🛌", price: 1 },
      { id: "have_you_eaten", name: "\"Have You Eaten?\"", description: "Food is important.", icon: "🍛", price: 1 },
    ]
  },
  {
    id: "emotional_support",
    name: "Emotional Support",
    items: [
      { id: "unlimited_patience", name: "Unlimited Patience", description: "I'm listening.", icon: "🧘", price: 1, isUnlimited: true },
      { id: "listening_session", name: "Listening Session", description: "Vent it all out.", icon: "👂", price: 1 },
      { id: "late_night_call", name: "Late Night Call", description: "I'm awake if you need me.", icon: "🌙", price: 1 },
      { id: "moral_support", name: "Moral Support", description: "I'm on your side.", icon: "💪", price: 1 },
      { id: "emergency_hug", name: "Emergency Hug", description: "Deploy immediately.", icon: "🚨", price: 1 },
      { id: "youve_got_this", name: "\"You've Got This\"", description: "I believe in you.", icon: "✨", price: 1 },
    ]
  }
];

export function getMenuItem(id: string): MenuItem | undefined {
  for (const category of PYARCEL_MENU) {
    const item = category.items.find(i => i.id === id);
    if (item) return item;
  }
  return undefined;
}
