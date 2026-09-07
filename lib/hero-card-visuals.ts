/**
 * Hero journey cards — grid texture + StatusStrip defaults.
 * Lives under `lib/` so UI components stay free of loose config modules.
 */

/** Public path (served from `public/images/`). */
export const HERO_CARD_GRID_IMAGE_URL = "/images/hero-card-grid.png";

/** Very subtle grid on white; raise slightly if it disappears on your monitor. */
export const HERO_CARD_GRID_OVERLAY_OPACITY = 0.8;

/** Match the PNG tile size for seamless `repeat` (update if asset dimensions change). */
export const HERO_CARD_GRID_BACKGROUND_SIZE_PX = 354;

/** Default StatusStrip gradient (native parity). */
export const STATUS_STRIP_DEFAULT_GRADIENT_COLORS: readonly [string, string] = ["#016626", "#16A34A"];
