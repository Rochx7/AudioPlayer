import React, { useState, useRef, useEffect } from 'react'

function usePlayerState(audioPlayer) {
  const [playerState, setPlayState] = useState({
    playing: false,
    percentage: 0
  })

  useEffect(() => {
    playerState.playing ? audioPlayer.current.play() : audioPlayer.current.pause()
  }, [playerState.playing, audioPlayer])

  function toggleAudioPlay() {
    setPlayState({
      ...playerState,
      playing: !playerState.playing
    })
  }

  function handleTimeUpdate() {
    const currentPercentage = (audioPlayer.current?.currentTime / audioPlayer.current?.duration) * 100

    setPlayState({
      ...playerState,
      percentage: currentPercentage
    })
  }

  function handleChangeAudioPercentage(event) {
    const currentPercentageValue = event.target.value
    audioPlayer.current.currentTime = (audioPlayer.current.duration / 100) * currentPercentageValue

    setPlayState({
      ...playerState,
      percentage: currentPercentageValue
    })
  }

  return { playerState, toggleAudioPlay, handleTimeUpdate, handleChangeAudioPercentage }
}

export default function Player() {
  const audioPlayer = useRef(null)
  const { playerState, toggleAudioPlay, handleTimeUpdate, handleChangeAudioPercentage } = usePlayerState(audioPlayer)

  const duration = audioPlayer.current.duration

  function calculateTime(secs) {
    const minutes = Math.floor(secs / 60)
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`
    const seconds = Math.floor(secs % 60)
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`

    return `${returnedMinutes}:${returnedSeconds}`
  }

  const audioUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  const calcTime = audioPlayer.current.currentTime
  return (
    <div>
      <h1>Player MP3</h1>
      <audio onTimeUpdate={handleTimeUpdate} ref={audioPlayer} src={audioUrl}></audio>

      <div>
        <button onClick={toggleAudioPlay}>{playerState.playing ? 'Pause' : 'Play'}</button>
        <span>{calculateTime(calcTime)}</span>
        <input type="range" min="0" max="100" value={playerState.percentage} onChange={handleChangeAudioPercentage} />
        <span>{calculateTime(duration)}</span>
      </div>
    </div>
  )
}
