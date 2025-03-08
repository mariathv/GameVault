"use client"

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function YouTubeVideo({ videoId, title, className = "" }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const iframeRef = useRef(null);
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
            const newPlayer = new window.YT.Player(iframeRef.current, {
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    showinfo: 0,
                    mute: 0,
                },
                events: {
                    onStateChange: (event) => {
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                    },
                },
            });
            setPlayer(newPlayer);
        };

        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, [videoId]);

    const togglePlay = () => {
        if (!player) return;
        if (isPlaying) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (!player) return;
        if (isMuted) {
            player.unMute();
        } else {
            player.mute();
        }
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = () => {
        if (!containerRef.current) return;
        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    return (
        <div ref={containerRef} className={`relative aspect-video overflow-hidden rounded-lg ${className}`}>
            {title && (
                <div className="absolute inset-x-0 top-0 p-4 text-lg text-white bg-gradient-to-b from-black/50 to-transparent z-10">
                    <div className="line-clamp-1">{title}</div>
                </div>
            )}

            <div className="w-full h-full">
                <div id="youtube-player" ref={iframeRef} className="w-full h-full"></div>
            </div>

            <div className="absolute inset-x-0 bottom-0 grid gap-2 bg-gradient-to-b from-transparent to-black/50 z-10">
                <div className="flex items-center gap-3 p-3 text-white">
                    <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={togglePlay}>
                        {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="w-9 h-9 hover:bg-black/50" onClick={toggleMute}>
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </Button>
                    <Button size="icon" variant="ghost" className="ml-auto w-9 h-9 hover:bg-black/50" onClick={toggleFullscreen}>
                        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}

window.YT = window.YT || {};
window.onYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady || function () { };
