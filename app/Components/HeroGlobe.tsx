'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Color,
  ExtrudeGeometry,
  Mesh,
  MeshStandardMaterial,
  Shape,
} from 'three';
import Globe, { type GlobeMethods } from 'react-globe.gl';

/** ლოკალური ტექსტურა — სწრაფი ჩატვირთვა (არ ელოდება unpkg-ს) */
const NIGHT_EARTH = '/earth-night.jpg';

/** თბილისი — ჩამოტანის დანიშნულება */
const TBILISI = { lat: 41.7151, lng: 44.8271 };

/**
 * სანქტ-პეტერბურგი, პროსპექტ ვეტერანოვი 173, კ7 ს1 — დაახლოებითი კოორდინატები (გულის მარკერი).
 */
const ST_PETERSBURG_VETERANOV = { lat: 59.8439, lng: 30.2486 };

/**
 * იგივე ქვეყნები რაც Hero-ში ფლაგების სია (GB, US, CN, IT, GR, ES, FR, DE, TR).
 * წერტილი = ქვეყნის სავაჭრო/ლოგისტიკური ცენტრი (დედაქალაქი ან მთავარი ჰაბი).
 */
const ORIGIN_HUBS = [
  { code: 'GB', name: 'London', lat: 51.5074, lng: -0.1278 },
  { code: 'US', name: 'New York', lat: 40.7128, lng: -74.006 },
  { code: 'CN', name: 'Beijing', lat: 39.9042, lng: 116.4074 },
  { code: 'IT', name: 'Rome', lat: 41.9028, lng: 12.4964 },
  { code: 'GR', name: 'Athens', lat: 37.9838, lng: 23.7275 },
  { code: 'ES', name: 'Madrid', lat: 40.4168, lng: -3.7038 },
  { code: 'FR', name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { code: 'DE', name: 'Berlin', lat: 52.52, lng: 13.405 },
  { code: 'TR', name: 'Istanbul', lat: 41.0082, lng: 28.9784 },
] as const;

/**
 * დამატებითი რეგიონები — პატარა „ქალაქის ნათებები“ მთელ მსოფლიოზე (არ ემთხვევა ხაზების ჰაბებს).
 */
const WORLD_AMBIENT_HUBS = [
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832 },
  { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816 },
  { name: 'Bogotá', lat: 4.711, lng: -74.0721 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'Seoul', lat: 37.5665, lng: 126.978 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
  { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
  { name: 'Lagos', lat: 6.5244, lng: 3.3792 },
  { name: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
  { name: 'Moscow', lat: 55.7558, lng: 37.6173 },
  { name: 'Warsaw', lat: 52.2297, lng: 21.0122 },
  { name: 'Amsterdam', lat: 52.3676, lng: 4.9041 },
  { name: 'Stockholm', lat: 59.3293, lng: 18.0686 },
  { name: 'Oslo', lat: 59.9139, lng: 10.7522 },
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384 },
  { name: 'Copenhagen', lat: 55.6761, lng: 12.5683 },
  { name: 'Dublin', lat: 53.3498, lng: -6.2603 },
  { name: 'Lisbon', lat: 38.7223, lng: -9.1393 },
  { name: 'Vienna', lat: 48.2082, lng: 16.3738 },
  { name: 'Prague', lat: 50.0755, lng: 14.4378 },
  { name: 'Budapest', lat: 47.4979, lng: 19.0402 },
  { name: 'Bucharest', lat: 44.4268, lng: 26.1025 },
  { name: 'Kyiv', lat: 50.4501, lng: 30.5234 },
  { name: 'Almaty', lat: 43.222, lng: 76.8512 },
  { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
  { name: 'Dhaka', lat: 23.8103, lng: 90.4125 },
  { name: 'Manila', lat: 14.5995, lng: 120.9842 },
  { name: 'Ho Chi Minh City', lat: 10.8231, lng: 106.6297 },
  { name: 'Hanoi', lat: 21.0285, lng: 105.8542 },
  { name: 'Kuala Lumpur', lat: 3.139, lng: 101.6869 },
  { name: 'Nairobi', lat: -1.2921, lng: 36.8219 },
  { name: 'Kinshasa', lat: -4.4419, lng: 15.2663 },
  { name: 'Casablanca', lat: 33.5731, lng: -7.5898 },
  { name: 'Lima', lat: -12.0464, lng: -77.0428 },
  { name: 'Santiago', lat: -33.4489, lng: -70.6693 },
  { name: 'Auckland', lat: -36.8485, lng: 174.7633 },
] as const;

const ARCS = ORIGIN_HUBS.map((hub, i) => ({
  startLat: hub.lat,
  startLng: hub.lng,
  endLat: TBILISI.lat,
  endLng: TBILISI.lng,
  /** ანიმაციის ფაზის განსხვავება */
  gap: (i + 1) * 0.09,
}));

/** ძლიერი ნათება ჰაბებზე + თბილისი — ზომა/ტიპი */
const GLOW_VOXELS = [
  ...ORIGIN_HUBS.map(() => ({
    kind: 'warm' as const,
    r: 0.26,
  })),
  { kind: 'cool' as const, r: 0.4 },
] as const;

/** ხუთქიმიანი ვარსკვლავი (XY სიბრტყე, ოდნავი სისქე Z-ზე) — ერთი გეომეტრია ყველა მარკერზე */
function createStarExtrudeGeometry(): ExtrudeGeometry {
  const spikes = 5;
  const outer = 0.5;
  const inner = 0.2;
  const shape = new Shape();
  for (let i = 0; i < spikes * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth: 0.07,
    bevelEnabled: false,
  });
  geo.center();
  return geo;
}

const STAR_GEO = createStarExtrudeGeometry();

/** გული (პარამეტრული მრუდი, XY + Extrude) */
function createHeartExtrudeGeometry(): ExtrudeGeometry {
  const shape = new Shape();
  const steps = 48;
  const scale = 0.018;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x =
      16 * Math.pow(Math.sin(t), 3);
    const y = -(
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t)
    );
    const sx = x * scale;
    const sy = y * scale;
    if (i === 0) shape.moveTo(sx, sy);
    else shape.lineTo(sx, sy);
  }
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.center();
  return geo;
}

