"use client";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

export type HeroVideoDialogProps = {
  className?: string;
  videoSrc: string; // embed URL, e.g. https://www.youtube.com/embed/...
  thumbnailSrc?: string;
  thumbnailAlt?: string;
  trigger?: React.ReactNode; // optional custom trigger (e.g., a button)
  animationStyle?: "from-center" | "from-top" | "from-bottom";
  title?: string;
};

export default function HeroVideoDialog({
  className,
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  trigger,
  title = "First aid video",
}: HeroVideoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          <div className={cn(className)}>{trigger}</div>
        ) : (
          <button aria-label="Play video" className={cn("relative block overflow-hidden rounded-xl border", className)}>
            {thumbnailSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnailSrc} alt={thumbnailAlt} className="w-full h-auto" />
            ) : (
              <div className="grid h-40 w-64 place-items-center bg-secondary text-sm text-muted-foreground">
                Play Video
              </div>
            )}
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={videoSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
