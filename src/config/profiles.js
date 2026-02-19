import profile1 from "@/assets/images/profiles/profile1.png";
import profile2 from "@/assets/images/profiles/profile2.png";
import profile3 from "@/assets/images/profiles/profile3.png";
import profile4 from "@/assets/images/profiles/profile4.jpg";
import profile5 from "@/assets/images/profiles/profile5.png";
import profile6 from "@/assets/images/profiles/profile6.jpg";
import profile7 from "@/assets/images/profiles/profile7.png";
import profile8 from "@/assets/images/profiles/profile8.png";
import profile9 from "@/assets/images/profiles/profile9.png";

const profileImages = [
  profile1,
  profile2,
  profile3,
  profile4,
  profile5,
  profile6,
  profile7,
  profile8,
  profile9,
];

const displayNames = [
  "Ava Morales",
  "Rohan Mehta",
  "Maya Chen",
  "Tuhin Maity",
  "Zara Ali",
  "Bikash Santra",
  "Isha Kapoor",
  "Leo Hart",
  "Nina Patel",
];

const taglines = [
  "City events + food finds.",
  "Live music junkie.",
  "Weekend pop-ups & art.",
  "Community builder.",
  "Cafe hops + sunsets.",
  "Tech meetups & talks.",
  "Fitness and fun runs.",
  "Photography walk host.",
  "Book clubs & brunch.",
];

export const profiles = profileImages.map((image, index) => {
  const userId = String(index + 1).padStart(3, "0");
  return {
    id: `user-${userId}`,
    name: displayNames[index % displayNames.length],
    username: `user_id${userId}`,
    image,
    tagline: taglines[index % taglines.length],
  };
});
