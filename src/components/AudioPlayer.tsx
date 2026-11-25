import { useEffect, useRef, useState } from 'react'
import { Headphones, Pause, Play, Volume2 } from 'lucide-react'

interface AudioPlayerProps {
  text: string
  audioUrl?: string | null
}

export default function AudioPlayer({ text, audioUrl }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [speed, setSpeed] = useState<'slow' | 'normal'>('slow')
  const [isPlaying, setIsPlaying] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed === 'slow' ? 0.75 : 1
  }, [speed])

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  const play = async () => {
    setMessage('')
    if (audioUrl && audioRef.current) {
      audioRef.current.playbackRate = speed === 'slow' ? 0.75 : 1
      try {
        await audioRef.current.play()
        setIsPlaying(true)
      } catch {
        setMessage('Audio belum dapat diputar. Periksa koneksi atau file audio.')
      }
      return
    }

    if (!('speechSynthesis' in window)) {
      setMessage('Browser ini belum mendukung pemutaran suara otomatis.')
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ar-SA'
    utterance.rate = speed === 'slow' ? 0.75 : 1
    utterance.pitch = 1
    const arabicVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith('ar'))
    if (arabicVoice) utterance.voice = arabicVoice
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => {
      setIsPlaying(false)
      setMessage('Suara Bahasa Arab tidak tersedia di perangkat ini. Audio MP3 dapat ditambahkan melalui Supabase Storage.')
    }
    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
    if (audioUrl && audioRef.current) audioRef.current.pause()
    else if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsPlaying(false)
  }

  return (
    <div className="audio-player">
      {audioUrl && <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} />}
      <div className="audio-icon"><Headphones size={22} /></div>
      <div className="audio-copy">
        <strong>Audio Bahasa Arab</strong>
        <span>{audioUrl ? 'Rekaman pembelajaran' : 'Pratinjau suara perangkat · audio MP3 menyusul'}</span>
      </div>
      <button className="audio-play" onClick={isPlaying ? pause : play} type="button" aria-label={isPlaying ? 'Jeda audio' : 'Putar audio'}>
        {isPlaying ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" />}
      </button>
      <div className="audio-speed-control" aria-label="Kecepatan audio">
        <button className={speed === 'slow' ? 'active' : ''} onClick={() => setSpeed('slow')} type="button">0.75×</button>
        <button className={speed === 'normal' ? 'active' : ''} onClick={() => setSpeed('normal')} type="button">1×</button>
      </div>
      <Volume2 className="audio-volume" size={17} />
      {message && <p className="audio-message">{message}</p>}
    </div>
  )
}