const HEART_GEO = createHeartExtrudeGeometry();

/** მთავარი ფერი: #fffcbe — ნათელი ემისია bloom-ისთვის */
const LIGHT_HEX = 0xfffcbe;

const STAR_MAT_WARM = new MeshStandardMaterial({
  color: LIGHT_HEX,
  emissive: LIGHT_HEX,
  emissiveIntensity: 1.28,
  metalness: 0.04,
  roughness: 0.4,
});
/** თბილისი — ოდნავ ცივი აქცენტი, იგივე ვარსკვლავის ფორმა */
const STAR_MAT_COOL = new MeshStandardMaterial({
  color: 0xe8f2ff,
  emissive: 0xc5ddff,
  emissiveIntensity: 1.32,
  metalness: 0.04,
  roughness: 0.36,
});

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rand: () => number, sigma: number) {
  const u1 = Math.max(rand(), Number.EPSILON);
  const u2 = rand();
  const z0 =
    Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * sigma;
}

function clampLatLng(lat: number, lng: number) {
  return {
    lat: Math.max(-85, Math.min(85, lat)),
    lng: ((((lng + 180) % 360) + 360) % 360) - 180,
  };
}

type VoxelKind = 'warm' | 'cool' | 'heart';

type LightPoint = {
  lat: number;
  lng: number;
  r: number;
  alt: number;
  kind: VoxelKind;
};

/**
 * სატელიტის ღამის სურათის მსგავსი: მკვრივი კლასტერები ჰაბებთან, წყვილი „ხაზოვანი“ ნათება,
 * უფრო იშვიათი წერტილები სხვა რეგიონებში.
 */
