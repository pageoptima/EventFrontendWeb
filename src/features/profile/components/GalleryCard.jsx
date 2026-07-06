function GalleryCard({ item }) {
  return (
    <article className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-muted">
      <img
        src={item.image}
        alt={item.caption}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 text-white">
        <p className="truncate text-xs font-semibold">{item.caption}</p>
        <p className="mt-1 text-[11px] font-medium text-white/85">
          {item.likes} likes
          {" • "}
          {item.views} views
        </p>
      </div>
    </article>
  );
}

export default GalleryCard;
