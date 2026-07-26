import { useState, useRef, useEffect, useCallback } from 'react';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [waveformData, setWaveformData] = useState(new Array(24).fill(10));
  const [permissionError, setPermissionError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  const startRecording = useCallback(async () => {
    setPermissionError(null);
    setAudioBlob(null);
    setRecordingTime(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Web Audio API analyzer for real waveform
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser.fftSize = 64;
      source.connect(analyser);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(100);
      setIsRecording(true);

      // Start elapsed timer
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Start waveform animation loop
      const updateWaveform = () => {
        if (analyserRef.current) {
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          analyserRef.current.getByteFrequencyData(dataArray);

          // Subsample 24 bar values normalized 10px to 60px
          const bars = [];
          const step = Math.floor(bufferLength / 24) || 1;
          for (let i = 0; i < 24; i++) {
            const val = dataArray[i * step] || 0;
            const normalized = Math.max(10, Math.min(64, (val / 255) * 60 + 10));
            bars.push(normalized);
          }
          setWaveformData(bars);
        } else {
          // Simulated fallback waveform movement if audio context fails
          const simulated = Array.from({ length: 24 }, () => Math.floor(Math.random() * 40) + 12);
          setWaveformData(simulated);
        }
        animationFrameRef.current = requestAnimationFrame(updateWaveform);
      };
      updateWaveform();

    } catch (err) {
      console.warn("Microphone permission denied or not available, falling back to simulation mode", err);
      setPermissionError("মাইক্রোফোন অ্যাক্সেস পাওয়া যায়নি — সিমুলেশন মোডে ভয়েস টেস্ট করুন");
      
      // Start simulated recording
      setIsRecording(true);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      const updateSimulatedWaveform = () => {
        const simulated = Array.from({ length: 24 }, () => Math.floor(Math.random() * 45) + 15);
        setWaveformData(simulated);
        animationFrameRef.current = requestAnimationFrame(updateSimulatedWaveform);
      };
      updateSimulatedWaveform();
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }

    setWaveformData(new Array(24).fill(10));
  }, []);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    audioBlob,
    waveformData,
    permissionError,
    startRecording,
    stopRecording
  };
}