function buildNightCityLights(seed: number): LightPoint[] {
  const rand = mulberry32(seed);
  const out: LightPoint[] = [];

  const addCluster = (
    lat: number,
    lng: number,
    count: number,
    spread: number,
    keep: number,
    opts?: { small?: boolean },
  ) => {
    const small = opts?.small;
    for (let i = 0; i < count; i++) {
      if (rand() > keep) continue;
      const { lat: la, lng: ln } = clampLatLng(
        lat + gaussian(rand, spread),
        lng + gaussian(rand, spread * 1.15) / Math.max(0.35, Math.cos((lat * Math.PI) / 180)),
      );
      const bright = rand() > 0.86;
      const baseR = small
        ? 0.03 + rand() * 0.085
        : 0.045 + rand() * 0.14;
      const brightBoost = small ? (bright ? 0.07 : 0) : bright ? 0.12 : 0;
      out.push({
        lat: la,
        lng: ln,
        kind: 'warm',
        r: baseR + brightBoost,
        alt: 0.004 + rand() * 0.002,
      });
    }
  };

  ORIGIN_HUBS.forEach((hub) => addCluster(hub.lat, hub.lng, 48, 0.42, 0.52));
  addCluster(TBILISI.lat, TBILISI.lng, 62, 0.38, 0.58);

  /** სხვადასხვა ქვეყნებზე უფრო წვრილი, მსოფლიო ქალაქის ტიპის ნათებები */
  WORLD_AMBIENT_HUBS.forEach((hub) =>
    addCluster(hub.lat, hub.lng, 30, 0.38, 0.54, { small: true }),
  );

  const addDashStreaks = (
    hubs: readonly { lat: number; lng: number }[],
    nSegRange: [number, number],
    lenScale: number,
    stepRange: [number, number],
    rScale: number,
  ) => {
    const [nSegLo, nSegHi] = nSegRange;
    const [stepLo, stepHi] = stepRange;
    hubs.forEach((hub) => {
      const nSeg = nSegLo + Math.floor(rand() * (nSegHi - nSegLo + 1));
      for (let s = 0; s < nSeg; s++) {
        const bearing = rand() * Math.PI * 2;
        const len = (0.06 + rand() * 0.22) * lenScale;
        const steps = stepLo + Math.floor(rand() * (stepHi - stepLo + 1));
        const latScale = Math.cos(bearing) * 0.12;
        const lngScale =
          (Math.sin(bearing) * 0.12) /
          Math.max(0.25, Math.cos((hub.lat * Math.PI) / 180));
        for (let k = 0; k < steps; k++) {
          const t = k / Math.max(1, steps - 1);
          const { lat: la, lng: ln } = clampLatLng(
            hub.lat + len * t * latScale + gaussian(rand, 0.015),
            hub.lng + len * t * lngScale + gaussian(rand, 0.015),
          );
          out.push({
            lat: la,
            lng: ln,
            kind: 'warm',
            r: (0.038 + rand() * 0.085) * rScale,
            alt: 0.0035 + rand() * 0.002,
          });
        }
      }
    });
  };

  /** ლოგისტიკური ჰაბები + თბილისი — უფრო სრული „ქალაქის“ ხაზები */
  addDashStreaks(
    [...ORIGIN_HUBS.map((h) => ({ lat: h.lat, lng: h.lng })), TBILISI],
    [3, 7],
    1,
    [3, 7],
    1,
  );

  /** დანარჩენი მსოფლიო — იგივე ეფექტი სხვა ქვეყნებში, ოდნავ მსუბუქად */
  addDashStreaks(WORLD_AMBIENT_HUBS, [1, 3], 0.75, [2, 5], 1.05);

  for (let i = 0; i < 520; i++) {
    if (rand() > 0.26) continue;
    const { lat: la, lng: ln } = clampLatLng(
      (rand() - 0.5) * 160,
      (rand() - 0.5) * 340,
    );
    out.push({
      lat: la,
      lng: ln,
      kind: 'warm',
      r: 0.034 + rand() * 0.105,
      alt: 0.003 + rand() * 0.002,
    });
  }

  return out;
}

