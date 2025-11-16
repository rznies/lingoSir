import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

export const MemeCanvas = forwardRef(
  ({ imageUrl, caption, width = 500, height = 500, className = "" }, ref) => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [error, setError] = useState(null);

    useImperativeHandle(ref, () => ({
      download: (filename = "meme.png") => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      },
      getDataUrl: () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.toDataURL("image/png") : null;
      },
    }));

    const wrapText = (ctx, text, x, maxWidth, lineHeight) => {
      const words = text.split(" ");
      const lines = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + (currentLine ? " " : "") + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    const drawMeme = () => {
      const canvas = canvasRef.current;
      const image = imageRef.current;

      if (!canvas || !image || !image.complete) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const aspectRatio = image.width / image.height;
      let canvasWidth = width;
      let canvasHeight = height;

      if (aspectRatio > 1) {
        canvasHeight = width / aspectRatio;
      } else {
        canvasWidth = height * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);

      const maxFontSize = Math.min(canvasWidth / 10, 48);
      const minFontSize = Math.min(canvasWidth / 20, 24);
      let fontSize = maxFontSize;

      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const maxWidth = canvasWidth * 0.9;
      const lineHeight = fontSize * 1.2;

      let lines = [];
      do {
        ctx.font = `bold ${fontSize}px Impact, "Arial Black", sans-serif`;
        lines = wrapText(ctx, caption, canvasWidth / 2, maxWidth, lineHeight);

        if (lines.length * lineHeight <= canvasHeight * 0.4 || fontSize <= minFontSize) {
          break;
        }
        fontSize -= 2;
      } while (fontSize > minFontSize);

      const totalTextHeight = lines.length * lineHeight;
      const padding = 20;
      const y = canvasHeight - totalTextHeight - padding;

      ctx.strokeStyle = "black";
      ctx.lineWidth = Math.max(fontSize / 10, 3);
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.fillStyle = "white";

      lines.forEach((line, index) => {
        const lineY = y + (index * lineHeight);
        ctx.strokeText(line, canvasWidth / 2, lineY);
        ctx.fillText(line, canvasWidth / 2, lineY);
      });
    };

    useEffect(() => {
      if (!imageUrl) {
        setError("No image URL provided");
        return;
      }

      const image = new Image();
      image.crossOrigin = "anonymous";

      image.onload = () => {
        imageRef.current = image;
        setError(null);
        try {
          drawMeme();
        } catch (err) {
          console.error("Failed to draw meme:", err);
          setError("Failed to render meme");
        }
      };

      image.onerror = () => {
        setError("Failed to load image");
      };

      image.src = imageUrl;

      return () => {
        if (imageRef.current) {
          imageRef.current = null;
        }
      };
    }, [imageUrl, caption, width, height]);

    if (error) {
      return (
        <div className={`flex items-center justify-center bg-slate-200 dark:bg-slate-800 ${className}`}
          style={{ width, height: height * 0.7 }}>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className={`max-w-full h-auto ${className}`}
        style={{ display: "block" }}
      />
    );
  }
);

MemeCanvas.displayName = "MemeCanvas";
