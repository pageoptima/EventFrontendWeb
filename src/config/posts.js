import post1 from "@/assets/images/posts/post1.png";
import post2 from "@/assets/images/posts/post2.png";
import post3 from "@/assets/images/posts/post3.png";
import post4 from "@/assets/images/posts/post4.png";
import post5 from "@/assets/images/posts/post5.png";
import post6 from "@/assets/images/posts/post6.png";
import post7 from "@/assets/images/posts/post7.png";
import post8 from "@/assets/images/posts/post8.png";
import post9 from "@/assets/images/posts/post9.png";
import post10 from "@/assets/images/posts/post10.png";
import post11 from "@/assets/images/posts/post11.png";
import post12 from "@/assets/images/posts/post12.png";
import post13 from "@/assets/images/posts/post13.png";
import post15 from "@/assets/images/posts/post15.png";
import post16 from "@/assets/images/posts/post16.png";

const postImages = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
  post13,
  post15,
  post16,
];

const likeCounts = [
  "20k",
  "14.2k",
  "9.8k",
  "12.4k",
  "7.1k",
  "18.6k",
  "5.9k",
  "21k",
  "10.3k",
  "6.7k",
  "15.4k",
  "8.2k",
  "11.9k",
  "4.8k",
  "13.5k",
];

const commentCounts = [
  "343",
  "210",
  "98",
  "412",
  "76",
  "389",
  "54",
  "468",
  "132",
  "64",
  "203",
  "117",
  "189",
  "51",
  "240",
];

const viewCounts = [
  "52k",
  "38.4k",
  "27.9k",
  "44.1k",
  "19.6k",
  "61.2k",
  "15.3k",
  "72.8k",
  "33.7k",
  "22.5k",
  "48.9k",
  "29.4k",
  "36.1k",
  "14.8k",
  "41.6k",
];

export const feedPosts = postImages.map((image, index) => {
  const userId = String(index + 1).padStart(3, "0");
  return {
    id: `post-${index + 1}`,
    image,
    user: {
      name: `user_id${userId}`,
      handle: `@user_id${userId}`,
    },
    likes: likeCounts[index % likeCounts.length],
    comments: commentCounts[index % commentCounts.length],
    views: viewCounts[index % viewCounts.length],
  };
});