export default function HeroGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  /** საწყისი 800×800 კანვასი ვიწრო სვეტს სცდებოდა */
  const [dims, setDims] = useState(() => {
    if (typeof window === 'undefined') return { width: 0, height: 0 };
    const w = Math.max(200, Math.floor(window.innerWidth * 0.36));
    const h = Math.max(360, window.innerHeight);
    return { width: w, height: h };
  });

  const arcsData = useMemo(() => ARCS, []);
  const objectsData = useMemo(() => {
    const ambient = buildNightCityLights(0x4b1e4c);
    const key = ORIGIN_HUBS.map((hub, i) => ({
      lat: hub.lat,
      lng: hub.lng,
      alt: 0.0065,
      r: GLOW_VOXELS[i]!.r,
      kind: GLOW_VOXELS[i]!.kind,
    }));
    const tbilisiVoxel = GLOW_VOXELS[GLOW_VOXELS.length - 1]!;
    return [
      ...ambient,
      ...key,
      {
        lat: TBILISI.lat,
        lng: TBILISI.lng,
        alt: 0.0065,
        r: tbilisiVoxel.r,
        kind: tbilisiVoxel.kind,
      },
      {
        lat: ST_PETERSBURG_VETERANOV.lat,
        lng: ST_PETERSBURG_VETERANOV.lng,
        alt: 0.0072,
        r: 0.34,
        kind: 'heart' as const,
      },
    ];
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.clientWidth;
    const h = el.clientHeight;
    if (w > 0 && h > 0) setDims({ width: w, height: h });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w > 0 && h > 0) setDims({ width: w, height: h });
    };

    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full min-h-0 w-full min-w-0 overflow-hidden bg-transparent -translate-y-6 cursor-grab select-none active:cursor-grabbing sm:-translate-y-8 md:-translate-y-10 lg:translate-y-0 [&_canvas]:max-h-full [&_canvas]:max-w-full [&_canvas]:bg-transparent [&_canvas]:cursor-grab [&_canvas]:active:cursor-grabbing"
    >
      {dims.width > 0 && dims.height > 0 && (
        <div className="relative z-[1] h-full min-h-0 w-full min-w-0">
      <Globe
        ref={globeRef}
        width={dims.width}
        height={dims.height}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ antialias: true, alpha: true }}
        globeImageUrl={NIGHT_EARTH}
        showGraticules={false}
        showAtmosphere={false}
        arcsData={arcsData}
        arcColor={() => 'rgba(255, 236, 200, 0.78)'}
        arcAltitude={0.32}
        objectsData={objectsData}
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectFacesSurfaces
        objectThreeObject={(d) => {
          const p = d as LightPoint;
          const isHeart = p.kind === 'heart';
          const mesh = new Mesh(
            isHeart ? HEART_GEO : STAR_GEO,
            p.kind === 'cool' ? STAR_MAT_COOL : STAR_MAT_WARM,
          );
          mesh.scale.setScalar(p.r * (isHeart ? 5.1 : 5.4));
          return mesh;
        }}
        arcStroke={0.52}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashInitialGap={(d) => (d as { gap: number }).gap}
        arcDashAnimateTime={4000}
        enablePointerInteraction
        showPointerCursor={false}
        onGlobeReady={() => {
          const g = globeRef.current;
          if (!g) return;
          const scene = g.scene();
          scene.background = null;

          const renderer = g.renderer();
          renderer.setClearColor(new Color(0x000000), 0);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

          const c = g.controls();
          c.autoRotate = false;
          c.enableZoom = true;
          c.zoomSpeed = 0.85;
          c.enablePan = false;
          c.enableRotate = true;
          c.enableDamping = true;
          c.dampingFactor = 0.08;
          g.pointOfView({ lat: 22, lng: 52, altitude: 2.85 }, 0);
        }}
      />
        </div>
      )}
    </div>
  );
}
