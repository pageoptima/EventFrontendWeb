import RightSidebar from "@/components/RightSidebar";

function Home() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Home feed placeholder (stories + posts).
        </p>
      </section>
      <RightSidebar />
    </div>
  );
}

export default Home;
