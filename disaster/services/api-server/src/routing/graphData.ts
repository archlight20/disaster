import { RoadNode, RoadEdge } from '../server';
import { PRECOMPUTED_ROAD_EDGES } from './roadGeometryData';

export const SECTOR_4_NODES: RoadNode[] = [
  { id: 'node-south-entry', name: 'South Gate (Main Entry)', lat: 12.9600, lng: 77.5900, type: 'CHECKPOINT' },
  { id: 'node-coastal-jct', name: 'Coastal Junction', lat: 12.9650, lng: 77.5900, type: 'INTERSECTION' },
  { id: 'node-bridge-b12', name: 'Bridge B12 Approach', lat: 12.9716, lng: 77.5946, type: 'INTERSECTION' },
  { id: 'node-east-express', name: 'East Sector Bypass', lat: 12.9680, lng: 77.6050, type: 'INTERSECTION' },
  { id: 'node-shelter-alpha', name: 'Central High Shelter', lat: 12.9785, lng: 77.5980, type: 'SHELTER' },
  { id: 'node-hospital-main', name: 'Sector Memorial Hospital', lat: 12.9750, lng: 77.6020, type: 'HOSPITAL' },
  { id: 'node-west-ring', name: 'West Perimeter Ring', lat: 12.9720, lng: 77.5860, type: 'INTERSECTION' },
  { id: 'node-north-basin', name: 'North River Basin Waypoint', lat: 12.9810, lng: 77.5910, type: 'WAYPOINT' },
  { id: 'node-northeast-gate', name: 'Northeast Gate', lat: 12.9830, lng: 77.6050, type: 'CHECKPOINT' },
];

