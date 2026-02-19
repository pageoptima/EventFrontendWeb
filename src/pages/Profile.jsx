import RightSidebar from "../components/RightSidebar";

function Profile() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-muted-foreground">
          Profile page placeholder (bio + grid).
        </p>
      </section>
      <RightSidebar />
    </div>
  );
}

export default Profile;
