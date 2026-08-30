"use client"

import React, { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2 } from "lucide-react"

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
            ? "bg-[#FCEBEB] text-[#D64545] border-[#D64545] shadow-xs"
            : "bg-[#F3F4F8] hover:bg-[#E2E6EF] text-[#101828] border-[#E2E6EF] hover:border-[#3730E0]"
        }`}
      >
        {isListening ? (
          <>
            <MicOff size={14} className="text-[#D64545]" />
            <span className="font-mono text-[11px] font-bold text-[#D64545]">Listening...</span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1 h-3 bg-[#D64545] rounded-full voice-wave-bar" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-4 bg-[#D64545] rounded-full voice-wave-bar" style={{ animationDelay: "200ms" }}></span>
              <span className="w-1 h-2 bg-[#D64545] rounded-full voice-wave-bar" style={{ animationDelay: "400ms" }}></span>
            </div>
          </>
        ) : (
          <>
            <Mic size={14} className="text-[#3730E0]" />
            <span>Voice</span>
          </>
        )}
      </button>

      {/* Floating active transcript preview balloon */}
      {isListening && transcript && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-2.5 bg-[#FFFFFF] border border-[#E2E6EF] rounded-xl shadow-lg z-50 text-xs text-[#101828] animate-in fade-in">
          <div className="flex items-center gap-1 text-[10px] text-[#D64545] font-bold uppercase tracking-wider mb-1">
            <Volume2 size={10} /> Live Voice Transcript
          </div>
          <p className="italic line-clamp-3 text-[#101828]">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