export const SECTOR_4_EDGES: RoadEdge[] = [
  // Edge 1: South Entry -> Coastal Junction (Coastal Road C05)
  {
    id: 'edge-c05-south',
    source: 'node-south-entry',
    target: 'node-coastal-jct',
    roadName: 'Coastal Road C05 (South Segment)',
    distanceKm: 0.6,
    baseSpeedKmh: 40,
    entityId: 'road-c05',
    coordinates: [
      { lat: 12.9600, lng: 77.5900 },
      { lat: 12.9625, lng: 77.5898 },
      { lat: 12.9650, lng: 77.5900 },
    ],
  },
  // Edge 2: Coastal Junction -> Bridge B12 Approach
  {
    id: 'edge-coastal-b12',
    source: 'node-coastal-jct',
    target: 'node-bridge-b12',
    roadName: 'Central Boulevard',
    distanceKm: 0.9,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 12.9650, lng: 77.5900 },
      { lat: 12.9680, lng: 77.5920 },
      { lat: 12.9716, lng: 77.5946 },
    ],
  },
  // Edge 3: Bridge B12 Crossing (Bridge B12)
  {
    id: 'edge-bridge-b12',
    source: 'node-bridge-b12',
    target: 'node-shelter-alpha',
    roadName: 'Bridge B12 Main Span',
    distanceKm: 0.8,
    baseSpeedKmh: 35,
    entityId: 'road-b12',
    coordinates: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9750, lng: 77.5960 },
      { lat: 12.9785, lng: 77.5980 },
    ],
  },
  // Edge 4: South Entry -> East Bypass
  {
    id: 'edge-south-east',
    source: 'node-south-entry',
    target: 'node-east-express',
    roadName: 'Southern Sector Ring Road',
    distanceKm: 1.8,
    baseSpeedKmh: 60,
    coordinates: [
      { lat: 12.9600, lng: 77.5900 },
      { lat: 12.9620, lng: 77.5980 },
      { lat: 12.9680, lng: 77.6050 },
    ],
  },
  // Edge 5: East Bypass -> Sector Hospital
  {
    id: 'edge-east-hospital',
    source: 'node-east-express',
    target: 'node-hospital-main',
    roadName: 'East Emergency Access',
    distanceKm: 0.9,
    baseSpeedKmh: 50,
    coordinates: [
      { lat: 12.9680, lng: 77.6050 },
      { lat: 12.9710, lng: 77.6035 },
      { lat: 12.9750, lng: 77.6020 },
    ],
  },
  // Edge 6: Sector Hospital -> Central Shelter
  {
    id: 'edge-hospital-shelter',
    source: 'node-hospital-main',
    target: 'node-shelter-alpha',
    roadName: 'Hospital Link Corridor',
    distanceKm: 0.6,
    baseSpeedKmh: 40,
    coordinates: [
      { lat: 12.9750, lng: 77.6020 },
      { lat: 12.9770, lng: 77.6000 },
      { lat: 12.9785, lng: 77.5980 },
    ],
  },
  // Edge 7: South Entry -> West Perimeter
  {
    id: 'edge-south-west',
    source: 'node-south-entry',
    target: 'node-west-ring',
    roadName: 'West Perimeter Bypass',
    distanceKm: 1.4,
    baseSpeedKmh: 55,
    coordinates: [
      { lat: 12.9600, lng: 77.5900 },
      { lat: 12.9660, lng: 77.5870 },
      { lat: 12.9720, lng: 77.5860 },
    ],
  },
  // Edge 8: West Perimeter -> North River Basin Waypoint
  {
    id: 'edge-west-north',
    source: 'node-west-ring',
    target: 'node-north-basin',
    roadName: 'Riverbank Causeway',
    distanceKm: 1.1,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 12.9720, lng: 77.5860 },
      { lat: 12.9760, lng: 77.5880 },
      { lat: 12.9810, lng: 77.5910 },
    ],
  },
  // Edge 9: North River Basin -> Central Shelter
  {
    id: 'edge-north-shelter',
    source: 'node-north-basin',
    target: 'node-shelter-alpha',
    roadName: 'North Shelter Avenue',
    distanceKm: 0.9,
    baseSpeedKmh: 40,
    coordinates: [
      { lat: 12.9810, lng: 77.5910 },
      { lat: 12.9800, lng: 77.5945 },
      { lat: 12.9785, lng: 77.5980 },
    ],
  },
  // Edge 10: Bridge B12 Approach -> West Ring
  {
    id: 'edge-b12-west',
    source: 'node-bridge-b12',
    target: 'node-west-ring',
    roadName: 'Cross-Town Link',
    distanceKm: 0.9,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9718, lng: 77.5900 },
      { lat: 12.9720, lng: 77.5860 },
    ],
  },
  // Edge 11: East Bypass -> Northeast Gate
  {
    id: 'edge-east-northeast',
    source: 'node-east-express',
    target: 'node-northeast-gate',
    roadName: 'Outer Perimeter Expressway',
    distanceKm: 1.7,
    baseSpeedKmh: 65,
    coordinates: [
      { lat: 12.9680, lng: 77.6050 },
      { lat: 12.9760, lng: 77.6060 },
      { lat: 12.9830, lng: 77.6050 },
    ],
  },
  // Edge 12: Northeast Gate -> Central Shelter
  {
    id: 'edge-northeast-shelter',
    source: 'node-northeast-gate',
    target: 'node-shelter-alpha',
    roadName: 'Northeast Access Corridor',
    distanceKm: 0.9,
    baseSpeedKmh: 50,
    coordinates: [
      { lat: 12.9830, lng: 77.6050 },
      { lat: 12.9810, lng: 77.6010 },
      { lat: 12.9785, lng: 77.5980 },
    ],
  },
  // Edge 13: Bridge B12 Approach -> Sector Hospital
  {
    id: 'edge-b12-hospital',
    source: 'node-bridge-b12',
    target: 'node-hospital-main',
    roadName: 'Civic Hospital Expressway',
    distanceKm: 0.8,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9730, lng: 77.5980 },
      { lat: 12.9750, lng: 77.6020 },
    ],
  },
];

