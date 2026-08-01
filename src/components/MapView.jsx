import React, { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordinate lookup for all places in the archival dataset [longitude, latitude]
const PLACE_COORDINATES = {
  // Middle East & North Africa
  'Persian Gulf':   [50.5577, 26.1275],
  'Muscat':         [58.5922, 23.5880],
  'Kuwait':         [47.9783, 29.3759],
  'Kuwait City':    [47.9783, 29.3759],
  'Bahrain':        [50.5577, 26.1275],
  'Manama':         [50.5860, 26.2235],
  'Doha':           [51.5310, 25.2854],
  'Hormuz':         [56.4625, 27.0580],
  'Bushire':        [50.8194, 28.9684],
  'Fao':            [47.9100, 29.9786],
  'Arabia':         [45.0792, 23.8859],
  'Baghdad':        [44.3661, 33.3128],
  'Basra':          [47.7804, 30.5085],
  'Al-Zubarah':     [51.0269, 25.9961],
  'Sharjah':        [55.3773, 25.3462],
  'Sur':            [59.5289, 22.5654],
  'Awali':          [50.5484, 26.0767],
  'Jeddah':         [39.1925, 21.5433],
  'Red Sea':        [38.0000, 20.0000],
  'Damascus':       [36.2913, 33.5138],
  'Khuzestan':      [48.6706, 31.3273],
  'Shiraz':         [52.5388, 29.5918],
  'Dubai':          [55.2708, 25.2048],
  'Mocha':          [43.2458, 13.3228],
  'Julfar':         [55.9754, 25.8239],
  'Mecca':          [39.8173, 21.4267],
  'Istanbul':       [28.9784, 41.0082],
  'Aden':           [45.0186, 12.7855],
  'Abadan':         [48.2933, 30.3392],
  'Rub\' al Khali':  [50.0000, 20.0000],
  'Mutrah':         [58.5663, 23.6214],
  'Dhahran':        [50.1300, 26.2700],
  'Lingah':         [54.8800, 26.5600],
  'Aleppo':         [37.1600, 36.2000],
  'Kamaran Island': [42.5700, 15.3500],
  'Al Hasa':        [49.5800, 25.3800],
  'Oman':           [56.0000, 21.0000],
  'Kirkuk':         [44.3900, 35.4700],
  'Ghazni':         [68.4200, 33.5500],
  'Jask':           [57.7700, 25.6500],
  'Abu Dhabi':      [54.3800, 24.4500],
  'Ur':             [46.1000, 30.9600],
  'Suez':           [32.5500, 29.9700],
  'Syrian Desert':  [38.0000, 32.0000],
  'Najd':           [45.0000, 25.0000],
  'Isfahan':        [51.6700, 32.6500],
  'Samarqand':      [66.9700, 39.6500],

  // India & South Asia
  'Bombay':         [72.8777, 19.0760],
  'Calcutta':       [88.3639, 22.5726],
  'Surat':          [72.8311, 21.1702],
  'Konkan':         [73.3000, 15.8000],
  'Karachi':        [67.0099, 24.8607],
  'Agra':           [78.0080, 27.1767],
  'Simla':          [77.1743, 31.1048],
  'Diu':            [70.9800, 20.7100],
  'Jehanabad':      [84.9800, 25.2100],
  'Colombo':        [79.8612, 6.9271],

  // Africa
  'Zanzibar':       [39.2083, -6.1659],
  'Cairo':          [31.2357, 30.0444],

  // East & Southeast Asia
  'Guangzhou':      [113.2644, 23.1291],
  'Singapore':      [103.8198, 1.3521],

  // Europe & Western Hemisphere
  'London':         [-0.1276, 51.5074],
  'Andalusia':      [-4.5000, 37.5000],
  'Kabul':          [69.2075, 34.5553],
  'Tehran':         [51.3890, 35.6892],
  'Havana':         [-82.3666, 23.1136],
  'New York':       [-74.0060, 40.7128],
};

// Colors matching typeBadge theme
const TYPE_COLORS = {
  map:          '#b89130',
  painting:     '#c27c2e',
  photograph:   '#4a7c6f',
  manuscript:   '#2c5282',
  letter:       '#6b4226',
  journal:      '#5a4a6b',
  drawing:      '#3d6b4a',
  diagram:      '#6b3d4a',
  illustration: '#3d4a6b',
  plan:         '#4a6b3d',
  volume:       '#2d6b5a',
  book:         '#6b2d2d',
  document:     '#2d3d6b',
  artifact:     '#8b6914',
};

const getTypeColor = (type) => TYPE_COLORS[type?.toLowerCase()] || '#b89130';

// Map place names to coordinates; returns null if unknown
const getCoordinates = (place) => {
  if (!place) return null;
  if (PLACE_COORDINATES[place]) return PLACE_COORDINATES[place];
  const key = Object.keys(PLACE_COORDINATES).find(
    (k) => place.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(place.toLowerCase())
  );
  return key ? PLACE_COORDINATES[key] : null;
};

// Helper component to programmatically reset the map center/zoom
const ChangeMapView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const MapView = ({ results = [], onMarkerClick }) => {
  // Center coordinates set to focus on Middle East / India region [latitude, longitude]
  const initialCenter = [23, 68];
  const initialZoom = 4;

  const markers = useMemo(() => {
    const grouped = {};
    results.forEach((doc) => {
      const coords = getCoordinates(doc.place);
      if (!coords) return;
      const key = doc.place;
      if (!grouped[key]) {
        grouped[key] = {
          place: doc.place,
          region: doc.region,
          coordinates: [coords[1], coords[0]], // Leaflet expects [latitude, longitude]
          docs: [],
        };
      }
      grouped[key].docs.push(doc);
    });
    return Object.values(grouped);
  }, [results]);

  const mappedCount = results.filter((d) => getCoordinates(d.place)).length;

  // Custom marker icon creation to avoid Leaflet default asset issues
  const createCustomIcon = (count, docType) => {
    const color = getTypeColor(docType);
    const size = count > 1 ? 28 : 22;
    return L.divIcon({
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border: 3px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 0 0 2px ${color}88, 0 4px 12px rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.15s ease-out;
        "
        onmouseover="this.style.transform='scale(1.2)';"
        onmouseout="this.style.transform='scale(1)';"
        >
          ${count > 1 ? count : ''}
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <h3 style={titleStyle}>Geographic Map</h3>
            <p style={subtitleStyle}>
              {markers.length} locations · {mappedCount} of {results.length} documents mapped
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {Object.entries(TYPE_COLORS).slice(0, 6).map(([type, color]) => (
            <span key={type} style={{ ...legendBadge, backgroundColor: color + '22', color, border: `1px solid ${color}44` }}>
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div style={mapWrapperStyle}>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ width: '100%', height: '100%', background: '#0f172a' }}
          zoomControl={false}
        >
          <ChangeMapView center={initialCenter} zoom={initialZoom} />
          
          {/* ESRI World Satellite Imagery — free, no API key, zero border disputes */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            maxZoom={18}
          />

          {markers.map((marker) => (
            <Marker
              key={marker.place}
              position={marker.coordinates}
              icon={createCustomIcon(marker.docs.length, marker.docs[0]?.type)}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick && marker.docs.length === 1) {
                    onMarkerClick(marker.docs[0]);
                  }
                }
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div style={tooltipStyle}>
                  <div style={{ fontWeight: 700, color: 'var(--gold-accent)', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                    {marker.place}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.6rem' }}>
                    {marker.region}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {marker.docs.map((doc) => (
                      <div
                        key={doc.id}
                        style={{ fontSize: '0.78rem', color: '#e2e8f0', display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => onMarkerClick && onMarkerClick(doc)}
                      >
                        <span style={{ ...typePill, backgroundColor: getTypeColor(doc.type) + '22', color: getTypeColor(doc.type) }}>
                          {doc.type}
                        </span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="Click to view details">
                          {doc.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {markers.length === 0 && (
        <div style={emptyStyle}>
          <p style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>
            No mappable locations in current results. Try a broader search.
          </p>
        </div>
      )}
    </div>
  );
};

/* ─── Styles ─── */
const containerStyle = {
  backgroundColor: 'white',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--border-light)',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
  zIndex: 1,
};

const headerStyle = {
  padding: '1.25rem 1.5rem',
  borderBottom: '1px solid var(--border-light)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  backgroundColor: 'var(--cream-bg)',
};

const titleStyle = {
  fontSize: '1.1rem',
  fontFamily: 'Playfair Display, serif',
  fontWeight: 700,
  color: 'var(--primary-navy)',
  margin: 0,
};

const subtitleStyle = {
  fontSize: '0.8rem',
  color: 'var(--text-light)',
  margin: '0.2rem 0 0',
};

const legendBadge = {
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.2rem 0.6rem',
  borderRadius: 'var(--radius-full)',
  textTransform: 'capitalize',
};

const mapWrapperStyle = {
  position: 'relative',
  height: '520px',
  overflow: 'hidden',
  zIndex: 1,
  background: '#0a1628',
};

const tooltipStyle = {
  minWidth: '220px',
  color: '#0f172a',
};

const typePill = {
  fontSize: '0.68rem',
  fontWeight: 700,
  padding: '0.1rem 0.4rem',
  borderRadius: 'var(--radius-full)',
  textTransform: 'capitalize',
  flexShrink: 0,
};

const emptyStyle = {
  padding: '3rem',
  textAlign: 'center',
};
