import React, { useState } from 'react';
import { useKokoroTTS } from '../hooks/useKokoroTTS';
import { VoiceEnum } from '../services/kokoroTTSService';

interface TTSPreviewProps {
  apiKey: string;
}

export const TTSPreview: React.FC<TTSPreviewProps> = ({ apiKey }) => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceEnum>('af_heart');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { generate, isLoading, error } = useKokoroTTS({
    apiKey,
    onError: (error) => console.error('TTS Error:', error),
  });

  const handleGenerate = async () => {
    if (!text.trim()) return;

    try {
      const result = await generate({
        prompt: text,
        voice: selectedVoice,
        speed: 1.0,
      });

      setAudioUrl(result.audio.url);
    } catch (error) {
      console.error('Failed to generate speech:', error);
    }
  };

  const handlePlay = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Text to Speech Preview</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Text to Convert</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Enter text to convert to speech..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Select Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value as VoiceEnum)}
            className="w-full p-2 border rounded-md"
          >
            <option value="af_heart">Heart (Female)</option>
            <option value="am_adam">Adam (Male)</option>
            <option value="am_echo">Echo (Male)</option>
            <option value="af_nova">Nova (Female)</option>
            <option value="af_river">River (Female)</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading || !text.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            {isLoading ? 'Generating...' : 'Generate Speech'}
          </button>

          {audioUrl && (
            <button
              onClick={handlePlay}
              disabled={isPlaying}
              className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-300"
            >
              {isPlaying ? 'Playing...' : 'Play Audio'}
            </button>
          )}
        </div>

        {error && (
          <div className="text-red-500 mt-2">
            Error: {error.message}
          </div>
        )}
      </div>
    </div>
  );
}; 