/* ── Delhi NCR Regional Graph Dataset ───────────────────────────────── */
export const DELHI_NCR_NODES: RoadNode[] = [
  { id: 'node-delhi-cp', name: 'Connaught Place (Central Hub)', lat: 28.6315, lng: 77.2167, type: 'CHECKPOINT' },
  { id: 'node-delhi-india-gate', name: 'India Gate Hexagon', lat: 28.6129, lng: 77.2295, type: 'WAYPOINT' },
  { id: 'node-delhi-ito', name: 'ITO Chowk Junction', lat: 28.6280, lng: 77.2400, type: 'INTERSECTION' },
  { id: 'node-delhi-loha-pul', name: 'Old Yamuna Bridge (Loha Pul)', lat: 28.6200, lng: 77.2350, type: 'INTERSECTION' },
  { id: 'node-delhi-red-fort', name: 'Red Fort Emergency Shelter', lat: 28.6562, lng: 77.2410, type: 'SHELTER' },
  { id: 'node-delhi-aiims', name: 'AIIMS Trauma Center', lat: 28.5672, lng: 77.2100, type: 'HOSPITAL' },
  { id: 'node-delhi-ring-road', name: 'Ring Road Outer Corridor', lat: 28.6050, lng: 77.2100, type: 'INTERSECTION' },
  { id: 'node-delhi-kashmere-gate', name: 'Kashmere Gate Transit Hub', lat: 28.6665, lng: 77.2285, type: 'CHECKPOINT' },
];

export const DELHI_NCR_EDGES: RoadEdge[] = [
  // Edge 1: Connaught Place -> India Gate
  {
    id: 'edge-delhi-cp-ig',
    source: 'node-delhi-cp',
    target: 'node-delhi-india-gate',
    roadName: 'Janpath Radial Expressway',
    distanceKm: 2.3,
    baseSpeedKmh: 50,
    coordinates: [
      { lat: 28.6315, lng: 77.2167 },
      { lat: 28.6220, lng: 77.2230 },
      { lat: 28.6129, lng: 77.2295 },
    ],
  },
  // Edge 2: Connaught Place -> ITO Junction
  {
    id: 'edge-delhi-cp-ito',
    source: 'node-delhi-cp',
    target: 'node-delhi-ito',
    roadName: 'Barakhamba Emergency Arterial',
    distanceKm: 2.6,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 28.6315, lng: 77.2167 },
      { lat: 28.6300, lng: 77.2280 },
      { lat: 28.6280, lng: 77.2400 },
    ],
  },
  // Edge 3: India Gate -> Ring Road
  {
    id: 'edge-delhi-ig-ring',
    source: 'node-delhi-india-gate',
    target: 'node-delhi-ring-road',
    roadName: 'Shershah Road Link',
    distanceKm: 1.4,
    baseSpeedKmh: 55,
    coordinates: [
      { lat: 28.6129, lng: 77.2295 },
      { lat: 28.6080, lng: 77.2190 },
      { lat: 28.6050, lng: 77.2100 },
    ],
  },
  // Edge 4: Ring Road -> AIIMS Hospital
  {
    id: 'edge-delhi-ring-aiims',
    source: 'node-delhi-ring-road',
    target: 'node-delhi-aiims',
    roadName: 'South Delhi Medical Corridor',
    distanceKm: 4.3,
    baseSpeedKmh: 60,
    coordinates: [
      { lat: 28.6050, lng: 77.2100 },
      { lat: 28.5850, lng: 77.2100 },
      { lat: 28.5672, lng: 77.2100 },
    ],
  },
  // Edge 5: ITO Junction -> Old Yamuna Bridge
  {
    id: 'edge-delhi-ito-lohapul',
    source: 'node-delhi-ito',
    target: 'node-delhi-loha-pul',
    roadName: 'Vikas Marg River Approach',
    distanceKm: 1.5,
    baseSpeedKmh: 40,
    entityId: 'bridge-delhi-01',
    coordinates: [
      { lat: 28.6280, lng: 77.2400 },
      { lat: 28.6240, lng: 77.2370 },
      { lat: 28.6200, lng: 77.2350 },
    ],
  },
  // Edge 6: Old Yamuna Bridge -> Red Fort Relief Center
  {
    id: 'edge-delhi-lohapul-redfort',
    source: 'node-delhi-loha-pul',
    target: 'node-delhi-red-fort',
    roadName: 'Yamuna Bank Bypass',
    distanceKm: 4.2,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 28.6200, lng: 77.2350 },
      { lat: 28.6400, lng: 77.2380 },
      { lat: 28.6562, lng: 77.2410 },
    ],
  },
  // Edge 7: ITO Junction -> Red Fort
  {
    id: 'edge-delhi-ito-redfort',
    source: 'node-delhi-ito',
    target: 'node-delhi-red-fort',
    roadName: 'Netaji Subhash Marg',
    distanceKm: 3.4,
    baseSpeedKmh: 50,
    coordinates: [
      { lat: 28.6280, lng: 77.2400 },
      { lat: 28.6420, lng: 77.2405 },
      { lat: 28.6562, lng: 77.2410 },
    ],
  },
  // Edge 8: Red Fort -> Kashmere Gate
  {
    id: 'edge-delhi-redfort-kg',
    source: 'node-delhi-red-fort',
    target: 'node-delhi-kashmere-gate',
    roadName: 'Old Delhi Northern Highway',
    distanceKm: 1.6,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 28.6562, lng: 77.2410 },
      { lat: 28.6620, lng: 77.2350 },
      { lat: 28.6665, lng: 77.2285 },
    ],
  },
  // Edge 9: Ring Road -> ITO Junction
  {
    id: 'edge-delhi-ring-ito',
    source: 'node-delhi-ring-road',
    target: 'node-delhi-ito',
    roadName: 'Ring Road Outer Corridor',
    distanceKm: 2.8,
    baseSpeedKmh: 55,
    entityId: 'road-ring-01',
    coordinates: [
      { lat: 28.6050, lng: 77.2100 },
      { lat: 28.6180, lng: 77.2280 },
      { lat: 28.6280, lng: 77.2400 },
    ],
  },
  // Edge 10: Connaught Place -> Kashmere Gate
  {
    id: 'edge-delhi-cp-kg',
    source: 'node-delhi-cp',
    target: 'node-delhi-kashmere-gate',
    roadName: 'Central Express Boulevard',
    distanceKm: 4.8,
    baseSpeedKmh: 60,
    coordinates: [
      { lat: 28.6315, lng: 77.2167 },
      { lat: 28.6500, lng: 77.2220 },
      { lat: 28.6665, lng: 77.2285 },
    ],
  },
];

