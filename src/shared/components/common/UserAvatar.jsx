const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-9 w-9 text-sm",
};

function UserAvatar({ user, size = "lg" }) {
  const dim = sizes[size];
  return user?.profilePicture ? (
    <img
      src={user.profilePicture}
      alt={user?.name ?? ""}
      className={`${dim} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full bg-brand-gradient font-semibold text-white`}
    >
      {user?.name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export default UserAvatar;
