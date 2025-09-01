import { useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;      // tên file hoặc URL tuyệt đối (Cloudinary)
  duration: number;
}

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

  // cập nhật src khi đổi bài
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

  // event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);

    // hiện đang lặp lại cùng bài; muốn loop playlist thì gọi nextTrack()
    const handleEnded = () => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.play().catch(() => {});
      setIsPlaying(true);
    };

    const handleCanPlay = () => { setIsLoading(false); setError(null); };
    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => { setIsLoading(false); setIsPlaying(true); };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setError('Không thể tải file nhạc. Vui lòng kiểm tra URL/tên file.');
    };
    const handleLoadStart = () => setIsLoading(true);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadstart', handleLoadStart);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  // volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (audioRef.current && currentTrack) {
      try {
        // KHÔNG HEAD check để tránh CORS với Cloudinary
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
    if (isPlaying) pause(); else play();
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
    currentTrack, currentTrackIndex, isPlaying, currentTime, duration,
    volume, isMuted, isLoading, error,
    play, pause, togglePlay, nextTrack, prevTrack, seek, setTrack, toggleMute, changeVolume,
    audioRef,
  };
}