export const ASSAM_FLOOD_NODES: RoadNode[] = [
  { id: 'node-assam-guwahati-entry', name: 'Guwahati Relief Entry', lat: 26.1445, lng: 91.7362, type: 'CHECKPOINT' },
  { id: 'node-assam-brahmaputra', name: 'Brahmaputra Embankment', lat: 26.1850, lng: 91.7450, type: 'INTERSECTION' },
  { id: 'node-assam-shelter', name: 'Kamrup Flood Shelter', lat: 26.1580, lng: 91.7800, type: 'SHELTER' },
  { id: 'node-assam-hospital', name: 'Guwahati Emergency Hospital', lat: 26.1500, lng: 91.7700, type: 'HOSPITAL' },
  { id: 'node-assam-highway', name: 'NH-27 High Ground Bypass', lat: 26.1300, lng: 91.7000, type: 'WAYPOINT' },
  { id: 'node-assam-tezpur', name: 'Tezpur River Crossing', lat: 26.6500, lng: 92.8000, type: 'INTERSECTION' },
  { id: 'node-assam-nagaon', name: 'Nagaon Staging Depot', lat: 26.3500, lng: 92.6800, type: 'CHECKPOINT' },
  { id: 'node-assam-sivasagar', name: 'Sivasagar Tactical Post', lat: 26.9700, lng: 94.6800, type: 'SHELTER' },
  { id: 'node-assam-dhemaji', name: 'Dhemaji Inundation Hub', lat: 27.4800, lng: 94.5700, type: 'SHELTER' },
];

