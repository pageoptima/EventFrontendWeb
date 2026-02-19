import AppButton from "@/components/common/AppButton";
import heartIcon from "@/assets/icons/heart-red.svg";
import voiceIcon from "@/assets/icons/voice.svg";
import commentIcon from "@/assets/icons/chat-black.svg";
import shareIcon from "@/assets/icons/share.svg";
import bookmarkIcon from "@/assets/icons/bookmark.svg";

function FeedPost({ post }) {
  return (
    <article className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[linear-gradient(135deg,#B839F1_0%,#FF2727_100%)] p-[2px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
              {post.user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {post.user.name}
            </p>
            <p className="text-xs text-muted-foreground">{post.user.handle}</p>
          </div>
        </div>
        <AppButton className="h-8 rounded-full bg-[linear-gradient(90deg,#B839F1_0%,#FF2727_100%)] px-4 text-xs font-semibold text-white shadow-sm hover:opacity-90">
          Follow
        </AppButton>
      </header>
      <div className="px-4 pb-4">
        <div className="overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={post.image}
            alt={`${post.user.name} post`}
            loading="lazy"
            className="h-90 w-full object-cover"
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-sm text-foreground">
          <button
            type="button"
            className="flex items-center gap-2 font-medium"
          >
            <img src={heartIcon} alt="" className="h-5 w-5" />
            <span>{post.likes}</span>
          </button>
          <button type="button" className="flex items-center">
            <img src={voiceIcon} alt="" className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 font-medium"
          >
            <img src={commentIcon} alt="" className="h-5 w-5" />
            <span>{post.comments}</span>
          </button>
          <button type="button" className="flex items-center">
            <img src={shareIcon} alt="" className="h-5 w-5" />
          </button>
          <button type="button" className="ml-auto flex items-center">
            <img src={bookmarkIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeedPost;
