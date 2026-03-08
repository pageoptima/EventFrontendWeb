import teaser1Img from "@/assets/images/posts/teaser1.png";
import teaser2Img from "@/assets/images/posts/teaser2.svg";
import teaser3Img from "@/assets/images/posts/teaser3.svg";
import teaser4Img from "@/assets/images/posts/teaser4.png";
import teaser5Img from "@/assets/images/posts/teaser5.svg";
import teaser6Img from "@/assets/images/posts/teaser6.png";
import teaser7Img from "@/assets/images/posts/teaser7.svg";
import teaser8Img from "@/assets/images/posts/teaser8.svg";
import teaser1Video from "@/assets/teasers/teaser1.mp4";
import teaser2Video from "@/assets/teasers/teaser2.mp4";
import { events as eventConfigs } from "@/config/events";

const teaserImages = [
  teaser1Img,
  teaser2Img,
  teaser3Img,
  teaser4Img,
  teaser5Img,
  teaser6Img,
  teaser7Img,
  teaser8Img,
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
const teaserComments = ["312", "198", "274", "143", "92", "217", "186", "128"];
const teaserVideos = [teaser1Video, teaser2Video];
const teaserLocations = eventConfigs.map((event) => ({
  place: event.place,
  startDateTime: event.startDateTime,
}));

export const teasers = teaserImages.map((image, index) => {
  const userId = String(index + 1).padStart(3, "0");
  const location = teaserLocations[index % teaserLocations.length];
  return {
    id: `teaser-${index + 1}`,
    userId: `user-${userId}`,
    image,
    video: teaserVideos[index % teaserVideos.length],
    caption: teaserCaptions[index % teaserCaptions.length],
    views: teaserViews[index % teaserViews.length],
    likes: teaserLikes[index % teaserLikes.length],
    comments: teaserComments[index % teaserComments.length],
    place: location?.place,
    startDateTime: location?.startDateTime,
  };
});
