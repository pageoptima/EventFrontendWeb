import teaser1 from "@/assets/images/posts/teaser1.png";
import teaser2 from "@/assets/images/posts/teaser2.svg";
import teaser3 from "@/assets/images/posts/teaser3.svg";
import teaser4 from "@/assets/images/posts/teaser4.png";
import teaser5 from "@/assets/images/posts/teaser5.svg";
import teaser6 from "@/assets/images/posts/teaser6.png";
import teaser7 from "@/assets/images/posts/teaser7.svg";
import teaser8 from "@/assets/images/posts/teaser8.svg";

const teaserImages = [
  teaser1,
  teaser2,
  teaser3,
  teaser4,
  teaser5,
  teaser6,
  teaser7,
  teaser8,
];

const teaserCaptions = [
  "Sunset pop-up in the city center.",
  "Live acoustic session teaser.",
  "Street food fest highlights.",
  "Weekend art walk preview.",
  "Night run warm-up moments.",
  "Community meetup behind the scenes.",
  "Open mic energy check.",
  "Brunch and books mini reel.",
];

const teaserViews = ["12.3k", "8.9k", "15.1k", "10.4k", "7.8k", "9.6k", "13.7k", "11.2k"];
const teaserLikes = ["1.8k", "1.1k", "2.2k", "1.5k", "980", "1.3k", "2k", "1.7k"];

export const teasers = teaserImages.map((image, index) => {
  const userId = String(index + 1).padStart(3, "0");
  return {
    id: `teaser-${index + 1}`,
    userId: `user-${userId}`,
    image,
    caption: teaserCaptions[index % teaserCaptions.length],
    views: teaserViews[index % teaserViews.length],
    likes: teaserLikes[index % teaserLikes.length],
  };
});
