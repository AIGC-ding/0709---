import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowUpRight,
  BriefcaseBusiness,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Layers3,
  Mail,
  Maximize2,
  MapPin,
  Pause,
  Phone,
  Play,
  Save,
  Sparkles,
  Workflow,
  X
} from "lucide-react";
import Ferrofluid from "./components/Ferrofluid";
import CircularGallery from "./components/CircularGallery";
import GlassSurface from "./components/GlassSurface";
import LogoLoop from "./components/LogoLoop";
import PillNav from "./components/PillNav";
import { portfolioSite, startupContent } from "./content/siteContent";
import "./App.css";

gsap.registerPlugin(ScrollTrigger);

const SHOWCASE_STORAGE_KEY = "dh-commercial-showcase-edits-v1";
const FERROFLUID_COLORS = ["#4fbce8", "#74fff1", "#dfff34"];
const routeMap = {
  home: "hero",
  commercial: "projects",
  profile: "experience"
};
const siteSectionIds = new Set([
  "hero",
  "experience",
  "projects",
  "advantages",
  "contact"
]);

function App() {
  const [stage, setStage] = useState("gate");
  const content = useMemo(() => normalizePortfolioContent(portfolioSite), []);
  const startedFromRouteRef = useRef(Boolean(getHashTarget()));
  const startupVideoRef = useRef(null);

  useOpeningMotion(stage);

  useEffect(() => {
    if (stage !== "site") return;

    const target = getHashTarget();
    if (!target) return;

    const delays = [80, 420, 1100];
    const timers = delays.map((delay) =>
      window.setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: "auto" });
      }, delay)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stage]);

  function startOpening() {
    const video = startupVideoRef.current;
    if (!video) return;

    setStage("opening");
    window.requestAnimationFrame(() => {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 1;
      video.load();
      video.play().catch(() => setStage("entry"));

      window.setTimeout(() => {
        if (video.paused && video.currentTime < 0.2) {
          setStage("entry");
        }
      }, 900);
    });
  }

  function handleStartupProgress() {
    const video = startupVideoRef.current;
    if (!video || stage !== "opening") return;

    if (video.currentTime >= startupContent.freezeAtSeconds) {
      video.pause();
      video.currentTime = startupContent.freezeAtSeconds;
      setStage("entry");
    }
  }

  function enterSite() {
    const target = getHashTarget();
    setStage("site");
    window.history.replaceState(null, "", target && target !== "hero" ? `#${target}` : "#home");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  }

  return (
    <main className={`app-shell stage-${stage}`}>
      {stage !== "site" && (
        <StartupScene
          stage={stage}
          startupVideoRef={startupVideoRef}
          onStart={startOpening}
          onTimeUpdate={handleStartupProgress}
          onEnterSite={enterSite}
        />
      )}

      {stage === "site" && (
        <PortfolioSite
          content={content}
          skipInitialReveal={startedFromRouteRef.current}
        />
      )}
    </main>
  );
}

function StartupScene({
  stage,
  startupVideoRef,
  onStart,
  onTimeUpdate,
  onEnterSite
}) {
  return (
    <section className="startup-scene" aria-label="首页启动交互">
      <div className="gate-layer">
        <img
          className="gate-bg"
          src={startupContent.gateImage}
          alt="DingHaiRan AIGC工程师启动界面"
        />
        <button
          className="gate-hotspot"
          type="button"
          onClick={onStart}
          aria-label="开启有声开场动画"
        >
          <span className="gate-hotspot-label">
            <Play size={22} aria-hidden="true" />
            <span>开启开场</span>
          </span>
        </button>
      </div>

      <video
        ref={startupVideoRef}
        className="startup-video"
        src={startupContent.startupVideo}
        playsInline
        preload="auto"
        onTimeUpdate={onTimeUpdate}
        onEnded={onTimeUpdate}
      />

      {stage === "entry" && (
        <div className="entry-layer" aria-label="进入作品集">
          <img
            className="entry-bg"
            src={startupContent.entryImage}
            alt="进入作品集入口"
          />
          <button className="entry-action" type="button" onClick={onEnterSite}>
            <ArrowDown size={22} aria-hidden="true" />
            <span>进入作品集</span>
          </button>
        </div>
      )}

      <OpeningIdentity />
    </section>
  );
}

function OpeningIdentity() {
  return (
    <div className="opening-identity" data-edit-key="startupContent.name">
      <strong>{startupContent.name}</strong>
      <span>{startupContent.role}</span>
    </div>
  );
}

