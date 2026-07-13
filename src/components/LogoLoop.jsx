import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./LogoLoop.css";

function mod(value, width) {
  return ((value % width) + width) % width;
}

export default function LogoLoop({
  logos = [],
  renderItem,
  speed = 72,
  direction = "left",
  hoverSpeed = 0,
  fadeOut = true,
  fadeOutColor = "#050607",
  scaleOnHover = true,
  ariaLabel = "作品展示流",
  className = ""
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const sequenceRef = useRef(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(speed);
  const isVisibleRef = useRef(true);
  const [sequenceWidth, setSequenceWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  function pauseLoop() {
    velocityRef.current = hoverSpeed;
    setIsHovering(true);
  }

  function resumeLoop() {
    velocityRef.current = speed;
    setIsHovering(false);
  }

  useLayoutEffect(() => {
    const measure = () => {
      if (!sequenceRef.current) return;
      setSequenceWidth(sequenceRef.current.scrollWidth);
    };

    measure();

    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(measure)
        : null;

    if (observer && rootRef.current) {
      observer.observe(rootRef.current);
      observer.observe(sequenceRef.current);
    }

    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [logos]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "160px 0px" }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !sequenceWidth || !logos.length) return undefined;

    let frameId = 0;
    let lastTime = performance.now();
    const sign = direction === "right" ? -1 : 1;

    const tick = (time) => {
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      if (
        !isVisibleRef.current ||
        document.hidden ||
        document.body.classList.contains("is-media-preview-open")
      ) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      const targetSpeed = isHovering ? hoverSpeed : speed;
      velocityRef.current += (targetSpeed - velocityRef.current) * 0.08;
      offsetRef.current = mod(
        offsetRef.current + sign * velocityRef.current * deltaSeconds,
        sequenceWidth
      );

      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [direction, hoverSpeed, isHovering, logos.length, sequenceWidth, speed]);

  if (!logos.length) {
    return null;
  }

  function renderSequence(copyIndex, ref) {
    return (
      <ul className="logoloop__list" ref={ref} aria-hidden={copyIndex > 0}>
        {logos.map((logo, index) => (
          <li
            className="logoloop__item"
            key={`${copyIndex}-${logo.id ?? logo.title ?? index}`}
          >
            {renderItem ? renderItem(logo, index) : logo.title}
          </li>
        ))}
      </ul>
    );
  }

  const style = {
    "--logoloop-fade-color": fadeOutColor
  };

  return (
    <div
      className={[
        "logoloop",
        fadeOut ? "logoloop--fade" : "",
        scaleOnHover ? "logoloop--scale-hover" : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      ref={rootRef}
      style={style}
      role="region"
      aria-label={ariaLabel}
      onFocusCapture={pauseLoop}
      onBlurCapture={resumeLoop}
      onMouseEnter={pauseLoop}
      onMouseLeave={resumeLoop}
    >
      <div className="logoloop__track" ref={trackRef}>
        {renderSequence(0, sequenceRef)}
        {renderSequence(1)}
      </div>
    </div>
  );
}
