"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  onProgress?: (progress: { played: number; playedSeconds: number }) => void;
  onReady?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onProgress, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current && videoRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          controls: true,
          responsive: true,
          fluid: true,
          preload: "auto",
          playbackRates: [0.5, 1, 1.25, 1.5, 2],
          controlBar: {
            volumePanel: {
              inline: false,
            },
          },
        },
        () => {
          if (onReady) {
            onReady();
          }
        }
      ));

      // Track progress for completion
      if (onProgress) {
        player.on("timeupdate", () => {
          const currentTime = player.currentTime() || 0;
          const duration = player.duration() || 0;
          
          if (duration > 0) {
            const played = currentTime / duration;
            onProgress({
              played,
              playedSeconds: currentTime,
            });
          }
        });
      }
    }
  }, [onReady, onProgress]);

  // Update the video source when it changes
  useEffect(() => {
    const player = playerRef.current;

    if (player && src) {
      // Determine the video type from the URL
      let type = "video/mp4";
      if (src.includes(".m3u8")) {
        type = "application/x-mpegURL"; // HLS
      } else if (src.includes(".mpd")) {
        type = "application/dash+xml"; // DASH
      }

      player.src({
        src,
        type,
      });
    }
  }, [src]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} className="video-js-wrapper" />
    </div>
  );
};

export default VideoPlayer;