function PortfolioSite({ content, skipInitialReveal }) {
  const scopeRef = useRef(null);
  const isFloatingNav = useFloatingNav();
  const activeHref = useActiveHref(content.nav);
  usePortfolioMotion(scopeRef, content, skipInitialReveal);

  return (
    <div className="portfolio-site" ref={scopeRef}>
      <FerrofluidBackdrop />
      <SiteNav
        activeHref={activeHref}
        brand={content.brand}
        contact={content.contact}
        isFloating={isFloatingNav}
        nav={content.nav}
      />
      <HeroSection content={content} />
      <ExperienceSection content={content.experience} />
      <ProjectsSection content={content.projects} />
      <AdvantagesSection content={content.advantages} />
      <ContactSection content={content.contact} brand={content.brand} />
    </div>
  );
}

function FerrofluidBackdrop() {
  return (
    <div className="ferrofluid-backdrop">
      <Ferrofluid
        colors={FERROFLUID_COLORS}
        speed={0.2}
        scale={2.15}
        turbulence={0.72}
        fluidity={0.16}
        rimWidth={0.14}
        sharpness={3.2}
        shimmer={0.7}
        glow={1.45}
        flowDirection="down"
        opacity={0.26}
        mouseInteraction
        mouseStrength={0.75}
        mouseRadius={0.3}
        mixBlendMode="screen"
      />
    </div>
  );
}

function SiteNav({ activeHref, brand, nav, contact, isFloating }) {
  return (
    <header className={`site-nav-shell${isFloating ? " is-floating" : ""}`}>
      <div className="nav-wordmark" data-edit-key="brand">
        <b>{brand.name}</b>
        <span>{brand.role}</span>
      </div>
      <PillNav
        activeHref={activeHref}
        contactHref={`mailto:${contact.email}`}
        items={nav}
      />
    </header>
  );
}

