import { useState, useRef, useEffect, useCallback } from 'react';
import { Track } from '../types';

interface UseMusicPlayerOptions {
  autoPlay?: boolean;
  loop?: boolean;
}

const BASE = import.meta.env.BASE_URL || '/';
const resolveSrc = (file: string) =>
  /^(https?:)?\/\//.test(file) || file.startsWith('data:') || file.startsWith('blob:')
    ? file
    : `${BASE}music/${file}`;

export function useMusicPlayer(tracks: Track[], options: UseMusicPlayerOptions = {}) {
  const { autoPlay = false, loop = true } = options;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      try { audio.pause(); } catch {}
      audio.currentTime = 0;
      setIsPlaying(false);
      setIsLoading(true);
      setError(null);

      const src = resolveSrc(currentTrack.file);
      audio.crossOrigin = 'anonymous';
      audio.src = src;
      audio.load();

      if (autoPlay) {
        const onCanPlay = () => {
          audio.play().catch(() => {});
          audio.removeEventListener('canplay', onCanPlay);
        };
        audio.addEventListener('canplay', onCanPlay);
      }
    }
  }, [currentTrack, autoPlay]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlers = {
      loadedmetadata: () => {
        setDuration(audio.duration);
        setIsLoading(false);
        setError(null);
      },
      timeupdate: () => setCurrentTime(audio.currentTime),
      ended: () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        setIsPlaying(true);
      },
      canplay: () => { setIsLoading(false); setError(null); },
      waiting: () => setIsLoading(true),
      playing: () => { setIsLoading(false); setIsPlaying(true); },
      pause: () => setIsPlaying(false),
      error: () => {
        setIsLoading(false);
        setIsPlaying(false);
        setError('Không thể tải file nhạc');
      },
      loadstart: () => setIsLoading(true),
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      audio.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        audio.removeEventListener(event, handler);
      });
    };
  }, []);

  // Volume and mute control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (audioRef.current && currentTrack) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setIsPlaying(false);
        setError(err instanceof Error ? err.message : 'Không phát được audio');
      }
    }
  }, [currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause(); 
    else play();
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      if (loop) setCurrentTrackIndex(0);
      else { setIsPlaying(false); return; }
    } else {
      setCurrentTrackIndex(nextIndex);
    }
    setCurrentTime(0);
  }, [currentTrackIndex, tracks.length, loop]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    const prevIndex = currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex < 0 ? tracks.length - 1 : prevIndex);
    setCurrentTime(0);
  }, [currentTrackIndex, tracks.length]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setTrack = useCallback((index: number) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setError(null);
    }
  }, [tracks.length]);

  const toggleMute = useCallback(() => setIsMuted(v => !v), []);
  const changeVolume = useCallback((v: number) => setVolume(Math.max(0, Math.min(1, v))), []);

  return {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setTrack,
    toggleMute,
    changeVolume,
    audioRef,
  };
}