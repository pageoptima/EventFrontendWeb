import homeIcon from "@/assets/icons/home.svg";
import searchIcon from "@/assets/icons/search.svg";
import teaserIcon from "@/assets/icons/teaser.svg";
import chatIcon from "@/assets/icons/chat-white.svg";
import notificationIcon from "@/assets/icons/notification.svg";
import profileIcon from "@/assets/icons/profile.svg";
import settingsIcon from "@/assets/icons/settings.svg";

export const sidebarMainItems = [
  { label: "Home", to: "/", icon: homeIcon },
  { label: "Search", to: "/search", icon: searchIcon },
  { label: "Teaser", to: "/teaser", icon: teaserIcon },
  { label: "Chats", to: "/chats", icon: chatIcon },
  { label: "Notifications", to: "/notifications", icon: notificationIcon },
  { label: "Profile", to: "/profile", icon: profileIcon },
  { label: "Settings", to: "/settings", icon: settingsIcon },
];