function HeroSection({ content }) {
  const { hero, brand } = content;

  return (
    <section className="site-hero" id="hero" data-edit-group="hero">
      <video
        className="hero-bg-video"
        src={hero.backgroundVideo}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <div className="hero-vignette" />

      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="hero-kicker" data-edit-key="hero.eyebrow">
            {hero.eyebrow}
          </p>
          <h1 className="hero-title" data-edit-key="hero.title">
            <span className="hero-title-line">{hero.titleTop}</span>
            <span className="hero-title-line is-secondary">{hero.titleBottom}</span>
          </h1>
          <p className="hero-summary" data-edit-key="hero.summary">
            {hero.summary}
          </p>

          <div className="hero-actions">
            <a className="primary-action" href={`#${hero.primaryAction.target}`}>
              <ArrowDown size={18} aria-hidden="true" />
              <span>{hero.primaryAction.label}</span>
            </a>
            <a className="ghost-action" href={hero.secondaryAction.href}>
              <Mail size={18} aria-hidden="true" />
              <span>{hero.secondaryAction.label}</span>
            </a>
          </div>
        </div>

        <Magnetic className="hero-visual" strength={22}>
          <img src={hero.visualImage} alt={`${brand.name} portfolio cube`} />
          <div className="hero-visual-caption">
            <span>{brand.cnName}</span>
            <strong>{brand.role}</strong>
          </div>
        </Magnetic>

        <div className="hero-tags" data-edit-key="hero.tags">
          {hero.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>

        <div className="hero-metrics" data-edit-key="hero.metrics">
          {hero.metrics.map((metric) => (
            <article className="hero-metric" key={metric.label}>
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceSection({ content }) {
  return (
    <section
      className="content-section experience-section scroll-section"
      id="experience"
      data-edit-group="experience"
    >
      <div className="site-container experience-layout">
        <div className="section-heading">
          <span>{content.eyebrow}</span>
          <h2 className="section-title">{content.englishTitle}</h2>
        </div>

        <div className="experience-portrait reveal-media" data-edit-key="experience.portrait">
          <img src={content.portrait} alt="丁海蚺头像" />
        </div>

        <div className="experience-copy">
          <h3 className="motion-card" data-edit-key="experience.title">
            {content.title}
          </h3>
          <p className="motion-card" data-edit-key="experience.intro">
            {content.intro}
          </p>

          <div className="contact-grid motion-card" data-edit-key="experience.contacts">
            {content.contacts.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>

          <div className="experience-stats" data-edit-key="experience.stats">
            {content.stats.map((stat) => (
              <article className="motion-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="timeline-list" data-edit-key="experience.timeline">
          {content.timeline.map((item, index) => (
            <article className="motion-card" key={`${item.company}-${item.period}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <time>{item.period}</time>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ content }) {
  const projectCards = content.cards.filter((project) => project.number !== "01");

  return (
    <section
      className="content-section projects-section scroll-section"
      id="projects"
      data-edit-group="projects"
    >
      <div className="site-container">
        <div className="section-heading project-heading">
          <span>{content.eyebrow}</span>
          <h2 className="section-title">{content.englishTitle}</h2>
          <p>{content.intro}</p>
        </div>

        {content.showcase && <CommercialShowcase content={content.showcase} />}

        <div className="project-stack" data-edit-key="projects.cards">
          {projectCards.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.number} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }) {
  if (project.kind === "agent-commerce") {
    return <AgentProjectCard project={project} index={index} />;
  }

  if (project.kind === "comfy-gallery") {
    return <ComfyProjectCard project={project} index={index} />;
  }

  return <DefaultProjectCard project={project} index={index} />;
}

function ProjectCardHeader({ project }) {
  return (
    <div className="project-card-header">
      <strong>{project.number}</strong>
      <span>{project.category}</span>
      <h3>{project.title}</h3>
      <a href="#contact">
        <span>Discuss</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

function DefaultProjectCard({ project, index }) {
  return (
    <article
      className="project-card motion-card"
      style={{ "--stack-index": index }}
    >
      <ProjectCardHeader project={project} />

      <div className="project-media-grid">
        {project.images.map((image, imageIndex) => (
          <div
            className={`project-media reveal-media media-${imageIndex + 1}`}
            key={image}
          >
            <img src={image} alt={`${project.title} ${imageIndex + 1}`} />
          </div>
        ))}
      </div>

      <ProjectCardFooter project={project} />
    </article>
  );
}

function ProjectCardFooter({ project }) {
  return (
    <div className="project-card-footer">
      <p>{project.description}</p>
      <div>
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}

function AgentProjectCard({ project, index }) {
  const [activeVideoId, setActiveVideoId] = useState(project.videos[0]?.id ?? "");
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [activeView, setActiveView] = useState({
    type: "panel",
    id: project.panels[0]?.title ?? ""
  });
  const activeVideo =
    project.videos.find((video) => video.id === activeVideoId) ?? project.videos[0];
  const activePanel = project.panels[activePanelIndex] ?? project.panels[0];
  const isVideoView = activeView.type === "video";

  return (
    <article
      className="project-card project-card-agent motion-card"
      style={{ "--stack-index": index }}
    >
      <ProjectCardHeader project={project} />

      <div className="agent-workbench">
        <GlassSurface
          className="agent-glass-console"
          width="100%"
          height="100%"
          borderRadius={28}
          backgroundOpacity={0.06}
          saturation={1.35}
          distortionScale={-120}
          redOffset={4}
          greenOffset={13}
          blueOffset={22}
        >
          <div className="agent-console-inner">
            <div className="agent-console-copy">
              <span>// Agent Console</span>
              <h4>一站式商品视频创作台</h4>
              <p>{project.description}</p>
            </div>

            <div className={`agent-video-stage ${isVideoView ? "is-video" : "is-image"}`}>
              {isVideoView && activeVideo?.video ? (
                <video
                  key={activeVideo.video}
                  src={activeVideo.video}
                  poster={activeVideo.poster}
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  className="agent-stage-image"
                  src={activePanel.image}
                  alt={activePanel.title}
                />
              )}
              <div>
                <span>{isVideoView ? activeVideo?.category : activePanel?.label}</span>
                <strong>{isVideoView ? activeVideo?.title : activePanel?.title}</strong>
              </div>
            </div>
          </div>
        </GlassSurface>

        <div className="agent-panel-column" aria-label="Agent一站式创作步骤">
          {project.panels.map((panel, panelIndex) => (
            <button
              className={`agent-panel-card${
                activeView.type === "panel" && panelIndex === activePanelIndex ? " is-active" : ""
              }`}
              type="button"
              key={panel.title}
              onClick={() => {
                setActivePanelIndex(panelIndex);
                setActiveView({ type: "panel", id: panel.title });
              }}
            >
              <img src={panel.image} alt={panel.title} />
              <span>{panel.label}</span>
              <strong>{panel.title}</strong>
            </button>
          ))}
        </div>

        <div className="agent-preview-panel">
          <img src={activePanel.image} alt={activePanel.title} />
          <div>
            <span>{activePanel.label}</span>
            <strong>{activePanel.title}</strong>
            <p>{activePanel.text}</p>
          </div>
        </div>

        <div className="agent-video-tabs" aria-label="电商AI视频选择">
          {project.videos.map((video) => (
            <button
              className={
                activeView.type === "video" && video.id === activeVideo?.id ? "is-active" : ""
              }
              type="button"
              key={video.id}
              onClick={() => {
                setActiveVideoId(video.id);
                setActiveView({ type: "video", id: video.id });
              }}
            >
              <Play size={15} aria-hidden="true" />
              <span>{video.title}</span>
            </button>
          ))}
        </div>
      </div>

      <ProjectCardFooter project={project} />
    </article>
  );
}

function ComfyProjectCard({ project, index }) {
  const [previewItem, setPreviewItem] = useState(null);
  const openGalleryItem = useMemo(
    () => (item) => {
      setPreviewItem({
        category: "ComfyUI Gallery",
        title: item.text,
        image: item.image
      });
    },
    []
  );

  return (
    <article
      className="project-card project-card-comfy motion-card"
      style={{ "--stack-index": index }}
    >
      <ProjectCardHeader project={project} />

      <div className="comfy-showcase-layout">
        <div className="comfy-video-strip" aria-label="阿里巴巴视频优先展示">
          {project.videos.map((video) => (
            <button
              className="comfy-video-card"
              type="button"
              key={video.id}
              onClick={() => setPreviewItem(video)}
            >
              <img src={video.poster} alt={video.title} />
              <span>{video.category}</span>
              <strong>{video.title}</strong>
              <em>
                <Maximize2 size={15} aria-hidden="true" />
                预览
              </em>
            </button>
          ))}
        </div>

        <div className="comfy-gallery-shell">
          <CircularGallery
            items={project.gallery}
            bend={3.4}
            textColor="#f7ffef"
            borderRadius={0.055}
            scrollSpeed={1.65}
            scrollEase={0.045}
            font="bold 28px Arial, sans-serif"
            onItemClick={openGalleryItem}
          />
        </div>
      </div>

      <ProjectCardFooter project={project} />

      {previewItem &&
        createPortal(
          <ShowcasePreview item={previewItem} onClose={() => setPreviewItem(null)} />,
          document.body
        )}
    </article>
  );
}

function CommercialShowcase({ content }) {
  const [storedEdits, setStoredEdits] = useState(() => loadShowcaseEdits());
  const [activeId, setActiveId] = useState(content.cases?.[0]?.id ?? "");
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewCase, setPreviewCase] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const videoRef = useRef(null);

  const showcaseItems = useMemo(
    () => mergeShowcaseItems(content.cases ?? [], storedEdits),
    [content.cases, storedEdits]
  );

  const activeItem =
    showcaseItems.find((item) => item.id === activeId) ??
    showcaseItems.find((item) => item.video) ??
    showcaseItems[0];
  const playableItems = showcaseItems.filter((item) => item.video);

  useEffect(() => {
    if (activeItem?.video) return;
    const firstPlayable = showcaseItems.find((item) => item.video);
    if (firstPlayable && firstPlayable.id !== activeId) {
      setActiveId(firstPlayable.id);
    }
  }, [activeId, activeItem?.video, showcaseItems]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeItem?.video) return;

    video.muted = false;
    video.volume = 1;
    video.pause();
    setIsPlaying(false);
  }, [activeItem?.video]);

  function selectCase(item) {
    if (!item.video) {
      return;
    }

    setActiveId(item.id);
    setIsPlaying(false);
  }

  function openPreview(item) {
    if (!item?.video) return;
    videoRef.current?.pause();
    setIsPlaying(false);
    setPreviewCase(item);
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!activeItem?.video || !video) return;

    video.muted = false;
    video.volume = 1;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function goToAdjacentCase(offset) {
    if (!playableItems.length) return;

    const activeIndex = Math.max(
      0,
      playableItems.findIndex((item) => item.id === activeItem?.id)
    );
    const nextIndex =
      (activeIndex + offset + playableItems.length) % playableItems.length;
    setActiveId(playableItems[nextIndex].id);
    setIsPlaying(false);
  }

  function saveCaseDraft(nextCase) {
    const nextEdits = {
      ...storedEdits,
      [nextCase.id]: {
        ...nextCase,
        isEmpty: !nextCase.video
      }
    };

    localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(nextEdits));
    setStoredEdits(nextEdits);
    setEditingCase(null);

    if (nextCase.video) {
      setActiveId(nextCase.id);
      setIsPlaying(false);
    }
  }

  function clearCaseDraft(caseId) {
    const nextEdits = { ...storedEdits };
    delete nextEdits[caseId];
    localStorage.setItem(SHOWCASE_STORAGE_KEY, JSON.stringify(nextEdits));
    setStoredEdits(nextEdits);
    setEditingCase(null);
  }

  return (
    <article
      className="commercial-showcase motion-card"
      data-edit-key="projects.showcase"
    >
      <div className="commercial-showcase-header">
        <strong>{content.number}</strong>
        <span>{content.eyebrow}</span>
        <div>
          <h3>{content.title}</h3>
          <p>{content.description}</p>
        </div>
      </div>

      <div className="commercial-stage">
        {activeItem?.video ? (
          <video
            key={activeItem.video}
            ref={videoRef}
            className="commercial-stage-video"
            src={activeItem.video}
            poster={activeItem.poster}
            loop
            playsInline
            preload="metadata"
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
          />
        ) : (
          <div className="commercial-stage-empty">
            <Clapperboard size={44} aria-hidden="true" />
            <span>选择下方作品卡片，再点击播放或全屏预览。</span>
          </div>
        )}

        <div className="commercial-stage-overlay" />

        {activeItem && (
          <div className="commercial-stage-info">
            <span>{activeItem.category}</span>
            <h4>{activeItem.title}</h4>
            <p>{activeItem.description}</p>
            <div className="commercial-stage-tags">
              {(activeItem.meta ?? []).map((tag) => (
                <em key={tag}>{tag}</em>
              ))}
            </div>
            {activeItem.video && (
              <button type="button" onClick={() => openPreview(activeItem)}>
                <Maximize2 size={18} aria-hidden="true" />
                <span>全屏预览</span>
              </button>
            )}
          </div>
        )}

        <div className="commercial-stage-controls" aria-label="视频播放控制">
          <button
            className="commercial-stage-arrow"
            type="button"
            onClick={() => goToAdjacentCase(-1)}
            aria-label="上一个视频"
          >
            <ChevronLeft size={28} aria-hidden="true" />
          </button>
          <button
            className="commercial-stage-play"
            type="button"
            onClick={togglePlayback}
            disabled={!activeItem?.video}
            aria-label={isPlaying ? "暂停当前视频" : "播放当前视频"}
          >
            {isPlaying ? (
              <Pause size={28} aria-hidden="true" />
            ) : (
              <Play size={28} aria-hidden="true" />
            )}
            <span>{isPlaying ? "暂停" : "播放"}</span>
          </button>
          <button
            className="commercial-stage-arrow"
            type="button"
            onClick={() => goToAdjacentCase(1)}
            aria-label="下一个视频"
          >
            <ChevronRight size={28} aria-hidden="true" />
          </button>
        </div>
      </div>

      <LogoLoop
        logos={showcaseItems}
        speed={86}
        hoverSpeed={0}
        fadeOut
        fadeOutColor="#050607"
        ariaLabel="AIGC商业落地视频案例封面流"
        className="commercial-loop"
        renderItem={(item) => (
          <CommercialThumb
            item={item}
            isActive={activeItem?.id === item.id}
            onSelect={() => selectCase(item)}
          />
        )}
      />

      {previewCase &&
        createPortal(
          <ShowcasePreview item={previewCase} onClose={() => setPreviewCase(null)} />,
          document.body
        )}

      {editingCase &&
        createPortal(
          <ShowcaseSlotEditor
            item={editingCase}
            onClear={() => clearCaseDraft(editingCase.id)}
            onClose={() => setEditingCase(null)}
            onSave={saveCaseDraft}
          />,
          document.body
        )}
    </article>
  );
}

function CommercialThumb({ item, isActive, onSelect }) {
  const isEmpty = !item.video;

  return (
    <button
      className={[
        "commercial-thumb",
        isActive ? "is-active" : "",
        isEmpty ? "is-empty" : ""
      ]
        .filter(Boolean)
        .join(" ")}
      type="button"
      onClick={onSelect}
    >
      <span className="commercial-thumb-media">
        {item.poster ? (
          <img src={item.poster} alt={item.title} />
        ) : (
          <span className="commercial-thumb-placeholder">
            <Clapperboard size={28} aria-hidden="true" />
          </span>
        )}
      </span>
      <span className="commercial-thumb-copy">
        <em>{item.category}</em>
        <strong>{item.title}</strong>
      </span>
    </button>
  );
}

function formatMediaTime(value) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function ShowcasePreview({ item, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const previewRef = useRef(null);
  const isVideo = Boolean(item.video);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.body.classList.add("is-media-preview-open");
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.classList.remove("is-media-preview-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setDuration(0);
    setCurrentTime(0);
    setIsPlaying(isVideo);
  }, [isVideo, item.video]);

  useEffect(() => {
    if (!isVideo) return;
    const video = previewRef.current;
    if (!video) return;

    video.muted = false;
    video.volume = 1;
    video.play().catch(() => setIsPlaying(false));
  }, [isVideo, item.video]);

  function togglePreviewPlayback() {
    const video = previewRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }

  function handleLoadedMetadata() {
    const video = previewRef.current;
    if (!video) return;
    setDuration(
      Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    );
    setCurrentTime(video.currentTime || 0);
  }

  function handleTimeUpdate() {
    const video = previewRef.current;
    if (!video) return;
    if (Number.isFinite(video.duration) && video.duration > 0) {
      setDuration(video.duration);
    }
    setCurrentTime(video.currentTime || 0);
  }

  function handleSeek(event) {
    const nextTime = Number(event.target.value);
    const video = previewRef.current;
    setCurrentTime(nextTime);
    if (video) {
      video.currentTime = nextTime;
    }
  }

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="showcase-preview" role="dialog" aria-modal="true">
      <button
        className="showcase-preview-close"
        type="button"
        onClick={onClose}
        aria-label="关闭全屏预览"
      >
        <X size={24} aria-hidden="true" />
        <span>退出预览</span>
      </button>
      <div className="showcase-preview-media">
        {isVideo ? (
          <video
            ref={previewRef}
            className="showcase-preview-video"
            src={item.video}
            poster={item.poster}
            autoPlay
            loop
            playsInline
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onLoadedData={handleLoadedMetadata}
            onDurationChange={handleLoadedMetadata}
            onCanPlay={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : (
          <img
            className="showcase-preview-image"
            src={item.image}
            alt={item.title}
          />
        )}
      </div>
      {isVideo && (
        <div className="showcase-preview-controls">
          <button
            className="showcase-preview-toggle"
            type="button"
            onClick={togglePreviewPlayback}
          >
            {isPlaying ? (
              <Pause size={24} aria-hidden="true" />
            ) : (
              <Play size={24} aria-hidden="true" />
            )}
            <span>{isPlaying ? "暂停播放" : "继续播放"}</span>
          </button>
          <label className="showcase-preview-progress">
            <span>{formatMediaTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.01"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              style={{ "--progress": `${progress}%` }}
              aria-label="视频播放进度"
            />
            <span>{formatMediaTime(duration)}</span>
          </label>
        </div>
      )}
      <div className="showcase-preview-caption">
        <span>{item.category}</span>
        <strong>{item.title}</strong>
      </div>
    </div>
  );
}

function ShowcaseSlotEditor({ item, onClear, onClose, onSave }) {
  const [draft, setDraft] = useState(() => ({
    ...item,
    metaText: (item.meta ?? []).join(", ")
  }));

  function updateDraft(key, value) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function submitDraft(event) {
    event.preventDefault();
    const { metaText, ...nextDraft } = draft;
    onSave({
      ...nextDraft,
      meta: metaText
        .split(/[,，、]/)
        .map((tag) => tag.trim())
        .filter(Boolean)
    });
  }

  return (
    <div className="slot-editor-modal" role="dialog" aria-modal="true">
      <form className="slot-editor-panel" onSubmit={submitDraft}>
        <header>
          <div>
            <span>编辑作品卡片</span>
            <p>填入 public 目录下的资源路径，例如 /assets/commercial/demo.mp4。</p>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭作品卡片编辑">
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <label>
          <span>标题</span>
          <input
            value={draft.title}
            onChange={(event) => updateDraft("title", event.target.value)}
          />
        </label>
        <label>
          <span>分类</span>
          <input
            value={draft.category}
            onChange={(event) => updateDraft("category", event.target.value)}
          />
        </label>
        <label>
          <span>封面路径</span>
          <input
            value={draft.poster}
            onChange={(event) => updateDraft("poster", event.target.value)}
            placeholder="/assets/commercial/your-cover.jpg"
          />
        </label>
        <label>
          <span>视频路径</span>
          <input
            value={draft.video}
            onChange={(event) => updateDraft("video", event.target.value)}
            placeholder="/assets/commercial/your-video.mp4"
          />
        </label>
        <label>
          <span>说明</span>
          <textarea
            value={draft.description}
            onChange={(event) => updateDraft("description", event.target.value)}
          />
        </label>
        <label>
          <span>标签</span>
          <input
            value={draft.metaText}
            onChange={(event) => updateDraft("metaText", event.target.value)}
            placeholder="商业交付、AIGC视频、后期"
          />
        </label>

        <footer>
          <button type="button" onClick={onClear}>
            清空此卡片
          </button>
          <button type="submit">
            <Save size={16} aria-hidden="true" />
            保存卡片
          </button>
        </footer>
      </form>
    </div>
  );
}

function AdvantagesSection({ content }) {
  const icons = [Workflow, BriefcaseBusiness, Layers3, BrainCircuit];

  return (
    <section
      className="content-section advantages-section scroll-section"
      id="advantages"
      data-edit-group="advantages"
    >
      <div className="site-container">
        <div className="section-heading">
          <span>{content.eyebrow}</span>
          <h2 className="section-title">{content.englishTitle}</h2>
          <p>{content.title}</p>
        </div>

        <div className="advantage-grid" data-edit-key="advantages.cards">
          {content.cards.map((card, index) => {
            const Icon = icons[index] ?? Sparkles;
            return (
              <article className="advantage-card motion-card" key={card.title}>
                <Icon size={34} aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ content, brand }) {
  return (
    <section
      className="contact-section scroll-section"
      id="contact"
      data-edit-group="contact"
    >
      <div className="site-container contact-layout">
        <div className="section-heading">
          <span>{content.eyebrow}</span>
          <h2 className="section-title">{content.englishTitle}</h2>
        </div>

        <div className="contact-main">
          <h2 data-edit-key="contact.title">{content.title}</h2>
          <p data-edit-key="contact.text">{content.text}</p>
          <a className="contact-cta" href={`mailto:${content.email}`}>
            <Mail size={20} aria-hidden="true" />
            <span>{content.buttonLabel}</span>
          </a>
        </div>

        <div className="contact-panel motion-card" data-edit-key="contact.details">
          <div>
            <Mail size={20} aria-hidden="true" />
            <span>{content.email}</span>
          </div>
          <div>
            <Phone size={20} aria-hidden="true" />
            <span>{content.phone}</span>
          </div>
          <div>
            <MapPin size={20} aria-hidden="true" />
            <span>{content.city}</span>
          </div>
          <strong>{brand.name}</strong>
          <em>{brand.role}</em>
        </div>
      </div>
    </section>
  );
}

function Magnetic({ children, className = "", strength = 18 }) {
  const ref = useRef(null);

  function handleMove(event) {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / strength;
    const y = (event.clientY - rect.top - rect.height / 2) / strength;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  function handleLeave() {
    const element = ref.current;
    if (!element) return;
    element.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div
      className={className}
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

function getHashTarget() {
  if (typeof window === "undefined") return "";

  const hash = window.location.hash.replace("#", "");
  const target = routeMap[hash] ?? hash;
  return siteSectionIds.has(target) ? target : "";
}

function useFloatingNav() {
  const [isFloating, setIsFloating] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsFloating(window.scrollY > window.innerHeight * 0.72);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return isFloating;
}

function useActiveHref(navItems) {
  const [activeHref, setActiveHref] = useState(() => {
    const target = getHashTarget();
    return `#${target || "hero"}`;
  });

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.target))
      .filter(Boolean);

    if (!sections.length) return undefined;

    const updateActiveSection = () => {
      const activationLine = Math.min(window.innerHeight * 0.38, 360);
      const current =
        sections
          .filter((section) => section.getBoundingClientRect().top <= activationLine)
          .at(-1) ?? sections[0];

      if (current?.id) {
        setActiveHref(`#${current.id}`);
      }
    };

    const syncHash = () => {
      const target = getHashTarget();
      if (target) {
        setActiveHref(`#${target}`);
        window.setTimeout(updateActiveSection, 1200);
        return;
      }

      updateActiveSection();
    };

    syncHash();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("hashchange", syncHash);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("hashchange", syncHash);
    };
  }, [navItems]);

  return activeHref;
}

function useOpeningMotion(stage) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (stage === "gate") {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.fromTo(
          ".gate-bg",
          { scale: 1.08, filter: "brightness(0.74) blur(8px)" },
          { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.45 }
        )
          .fromTo(
            ".opening-identity strong",
            { yPercent: 105, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.05 },
            "-=0.78"
          )
          .fromTo(
            ".opening-identity span",
            { x: -42, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9 },
            "-=0.56"
          );
      }

      if (stage === "entry") {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo(
          ".entry-bg",
          { scale: 1.12, opacity: 0, filter: "blur(18px)" },
          { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.18 }
        ).fromTo(
          ".entry-action",
          { y: 44, opacity: 0, clipPath: "inset(0 0 100% 0)" },
          { y: 0, opacity: 1, clipPath: "inset(0 0 0% 0)", duration: 0.92 },
          "-=0.44"
        );
      }
    });

    return () => ctx.revert();
  }, [stage]);
}

function usePortfolioMotion(scopeRef, content, skipInitialReveal) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;
    if (skipInitialReveal) {
      window.setTimeout(() => ScrollTrigger.refresh(), 160);
      return undefined;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .fromTo(".site-nav-shell", { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo(
          ".hero-kicker",
          { y: 30, opacity: 0, clipPath: "inset(0 100% 0 0)" },
          { y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.95 },
          "-=0.58"
        )
        .fromTo(
          ".hero-title-line",
          { yPercent: 112, scaleX: 0.72, opacity: 0, transformOrigin: "left center" },
          { yPercent: 0, scaleX: 1, opacity: 1, duration: 1.18, stagger: 0.12 },
          "-=0.48"
        )
        .fromTo(
          [".hero-summary", ".hero-actions", ".hero-tags", ".hero-visual"],
          { y: 58, opacity: 0, filter: "blur(14px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.09 },
          "-=0.64"
        )
        .fromTo(
          ".hero-metric",
          { y: 46, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.72, stagger: 0.08 },
          "-=0.58"
        );

      gsap.utils.toArray(".scroll-section").forEach((section) => {
        const title = section.querySelector(".section-title");
        const cards = section.querySelectorAll(".motion-card");
        const media = section.querySelectorAll(".reveal-media");

        if (title) {
          gsap.fromTo(
            title,
            { yPercent: 72, scaleX: 0.68, opacity: 0, transformOrigin: "left center" },
            {
              yPercent: 0,
              scaleX: 1,
              opacity: 1,
              duration: 1.18,
              ease: "expo.out",
              scrollTrigger: {
                trigger: section,
                start: "top 72%"
              }
            }
          );
        }

        if (media.length) {
          gsap.fromTo(
            media,
            { clipPath: "inset(0 100% 0 0)", scale: 1.08 },
            {
              clipPath: "inset(0 0% 0 0)",
              scale: 1,
              duration: 1.05,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: section,
                start: "top 76%"
              }
            }
          );
        }

        if (cards.length) {
          gsap.fromTo(
            cards,
            { y: 86, opacity: 0, filter: "blur(16px)" },
            {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 0.96,
              ease: "power3.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: section,
                start: "top 78%"
              }
            }
          );
        }
      });

      gsap.utils.toArray(".project-card").forEach((card, index) => {
        gsap.to(card, {
          scale: 1 - index * 0.025,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 22%",
            end: "bottom 18%",
            scrub: 0.8
          }
        });
      });

      gsap.utils.toArray(".project-media img, .experience-portrait img").forEach((image) => {
        gsap.to(image, {
          yPercent: -7,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        });
      });

      window.setTimeout(() => ScrollTrigger.refresh(), 420);
    }, scope);

    return () => ctx.revert();
  }, [scopeRef, content, skipInitialReveal]);
}

