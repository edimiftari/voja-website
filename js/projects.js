/* ==========================================================================
   VOJA STUDIO · PROJECTS
   This is the only file you need to edit to change the work on the site.
   ADD-YOUR-WORK.md explains it step by step.

   For each project:
   - id           short name with no spaces, used in the link (vojastudio.com/#p-amber-bottle)
                  and as the folder name: projects/<id>/
   - title        project name
   - category     one of: "3D", "Motion", "Packaging", "Branding", "Architecture"
   - year         e.g. 2026
   - size         width on the homepage grid: "large", "medium" or "small"
   - client, role, tools, description   text shown on the project page
   - cover        homepage image, e.g. "projects/amber-bottle/cover.jpg"
                  (a short muted .mp4 loop also works). Leave "" for a placeholder.
   - media        images and videos on the project page, in order:
                    "projects/amber-bottle/01.jpg"                 half width
                    { src: "projects/amber-bottle/02.jpg", wide: true }   full width
                    { src: "projects/amber-bottle/film.mp4", wide: true } video
   - youtube      paste the YouTube link, e.g. "https://youtu.be/AbC123xyz45".
                  Shown at the top of the project page. Several videos? Use a list:
                    youtube: ["https://youtu.be/...", "https://www.youtube.com/watch?v=..."]
                  With no cover, the homepage card uses the video's YouTube thumbnail
                  and gets a small play button.
                  YouTube links also work inside media, so you can mix them with images:
                    media: ["projects/orb/01.jpg", "https://youtu.be/AbC123xyz45"]
   - vimeo        optional Vimeo video number (vimeo.com/123456789 -> "123456789")
   - loop         optional short muted video (.mp4) that plays when the cover "hatches" open on hover,
                  e.g. loop: "projects/orb/loop.mp4"
   - compare      optional before / after slider at the top of the project page:
                    compare: { before: "projects/pavilion/clay.jpg", after: "projects/pavilion/final.jpg", labels: ["Clay", "Final"] }
                  (labels are optional; "demo" shows a placeholder version)
   - placeholder  the drawn stand-in shown until you add a cover (you can ignore it)

   The order of the list is the order on the site.
   ========================================================================== */

window.VOJA_PROJECTS = [
  {
    id: "amber-bottle",
    title: "Amber fragrance bottle",
    category: "3D",
    year: 2026,
    size: "large",
    client: "Placeholder client",
    role: "Modelling, lighting, render",
    tools: "Blender, Cycles",
    description: "Product renders for a small-batch fragrance. Glass, liquid and a single hard key light.",
    cover: "",
    youtube: "",
    media: [],
    compare: "demo",
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "fold-box",
    title: "Fold tea packaging",
    category: "Packaging",
    year: 2025,
    size: "small",
    client: "Placeholder client",
    role: "Structure, dieline, print",
    tools: "Illustrator, ArtiosCAD",
    description: "A one-piece folding carton with no glue, printed in two colours on uncoated board.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "box", tone: "ginger" }
  },
  {
    id: "loop-01",
    title: "Loop 01 brand motion",
    category: "Motion",
    year: 2026,
    size: "small",
    client: "Placeholder client",
    role: "Concept, animation",
    tools: "Cinema 4D, After Effects",
    description: "A ten-second seamless loop for a brand launch, built from three primitives and one camera move.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "rings", tone: "charcoal" }
  },
  {
    id: "pavilion",
    title: "Courtyard pavilion",
    category: "Architecture",
    year: 2024,
    size: "small",
    client: "Placeholder client",
    role: "Archviz, lighting study",
    tools: "Rhino, Blender",
    description: "Visualisation of a small timber pavilion, studied through the day from morning to dusk.",
    cover: "",
    youtube: "",
    media: [],
    compare: "demo",
    placeholder: { scene: "arch", tone: "parchment" }
  },
  {
    id: "grid-posters",
    title: "Grid poster series",
    category: "Branding",
    year: 2025,
    size: "small",
    client: "Self-initiated",
    role: "Design, print",
    tools: "InDesign",
    description: "Five posters set on one modular grid, screen-printed in charcoal and one spot colour.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "poster", tone: "azure" }
  },
  {
    id: "orb",
    title: "Orb speaker launch",
    category: "Motion",
    year: 2026,
    size: "medium",
    client: "Placeholder client",
    role: "Animation, simulation",
    tools: "Houdini, Redshift",
    description: "Launch film for a spherical speaker. Fabric simulation and a slow orbital camera.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "sphere", tone: "ginger" }
  },
  {
    id: "pantry",
    title: "Pantry jar labels",
    category: "Packaging",
    year: 2024,
    size: "medium",
    client: "Placeholder client",
    role: "Label design, mockups",
    tools: "Illustrator, Blender",
    description: "Label system for a range of eight preserves, with one shared layout and a colour per flavour.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "jars", tone: "parchment" }
  },
  {
    id: "stair",
    title: "Stair study",
    category: "3D",
    year: 2025,
    size: "small",
    client: "Self-initiated",
    role: "Everything",
    tools: "Blender",
    description: "An ongoing series of still lifes about steps, light and shadow, one render a week.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "stairs", tone: "charcoal" }
  },
  {
    id: "mono-id",
    title: "Mono ceramics identity",
    category: "Branding",
    year: 2026,
    size: "large",
    client: "Placeholder client",
    role: "Identity, print",
    tools: "Illustrator",
    description: "Identity for a ceramic workshop: a mark drawn from a potter's wheel section, with stationery and signage.",
    cover: "",
    youtube: "",
    media: [],
    placeholder: { scene: "mark", tone: "azure" }
  }
];