export const ASSAM_FLOOD_EDGES: RoadEdge[] = [
  // 1: Guwahati Entry <-> Brahmaputra Embankment
  {
    id: 'edge-assam-gw-bp',
    source: 'node-assam-guwahati-entry',
    target: 'node-assam-brahmaputra',
    roadName: 'MG Road Riverfront Arterial',
    distanceKm: 4.8,
    baseSpeedKmh: 40,
    coordinates: [
      { lat: 26.1445, lng: 91.7362 },
      { lat: 26.1650, lng: 91.7400 },
      { lat: 26.1850, lng: 91.7450 },
    ],
  },
  // 2: Guwahati Entry <-> NH-27 Highway
  {
    id: 'edge-assam-gw-hw',
    source: 'node-assam-guwahati-entry',
    target: 'node-assam-highway',
    roadName: 'GS Road Express Bypass',
    distanceKm: 3.5,
    baseSpeedKmh: 50,
    coordinates: [
      { lat: 26.1445, lng: 91.7362 },
      { lat: 26.1380, lng: 91.7180 },
      { lat: 26.1300, lng: 91.7000 },
    ],
  },
  // 3: Brahmaputra Embankment <-> Kamrup Flood Shelter
  {
    id: 'edge-assam-bp-sh',
    source: 'node-assam-brahmaputra',
    target: 'node-assam-shelter',
    roadName: 'North Embankment Relief Causeway',
    distanceKm: 4.1,
    baseSpeedKmh: 35,
    coordinates: [
      { lat: 26.1850, lng: 91.7450 },
      { lat: 26.1720, lng: 91.7650 },
      { lat: 26.1580, lng: 91.7800 },
    ],
  },
  // 4: NH-27 Highway <-> Emergency Hospital
  {
    id: 'edge-assam-hw-hs',
    source: 'node-assam-highway',
    target: 'node-assam-hospital',
    roadName: 'South Corridor Medical Expressway',
    distanceKm: 6.2,
    baseSpeedKmh: 55,
    coordinates: [
      { lat: 26.1300, lng: 91.7000 },
      { lat: 26.1400, lng: 91.7350 },
      { lat: 26.1500, lng: 91.7700 },
    ],
  },
  // 5: Emergency Hospital <-> Kamrup Flood Shelter
  {
    id: 'edge-assam-hs-sh',
    source: 'node-assam-hospital',
    target: 'node-assam-shelter',
    roadName: 'Dispur Medical Access Link',
    distanceKm: 1.8,
    baseSpeedKmh: 40,
    coordinates: [
      { lat: 26.1500, lng: 91.7700 },
      { lat: 26.1540, lng: 91.7750 },
      { lat: 26.1580, lng: 91.7800 },
    ],
  },
  // 6: Guwahati Entry <-> Kamrup Flood Shelter (Central Link)
  {
    id: 'edge-assam-gw-sh',
    source: 'node-assam-guwahati-entry',
    target: 'node-assam-shelter',
    roadName: 'Assam Trunk Road Central Corridor',
    distanceKm: 5.0,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 26.1445, lng: 91.7362 },
      { lat: 26.1520, lng: 91.7580 },
      { lat: 26.1580, lng: 91.7800 },
    ],
  },
  // 7: Brahmaputra Embankment <-> Emergency Hospital
  {
    id: 'edge-assam-bp-hs',
    source: 'node-assam-brahmaputra',
    target: 'node-assam-hospital',
    roadName: 'Zoo Road Elevated Arterial',
    distanceKm: 5.5,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 26.1850, lng: 91.7450 },
      { lat: 26.1680, lng: 91.7550 },
      { lat: 26.1500, lng: 91.7700 },
    ],
  },
  // 8: NH-27 Highway <-> Kamrup Flood Shelter
  {
    id: 'edge-assam-hw-sh',
    source: 'node-assam-highway',
    target: 'node-assam-shelter',
    roadName: 'High-Ground Outer Perimeter Highway',
    distanceKm: 7.8,
    baseSpeedKmh: 60,
    coordinates: [
      { lat: 26.1300, lng: 91.7000 },
      { lat: 26.1350, lng: 91.7450 },
      { lat: 26.1580, lng: 91.7800 },
    ],
  },
  // 9: Brahmaputra Embankment <-> NH-27 Highway
  {
    id: 'edge-assam-bp-hw',
    source: 'node-assam-brahmaputra',
    target: 'node-assam-highway',
    roadName: 'Kamakhya River Bypass Link',
    distanceKm: 6.0,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 26.1850, lng: 91.7450 },
      { lat: 26.1550, lng: 91.7200 },
      { lat: 26.1300, lng: 91.7000 },
    ],
  },
  // 10: Guwahati Entry <-> Emergency Hospital
  {
    id: 'edge-assam-gw-hs',
    source: 'node-assam-guwahati-entry',
    target: 'node-assam-hospital',
    roadName: 'Direct Emergency Transit Line',
    distanceKm: 4.0,
    baseSpeedKmh: 45,
    coordinates: [
      { lat: 26.1445, lng: 91.7362 },
      { lat: 26.1470, lng: 91.7520 },
      { lat: 26.1500, lng: 91.7700 },
    ],
  },
  // 11: NH-27 Highway <-> Nagaon Staging Depot
  {
    id: 'edge-assam-hw-ng',
    source: 'node-assam-highway',
    target: 'node-assam-nagaon',
    roadName: 'NH-27 East Inter-District Highway',
    distanceKm: 95.0,
    baseSpeedKmh: 75,
    coordinates: [
      { lat: 26.1300, lng: 91.7000 },
      { lat: 26.2200, lng: 92.1500 },
      { lat: 26.3500, lng: 92.6800 },
    ],
  },
  // 12: Brahmaputra Embankment <-> Tezpur River Crossing
  {
    id: 'edge-assam-bp-tz',
    source: 'node-assam-brahmaputra',
    target: 'node-assam-tezpur',
    roadName: 'NH-15 Brahmaputra North Arterial',
    distanceKm: 120.0,
    baseSpeedKmh: 70,
    coordinates: [
      { lat: 26.1850, lng: 91.7450 },
      { lat: 26.4200, lng: 92.2500 },
      { lat: 26.6500, lng: 92.8000 },
    ],
  },
  // 13: Nagaon Staging Depot <-> Sivasagar Tactical Post
  {
    id: 'edge-assam-ng-sv',
    source: 'node-assam-nagaon',
    target: 'node-assam-sivasagar',
    roadName: 'NH-27 Upper Assam Express Route',
    distanceKm: 180.0,
    baseSpeedKmh: 75,
    coordinates: [
      { lat: 26.3500, lng: 92.6800 },
      { lat: 26.6000, lng: 93.3500 },
      { lat: 26.9700, lng: 94.6800 },
    ],
  },
  // 14: Tezpur River Crossing <-> Dhemaji Inundation Hub
  {
    id: 'edge-assam-tz-dh',
    source: 'node-assam-tezpur',
    target: 'node-assam-dhemaji',
    roadName: 'NH-15 North Bank Flood Bypass',
    distanceKm: 175.0,
    baseSpeedKmh: 65,
    coordinates: [
      { lat: 26.6500, lng: 92.8000 },
      { lat: 26.7300, lng: 93.1500 },
      { lat: 27.4800, lng: 94.5700 },
    ],
  },
  // 15: Sivasagar Tactical Post <-> Dhemaji Inundation Hub
  {
    id: 'edge-assam-sv-dh',
    source: 'node-assam-sivasagar',
    target: 'node-assam-dhemaji',
    roadName: 'Desangmukh Embankment Causeway',
    distanceKm: 62.0,
    baseSpeedKmh: 50,
    entityId: 'embank-assam-04',
    coordinates: [
      { lat: 26.9700, lng: 94.6800 },
      { lat: 27.2000, lng: 94.6000 },
      { lat: 27.4800, lng: 94.5700 },
    ],
  },
];

export function attachRoadGeometry(edges: RoadEdge[]): RoadEdge[] {
  return edges.map(edge => {
    const pre = PRECOMPUTED_ROAD_EDGES[edge.id];
    if (pre && pre.coordinates && pre.coordinates.length > 0) {
      return {
        ...edge,
        distanceKm: pre.distanceKm || edge.distanceKm,
        coordinates: pre.coordinates,
      };
    }
    return edge;
  });
}

export function getGraphForArea(areaId?: string): { nodes: RoadNode[]; edges: RoadEdge[] } {
  if (areaId === 'delhi-demo') {
    return { nodes: DELHI_NCR_NODES, edges: attachRoadGeometry(DELHI_NCR_EDGES) };
  }
  if (areaId === 'assam-demo' || areaId === 'assam') {
    return { nodes: ASSAM_FLOOD_NODES, edges: attachRoadGeometry(ASSAM_FLOOD_EDGES) };
  }
  return { nodes: SECTOR_4_NODES, edges: attachRoadGeometry(SECTOR_4_EDGES) };
}

