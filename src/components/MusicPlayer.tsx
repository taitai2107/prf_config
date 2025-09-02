import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Volume2, VolumeX, SkipBack, SkipForward,
  Music, List, AlertCircle, RefreshCw
} from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import { formatTime } from '../utils/format';
import { Track } from '../types';

interface MusicPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

const BASE = import.meta.env.BASE_URL || '/';
const staticUrl = (path: string) => `${BASE}${path.replace(/^\/+/, '')}`;

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

  useEffect(() => {
    if (!isOpen) return;

    const loadPlaylist = async () => {
      try {
        const response = await fetch(staticUrl('music/playlist.json'));
        if (!response.ok) throw new Error(`HTTP ${response.status}: Không thể tải playlist`);

        const data = await response.json();
        const normalizedTracks: Track[] = (data.tracks || []).map((track: any, index: number) => ({
          id: track.id ?? `track-${index + 1}`,
          title: track.title ?? `Track ${index + 1}`,
          artist: track.artist ?? 'Unknown Artist',
          file: track.file,
          duration: Number(track.duration) || 0,
        }));

        if (normalizedTracks.length === 0) throw new Error('Playlist trống');

        setTracks(normalizedTracks);
        setPlaylistError(null);
      } catch (err) {
        setPlaylistError(err instanceof Error ? err.message : 'Lỗi không xác định');
      }
    };

    loadPlaylist();
  }, [isOpen]);

  const reloadPlaylist = () => {
    setPlaylistError(null);
    setTracks([]);
    
    fetch(staticUrl(`music/playlist.json?t=${Date.now()}`))
      .then(res => res.json())
      .then(data => setTracks(data.tracks || []))
      .catch(err => setPlaylistError(err.message || 'Lỗi tải playlist'));
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Trình phát nhạc"
        isDark={isDark}
        maxWidth="sm"
      >
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
            <Button
              onClick={reloadPlaylist}
              variant="ghost"
              size="sm"
              icon={RefreshCw}
              isDark={isDark}
            >
              Thử lại
            </Button>
          </div>
        )}

        {tracks.length === 0 ? (
          <div className="text-center py-8">
            <Music className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
              {playlistError ? 'Lỗi tải playlist' : 'Đang tải playlist...'}
            </p>
          </div>
        ) : (
          <>
            {/* Current Track Display */}
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

            {/* Progress Bar */}
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
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  disabled={!currentTrack || isLoading}
                  className="absolute inset-0 z-10 w-full h-6 opacity-0 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {formatTime(currentTime)}
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                onClick={prevTrack}
                variant="ghost"
                size="sm"
                icon={SkipBack}
                disabled={tracks.length <= 1}
                isDark={isDark}
              />

              <Button
                onClick={togglePlay}
                variant="primary"
                disabled={isLoading || !currentTrack}
                className="!p-4 !rounded-full"
              >
                {isLoading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RefreshCw className="w-6 h-6" />
                  </motion.div>
                ) : isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" />
                )}
              </Button>

              <Button
                onClick={nextTrack}
                variant="ghost"
                size="sm"
                icon={SkipForward}
                disabled={tracks.length <= 1}
                isDark={isDark}
              />
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={toggleMute}
                variant="ghost"
                size="sm"
                icon={isMuted ? VolumeX : Volume2}
                isDark={isDark}
              />

              <div className="flex-1 relative">
                <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${volume * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => changeVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              <span className={`text-xs w-8 text-right ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Playlist Toggle */}
            <Button
              onClick={() => setShowPlaylist(!showPlaylist)}
              variant="secondary"
              icon={List}
              isDark={isDark}
              className="w-full mb-4"
            >
              {showPlaylist ? 'Ẩn danh sách' : `Danh sách (${tracks.length})`}
            </Button>

            {/* Playlist */}
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
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
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
                              <motion.div 
                                animate={{ scale: [1, 1.2, 1] }} 
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <Music className="w-4 h-4" />
                              </motion.div>
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                              {track.title}
                            </p>
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
      </Modal>
    </>
  );
}