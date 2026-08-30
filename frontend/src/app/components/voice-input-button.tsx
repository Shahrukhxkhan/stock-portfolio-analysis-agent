"use client"

import React, { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, Sparkles } from "lucide-react"

interface VoiceInputButtonProps {
  onTranscript?: (transcript: string) => void
  className?: string
}

export function VoiceInputButton({ onTranscript, className = "" }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [supported, setSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check for Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: any) => {
      let currentTranscript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        currentTranscript += text
      }
      setTranscript(currentTranscript)

      // Inject into CopilotKit input
      const inputEl = document.querySelector(
        ".copilotKitInput input, .copilotKitInput textarea"
      ) as HTMLInputElement | HTMLTextAreaElement
      if (inputEl) {
        inputEl.value = currentTranscript
        inputEl.dispatchEvent(new Event("input", { bubbles: true }))
      }

      if (onTranscript) {
        onTranscript(currentTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.stop()
      } catch {}
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (!supported) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.")
      return
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop()
      } catch {}
      setIsListening(false)
    } else {
      setTranscript("")
      try {
        recognitionRef.current?.start()
        setIsListening(true)
      } catch (err) {
        console.error("Failed to start speech recognition:", err)
      }
    }
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Listening... Click to stop" : "Voice Input (Speech-to-Text)"}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          isListening
            ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse"
            : "bg-white/5 hover:bg-white/10 text-[#a1a1aa] hover:text-[#f5f5f7] border-white/10 hover:border-purple-500/30"
        }`}
      >
        {isListening ? (
          <>
            <MicOff size={14} className="text-rose-400 animate-bounce" />
            <span className="font-mono text-[11px] font-bold text-rose-300">Listening...</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-rose-400 rounded-full voice-wave-bar" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-4 bg-rose-300 rounded-full voice-wave-bar" style={{ animationDelay: "200ms" }}></span>
              <span className="w-1 h-2 bg-rose-400 rounded-full voice-wave-bar" style={{ animationDelay: "400ms" }}></span>
            </div>
          </>
        ) : (
          <>
            <Mic size={14} className="text-purple-400" />
            <span>Voice</span>
          </>
        )}
      </button>

      {/* Floating active transcript preview balloon */}
      {isListening && transcript && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 bg-black/90 border border-rose-500/40 rounded-xl shadow-2xl backdrop-blur-xl z-50 text-xs text-[#f5f5f7] animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1 text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-1">
            <Volume2 size={10} /> Live Voice Transcript
          </div>
          <p className="italic line-clamp-3">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
