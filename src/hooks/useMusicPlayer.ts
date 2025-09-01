import { useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number;
}

interface UseMusicPlayerOptions {
  autoPlay?: boolean;
  loop?: boolean;
}

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

    // reset trước khi load bài mới
    try { audio.pause(); } catch {}
    audio.currentTime = 0;
    setIsPlaying(false);         // <- quan trọng
    setIsLoading(true);
    setError(null);

    const audioPath = `/music/${currentTrack.file}`;
    audio.src = audioPath;
    audio.load();

    // auto play ngay khi đổi bài, bật đoạn này + option autoPlay
    // if (autoPlay) {
    //   const onCanPlay = () => {
    //     audio.play().catch(() => {});
    //     audio.removeEventListener('canplay', onCanPlay);
    //   };
    //   audio.addEventListener('canplay', onCanPlay);
    // }
  }
}, [currentTrack]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log('Audio loaded successfully');
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    // const handleEnded = () => {
    //   console.log('Track ended');
    //   setIsPlaying(true);
    //   nextTrack();
    // };
    const handleEnded = () => {
  console.log('Track ended → restart same track');
  const audio = audioRef.current;
  if (!audio) return;

 
  audio.currentTime = 0;
  audio.play().catch(() => {});
  setIsPlaying(true);
};

    const handleCanPlay = () => {
      console.log('Audio can play');
      setIsLoading(false);
      setError(null);
    };

    const handleWaiting = () => {
      console.log('Audio waiting...');
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log('Audio playing');
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Audio paused');
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsLoading(false);
      setIsPlaying(false);
      setError('Không thể tải file nhạc. Vui lòng kiểm tra file tồn tại.');
    };

    const handleLoadStart = () => {
      console.log('Audio load start');
      setIsLoading(true);
    };

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

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const play = useCallback(async () => {
    if (audioRef.current && currentTrack) {
      try {
        console.log('Attempting to play:', currentTrack.file);
        
        // Kiểm tra xem file có tồn tại không
        const response = await fetch(`/music/${currentTrack.file}`, { method: 'HEAD' });
        if (!response.ok) {
          throw new Error(`File không tồn tại: ${currentTrack.file}`);
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
        console.log('Playing successfully');
      } catch (error) {
        console.error('Error playing audio:', error);
        setError(error instanceof Error ? error.message : 'Lỗi không xác định');
        setIsPlaying(false);
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
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return;
    
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex >= tracks.length) {
      if (loop) {
        setCurrentTrackIndex(0);
      } else {
        setIsPlaying(false);
        return;
      }
    } else {
      setCurrentTrackIndex(nextIndex);
    }
    
    setCurrentTime(0);
  }, [currentTrackIndex, tracks.length, loop]);

  const prevTrack = useCallback(() => {
    if (tracks.length === 0) return;
    
    const prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      setCurrentTrackIndex(tracks.length - 1);
    } else {
      setCurrentTrackIndex(prevIndex);
    }
    
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

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const changeVolume = useCallback((newVolume: number) => {
    setVolume(Math.max(0, Math.min(1, newVolume)));
  }, []);

  return {
    // State
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    error,
    
    // Controls
    play,
    pause,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    setTrack,
    toggleMute,
    changeVolume,
    
    // Refs
    audioRef,
  };
}