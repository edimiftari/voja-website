/* ==========================================================================
   VOJA STUDIO · PROJECTS
   This is the only file you need to edit to change the work on the site.
   ADD-YOUR-WORK.md explains it step by step.

   For each project:
   - id           short name with no spaces, used in the link (vojastudio.com/#p-amber-bottle)
                  and as the folder name: projects/<id>/
   - title        project name
   - category     one of: "3D Animation", "3D Modeling", "Motion", "Packaging", "Branding", "Architecture"
                  (the homepage groups the work by category, in that order)
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
                  Several sliders on one page? Use a list: compare: [ {...}, {...} ]
                  With two videos (wireframe as "before", render as "after") both play together, frame-locked;
                  only the render plays sound, via the speaker button in the corner. Same length, fps and size.
   - placeholder  the drawn stand-in shown until you add a cover (you can ignore it)

   The order of the list is the order on the site.
   ========================================================================== */

window.VOJA_PROJECTS = [
  {
    id: "fire-hydrant",
    title: "Fire hydrant",
    category: "3D Animation",
    year: 2024,
    size: "large",
    client: "Personal project",
    role: "Modelling, look dev, animation",
    tools: "Blender, EEVEE, After Effects",
    description: "A street fire hydrant modelled and animated in Blender, rendered in EEVEE. Drag the slider to see the wireframe underneath the final render.",
    cover: "projects/fire-hydrant/cover.jpg",
    loop: "projects/fire-hydrant/render.mp4",
    youtube: "",
    media: [],
    compare: {
      before: "projects/fire-hydrant/wireframe.mp4",   // always muted
      after: "projects/fire-hydrant/render.mp4",       // the only sound
      labels: ["Wireframe", "Render"]
    },
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "zeno-pouches",
    title: "ZENO pouch tin",
    category: "3D Modeling",
    year: 2024,
    size: "large",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "Product visualisation of a nicotine pouch tin, modelled down to the lid clip and the soft pouches inside. Drag the sliders to see the wireframe under each render.",
    cover: "projects/zeno-pouches/render.jpg",
    youtube: "",
    media: [],
    compare: [
      { before: "projects/zeno-pouches/wireframe.jpg", after: "projects/zeno-pouches/render.jpg", labels: ["Wireframe", "Render"] },
      { before: "projects/zeno-pouches/wireframe-top.jpg", after: "projects/zeno-pouches/render-top.jpg", labels: ["Wireframe", "Render"] }
    ],
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "mango-juice",
    title: "Mango juice carton",
    category: "3D Modeling",
    year: 2024,
    size: "small",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "A one-litre juice carton with condensation droplets and a bed of mangoes, built for a packshot. Drag the slider to see the wireframe underneath.",
    cover: "projects/mango-juice/render.jpg",
    youtube: "",
    media: [],
    compare: { before: "projects/mango-juice/wireframe.jpg", after: "projects/mango-juice/render.jpg", labels: ["Wireframe", "Render"] },
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "tallow-cream",
    title: "Whipped tallow cream jar",
    category: "3D Modeling",
    year: 2024,
    size: "medium",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "An amber glass jar with a piped swirl of whipped cream, modelled and lit for e-commerce. Drag the slider to see the wireframe underneath.",
    cover: "projects/tallow-cream/render.jpg",
    youtube: "",
    media: [],
    compare: { before: "projects/tallow-cream/wireframe.jpg", after: "projects/tallow-cream/render.jpg", labels: ["Wireframe", "Render"] },
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "lavender-balm",
    title: "Lavender balm tin",
    category: "3D Modeling",
    year: 2024,
    size: "medium",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "A screw-top aluminium tin and its label, rendered as a soft studio packshot. Drag the slider to see the wireframe underneath.",
    cover: "projects/lavender-balm/render.jpg",
    youtube: "",
    media: [],
    compare: { before: "projects/lavender-balm/wireframe.jpg", after: "projects/lavender-balm/render.jpg", labels: ["Wireframe", "Render"] },
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "lavender-jar",
    title: "Lavender cream jar",
    category: "3D Modeling",
    year: 2024,
    size: "small",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "A green glass jar with a whipped lavender cream and a ribbed metal lid. Drag the slider to see the wireframe underneath.",
    cover: "projects/lavender-jar/render.jpg",
    youtube: "",
    media: [],
    compare: { before: "projects/lavender-jar/wireframe.jpg", after: "projects/lavender-jar/render.jpg", labels: ["Wireframe", "Render"] },
    placeholder: { scene: "bottle", tone: "azure" }
  },
  {
    id: "waste-bin",
    title: "Steel waste bin",
    category: "3D Modeling",
    year: 2024,
    size: "small",
    client: "Client work",
    role: "Modelling, look dev, lighting, rendering",
    tools: "Blender",
    description: "A brushed steel waste bin placed in an interior scene, showing how the product sits in a real space. Drag the slider to see the wireframe underneath.",
    cover: "projects/waste-bin/render.jpg",
    youtube: "",
    media: [],
    compare: { before: "projects/waste-bin/wireframe.jpg", after: "projects/waste-bin/render.jpg", labels: ["Wireframe", "Render"] },
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
    category: "3D Modeling",
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
