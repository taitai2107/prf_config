import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Music, X, List, AlertCircle, RefreshCw
} from 'lucide-react';
import { useMusicPlayer, Track } from '../hooks/useMusicPlayer';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

// 👇 helper: build URL tĩnh theo BASE_URL của Vite (hỗ trợ deploy dưới subpath)
const BASE = import.meta.env.BASE_URL || '/';
const staticUrl = (p: string) => `${BASE}${p.replace(/^\/+/, '')}`;

export function MusicPlayer({ isOpen, onClose, isDark }: MusicPlayerProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playlistError, setPlaylistError] = useState<string | null>(null);

  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setTrack,
    toggleMute,
    changeVolume,
    audioRef,
  } = useMusicPlayer(tracks, { loop: true });

  // Load playlist
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const response = await fetch(staticUrl('music/playlist.json'));
        if (!response.ok) throw new Error(`HTTP ${response.status}: Không thể tải playlist`);

        const raw = await response.json();
        const normalized: Track[] = (raw.tracks || []).map((t: any, i: number) => ({
          id: t.id ?? `t${i + 1}`,
          title: t.title ?? `Track ${i + 1}`,
          artist: t.artist ?? 'Unknown',
          file: t.file,                   // có thể là URL Cloudinary hoặc tên file
          duration: Number(t.duration) || 0,
        }));

        if (normalized.length === 0) throw new Error('Playlist trống');

        setTracks(normalized);
        setPlaylistError(null);
      } catch (err) {
        setPlaylistError(err instanceof Error ? err.message : 'Lỗi không xác định');
      }
    };

    if (isOpen) loadPlaylist();
  }, [isOpen]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeVolume(parseFloat(e.target.value));
  };

  const reloadPlaylist = () => {
    setPlaylistError(null);
    setTracks([]);
    (async () => {
      try {
        const response = await fetch(staticUrl(`music/playlist.json?t=${Date.now()}`));
        const raw = await response.json();
        setTracks((raw.tracks || []) as Track[]);
      } catch (err) {
        setPlaylistError(err instanceof Error ? err.message : 'Lỗi tải playlist');
      }
    })();
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* audio luôn tồn tại ngay cả khi đóng modal */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative p-6 rounded-2xl backdrop-blur-md border max-w-sm w-full max-h-[80vh] overflow-y-auto ${
                isDark ? 'bg-slate-800/95 border-white/20' : 'bg-white/95 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Music className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>Trình phát nhạc</h2>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors ${
                    isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-black/10 text-slate-600'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {(playlistError || error) && (
                <div className={`p-4 rounded-xl mb-4 border ${
                  isDark ? 'bg-red-500/10 border-red-500/30 text-red-400'
                         : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">Lỗi</span>
                  </div>
                  <p className="text-xs mb-3">{playlistError || error}</p>
                  <button
                    onClick={reloadPlaylist}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isDark ? 'bg-white/10 hover:bg-white/20 text-white'
                             : 'bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Thử lại
                  </button>
                </div>
              )}

              <div className={`p-3 rounded-xl mb-4 text-xs ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-600'}`}>
                <p>Tracks loaded: {tracks.length}</p>
                <p>Current track: {'None'}</p>
                <p>Ready state: {audioRef.current?.readyState || 'Unknown'}</p>
              </div>

              {tracks.length === 0 ? (
                <div className="text-center py-8">
                  <Music className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                  <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                    {playlistError ? 'Lỗi tải playlist' : 'Đang tải playlist...'}
                  </p>
                </div>
              ) : (
                <>
                  <div className={`${isDark ? 'bg-white/5' : 'bg-slate-50'} p-4 rounded-xl mb-4`}>
                    <div className="flex items-center gap-3">
                      <div className={`${isDark ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20' : 'bg-gradient-to-br from-purple-100 to-blue-100'} w-12 h-12 rounded-xl flex items-center justify-center`}>
                        <Music className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                          {currentTrack?.title || 'Chưa có bài hát'}
                        </h4>
                        <p className={`text-sm truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {currentTrack?.artist || 'Nghệ sĩ không xác định'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className={`relative h-2 rounded-full mb-2 ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.1 }}
                      />
                      <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        disabled={!currentTrack || isLoading}
                        className="absolute inset-0 z-10 w-full h-6 opacity-0 cursor-pointer appearance-none"
                      />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{formatTime(currentTime)}</span>
                      <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{formatTime(duration)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <motion.button
                      onClick={prevTrack}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={tracks.length <= 1}
                      className={`p-3 rounded-full transition-colors disabled:opacity-50 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'}`}
                    >
                      <SkipBack className="w-5 h-5" />
                    </motion.button>

                    <motion.button
                      onClick={togglePlay}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={isLoading || !currentTrack}
                      className="p-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <RefreshCw className="w-6 h-6" />
                        </motion.div>
                      ) : isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </motion.button>

                    <motion.button
                      onClick={nextTrack}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={tracks.length <= 1}
                      className={`p-3 rounded-full transition-colors disabled:opacity-50 ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'}`}
                    >
                      <SkipForward className="w-5 h-5" />
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <motion.button
                      onClick={toggleMute}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-800'}`}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </motion.button>

                    <div className="flex-1 relative">
                      <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${volume * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      </div>
                      <input
                        type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    <span className={`text-xs w-8 text-right ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {Math.round(volume * 100)}%
                    </span>
                  </div>

                  <motion.button
                    onClick={() => setShowPlaylist(!showPlaylist)}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl transition-all duration-300 mb-4 ${
                      isDark ? 'bg-white/10 hover:bg-white/15 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {showPlaylist ? 'Ẩn danh sách' : `Danh sách (${tracks.length})`}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {showPlaylist && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {tracks.map((track, index) => (
                            <motion.button
                              key={track.id}
                              onClick={() => setTrack(index)}
                              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                              className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                index === currentTrackIndex
                                  ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30'
                                  : isDark ? 'hover:bg-white/5 border border-transparent'
                                           : 'hover:bg-slate-50 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                  index === currentTrackIndex ? 'bg-purple-500 text-white'
                                                              : isDark ? 'bg-slate-700 text-slate-300'
                                                                       : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {index === currentTrackIndex && isPlaying ? (
                                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                      <Music className="w-4 h-4" />
                                    </motion.div>
                                  ) : <span>{index + 1}</span>}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>{track.title}</p>
                                  <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {track.artist} • {formatTime(track.duration)}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
