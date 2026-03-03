import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Music,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
  Plus,
  Link,
  ExternalLink,
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

export const MusicPanel = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [volume, setVolume] = useState(70);
  const [isConnected, setIsConnected] = useState(false);

  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Lo-Fi Beats to Study To',
      artist: 'Various Artists',
      album: 'Focus Mode',
      duration: '3:24',
      cover: '🎵',
    },
    {
      id: '2',
      title: 'Ambient Nature Sounds',
      artist: 'Nature Records',
      album: 'Relaxation',
      duration: '5:12',
      cover: '🌿',
    },
    {
      id: '3',
      title: 'Classical Piano',
      artist: 'Mozart',
      album: 'Study Classics',
      duration: '4:45',
      cover: '🎹',
    },
    ];

  const connectSpotify = () => {
    // In real app, this would initiate OAuth flow
    setIsConnected(true);
  };

  const connectYouTube = () => {
    // In real app, this would initiate OAuth flow
    setIsConnected(true);
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
          <Music className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Música</h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <Music className="w-10 h-10 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            Conecta tu música
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Reproduce música mientras estudias con Spotify o YouTube Music
          </p>

          <div className="space-y-3 w-full">
            <motion.button
              onClick={connectSpotify}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-xl transition-colors text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Conectar Spotify
            </motion.button>

            <motion.button
              onClick={connectYouTube}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FF0000] hover:bg-[#FF3333] rounded-xl transition-colors text-white font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Conectar YouTube Music
            </motion.button>
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            También puedes reproducir música local o usar mode estudio
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Música</h2>
        </div>
        <button
          onClick={() => setIsConnected(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Desconectar
        </button>
      </div>

      {/* Now Playing */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-3xl">
            {currentTrack?.cover || '🎵'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground truncate">
              {currentTrack?.title || 'Selecciona una canción'}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack?.artist || 'Desde Spotify o YouTube Music'}
            </p>
          </div>
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Heart className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-1/3" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>1:12</span>
            <span>{currentTrack?.duration || '3:45'}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <SkipBack className="w-5 h-5 text-foreground" />
          </button>
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-primary rounded-full"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-foreground" />
            ) : (
              <Play className="w-6 h-6 text-foreground ml-1" />
            )}
          </motion.button>
          <button className="p-2 hover:bg-muted rounded-full transition-colors">
            <SkipForward className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 mt-4">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <input
            type="range"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      {/* Queue */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Cola de reproducción</h3>
        <div className="space-y-2">
          {mockTracks.map((track) => (
            <motion.button
              key={track.id}
              onClick={() => {
                setCurrentTrack(track);
                setIsPlaying(true);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className="text-xl">{track.cover}</span>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {track.title}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {track.artist}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{track.duration}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add to Queue */}
      <div className="p-4 border-t border-border/30">
        <motion.button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Añadir a la cola
        </motion.button>
      </div>
    </div>
  );
};