function normalizePortfolioContent(content) {
  const defaultShowcase = portfolioSite.projects?.showcase;
  const currentShowcase = content.projects?.showcase;

  if (!defaultShowcase || !currentShowcase) {
    return content;
  }

  return {
    ...content,
    projects: {
      ...content.projects,
      showcase: {
        ...currentShowcase,
        cases: mergeItemsById(
          defaultShowcase.cases ?? [],
          currentShowcase.cases ?? []
        ),
        emptySlots: mergeItemsById(
          defaultShowcase.emptySlots ?? [],
          currentShowcase.emptySlots ?? []
        )
      }
    }
  };
}

function mergeItemsById(defaultItems, currentItems) {
  const itemsById = new Map();

  defaultItems.forEach((item) => {
    itemsById.set(item.id, item);
  });

  currentItems.forEach((item) => {
    itemsById.set(item.id, {
      ...(itemsById.get(item.id) ?? {}),
      ...item
    });
  });

  return Array.from(itemsById.values());
}

function loadShowcaseEdits() {
  try {
    return JSON.parse(localStorage.getItem(SHOWCASE_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function mergeShowcaseItems(items, edits) {
  return items.map((item) => {
    const edit = edits[item.id];

    if (!edit) {
      return item;
    }

    const mergedItem = {
      ...item,
      ...edit,
      isEmpty: !edit.video
    };

    const legacyPoster = item.poster?.endsWith(".webp")
      ? item.poster.replace(/\.webp$/, ".png")
      : "";
    if (edit.poster === legacyPoster) {
      mergedItem.poster = item.poster;
    }

    return mergedItem;
  });
}

export default App;
