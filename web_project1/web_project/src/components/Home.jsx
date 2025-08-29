import "../styles/Home.css"

function greeting() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) {
    return "Buenos días";
  } else if (hour >= 12 && hour < 20) {
    return"Buenas tardes";
  }
  return "Buenas noches";

}

function Home({ user }) {
  const isAdmin = user?.role === "admin";
  const name = user?.user;

  return (
    <div className="home-container">
      {isAdmin && name && (
        <h1 className="hello">
          {greeting()}, {name}
        </h1>
      )}
      <h2>Long Story Short</h2>
      <p className="text">
        Welcome to Movies, where every film is a new journey waiting to be discovered.
      </p>
    </div>
  );
}

export default Home;