import profile1 from "@/assets/images/profiles/profile1.png";
import profile2 from "@/assets/images/profiles/profile2.png";
import profile3 from "@/assets/images/profiles/profile3.png";
import profile4 from "@/assets/images/profiles/profile4.jpg";
import profile5 from "@/assets/images/profiles/profile5.png";
import profile6 from "@/assets/images/profiles/profile6.jpg";
import profile7 from "@/assets/images/profiles/profile7.png";
import profile8 from "@/assets/images/profiles/profile8.png";
import profile9 from "@/assets/images/profiles/profile9.png";
import coverImage1 from "@/assets/images/profiles/coverImage1.svg";
import coverImage2 from "@/assets/images/profiles/coverImage2.svg";
import coverImage3 from "@/assets/images/profiles/coverImage3.svg";
import coverImage4 from "@/assets/images/profiles/coverImage4.svg";
import coverImage5 from "@/assets/images/profiles/coverImage5.svg";
import coverImage6 from "@/assets/images/profiles/coverImage6.svg";
import coverImage7 from "@/assets/images/profiles/coverImage7.svg";
import coverImage8 from "@/assets/images/profiles/coverImage8.svg";
import coverImage9 from "@/assets/images/profiles/coverImage9.svg";

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

const coverImages = [
  coverImage1,
  coverImage2,
  coverImage3,
  coverImage4,
  coverImage5,
  coverImage6,
  coverImage7,
  coverImage8,
  coverImage9,
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

const bios = [
  "Hi, I am Ava Morales. I specialize in planning and executing high-impact corporate events and social experiences.",
  "Rohan here. I curate live music nights, intimate gigs, and citywide cultural experiences.",
  "I am Maya Chen, focused on creative pop-ups, brand activations, and art-forward community events.",
  "Tuhin Maity here. I build people-first events with smooth logistics and memorable on-ground execution.",
  "Hi, I am Zara Ali. I design lifestyle events blending cafe culture, sunset scenes, and social storytelling.",
  "I am Bikash Santra, organizing startup meetups, product sessions, and practical tech networking spaces.",
  "I am Isha Kapoor. I host wellness experiences from fitness runs to mindful community meet-and-greets.",
  "Leo Hart here. I lead photography walks and creator meetups that turn moments into visual stories.",
  "I am Nina Patel, curating book clubs, brunch socials, and cozy community-driven event formats.",
];

const followerCounts = [12800, 9420, 15670, 7340, 11090, 8730, 13210, 6890, 12140];
const followingCounts = [520, 410, 680, 355, 490, 430, 610, 298, 575];

export const profiles = profileImages.map((image, index) => {
  const userId = String(index + 1).padStart(3, "0");
  return {
    id: `user-${userId}`,
    name: displayNames[index % displayNames.length],
    username: `user_id${userId}`,
    image,
    coverImage: coverImages[index % coverImages.length],
    tagline: taglines[index % taglines.length],
    bio: bios[index % bios.length],
    followers: followerCounts[index % followerCounts.length],
    following: followingCounts[index % followingCounts.length],
  };
});
