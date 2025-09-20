type MovieAdProps = {
  remountKey: number;
  videoId: string;
};

export const MovieAd = ( {remountKey, videoId} : MovieAdProps) => {
    return (
        <div className="absolute inset-0">
            <iframe
            key={remountKey}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&controls=0&showinfo=0&iv_load_policy=3&modestbranding=1&loop=1&playlist=${videoId}`}
            title="Advertisement Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full pointer-events-none"
            ></iframe>
        </div>
        )
}