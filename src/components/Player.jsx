function Player({ movie }) {
  if (!movie) {
    return <p className="p-6 text-center">Choisissez un film pour le lire</p>;
  }

  return (
    <iframe
      className="w-full aspect-video"
      key={movie.id}
      src={`https://www.youtube.com/embed/${movie.youtubeID}`}
      title={movie.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}
export default Player;
