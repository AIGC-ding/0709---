import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Mail } from "lucide-react";
import "./PillNav.css";

export default function PillNav({
  items,
  activeHref,
  contactHref,
  ease = "power3.out"
}) {
  const circleRefs = useRef([]);
  const timelinesRef = useRef([]);
  const tweenRefs = useRef([]);
  const itemWrapRef = useRef(null);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const { width, height } = pill.getBoundingClientRect();
        const radius = ((width * width) / 4 + height * height) / (2 * height);
        const diameter = Math.ceil(2 * radius) + 2;
        const delta =
          Math.ceil(radius - Math.sqrt(Math.max(0, radius * radius - (width * width) / 4))) +
          1;
        const originY = diameter - delta;
        const label = pill.querySelector(".pill-label");
        const hoverLabel = pill.querySelector(".pill-label-hover");

        circle.style.width = `${diameter}px`;
        circle.style.height = `${diameter}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });
        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: height + 18, opacity: 0 });

        timelinesRef.current[index]?.kill();
        const timeline = gsap.timeline({ paused: true });
        timeline.to(circle, { scale: 1.18, xPercent: -50, duration: 1.5, ease }, 0);
        if (label) timeline.to(label, { y: -(height + 8), duration: 1.5, ease }, 0);
        if (hoverLabel) {
          timeline.to(hoverLabel, { y: 0, opacity: 1, duration: 1.5, ease }, 0);
        }
        timelinesRef.current[index] = timeline;
      });
    };

    layout();
    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    const intro = gsap.timeline({ defaults: { ease } });
    intro.fromTo(
      itemWrapRef.current,
      { y: -8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55 }
    );

    const timelines = timelinesRef.current;
    const tweens = tweenRefs.current;

    return () => {
      window.removeEventListener("resize", onResize);
      timelines.forEach((timeline) => timeline?.kill());
      tweens.forEach((tween) => tween?.kill());
      intro.kill();
    };
  }, [items, ease]);

  function handleEnter(index) {
    const timeline = timelinesRef.current[index];
    if (!timeline) return;
    tweenRefs.current[index]?.kill();
    tweenRefs.current[index] = timeline.tweenTo(timeline.duration(), {
      duration: 0.32,
      ease,
      overwrite: "auto"
    });
  }

  function handleLeave(index) {
    const timeline = timelinesRef.current[index];
    if (!timeline) return;
    tweenRefs.current[index]?.kill();
    tweenRefs.current[index] = timeline.tweenTo(0, {
      duration: 0.24,
      ease,
      overwrite: "auto"
    });
  }

  return (
    <nav className="pill-nav" aria-label="个人网站导航">
      <div className="pill-nav-items" ref={itemWrapRef}>
        <ul className="pill-list">
          {items.map((item, index) => {
            const href = `#${item.target}`;
            const isActive = activeHref === href;
            return (
              <li key={item.target}>
                <a
                  className={`pill${isActive ? " is-active" : ""}`}
                  href={href}
                  onMouseEnter={() => handleEnter(index)}
                  onMouseLeave={() => handleLeave(index)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(element) => {
                      circleRefs.current[index] = element;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <a className="pill-contact" href={contactHref}>
        <Mail size={17} aria-hidden="true" />
        <span>联系我</span>
      </a>
    </nav>
  );
}
