import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, X, MapPin, Radio, ChevronDown, Navigation, Check, Loader2 } from 'lucide-react';
import { OperationalStateDelta } from '@disaster/protocol';
import { transmitEmergencyDelta, ActiveSignal } from '../services/api';

interface SOSConfirmationModalProps {
  userLocation: { lat: number; lng: number; addressName: string };
  onClose: () => void;
  onSignalTransmitted: () => void;
}

const COMMAND_CENTER_LOCATIONS = [
  { name: 'Sector 4 South Access Point', lat: 12.9600, lng: 77.5900 },
  { name: 'South Gate (Main Entry)', lat: 12.9600, lng: 77.5900 },
  { name: 'Coastal Junction', lat: 12.9650, lng: 77.5900 },
  { name: 'Bridge B12 Approach', lat: 12.9716, lng: 77.5946 },
  { name: 'Central High Shelter', lat: 12.9785, lng: 77.5980 },
  { name: 'Sector Memorial Hospital', lat: 12.9750, lng: 77.6020 },
  { name: 'East Sector Bypass', lat: 12.9680, lng: 77.6050 },
  { name: 'West Perimeter Ring', lat: 12.9720, lng: 77.5860 },
  { name: 'North River Basin Waypoint', lat: 12.9810, lng: 77.5910 },
  { name: 'Northeast Gate', lat: 12.9830, lng: 77.6050 },
];

export const SOSConfirmationModal: React.FC<SOSConfirmationModalProps> = ({
  userLocation,
  onClose,
  onSignalTransmitted,
}) => {
  // 'CURRENT_GPS' or index into COMMAND_CENTER_LOCATIONS
  const [selectedLocationType, setSelectedLocationType] = useState<'CURRENT_GPS' | number>(0);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedUrgency, setSelectedUrgency] = useState<'CRITICAL_HELP' | 'TRAPPED' | 'MEDICAL'>('CRITICAL_HELP');
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [hasChildren, setHasChildren] = useState<boolean>(false);
  const [hasInjuries, setHasInjuries] = useState<boolean>(false);
  const [emergencyDetails, setEmergencyDetails] = useState<string>('');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use Current Location handler with device GPS tracing
  const handleSelectCurrentLocation = () => {
    setIsDropdownOpen(false);
    setIsLocating(true);
    setSelectedLocationType('CURRENT_GPS');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentGpsCoords({
            lat: latitude,
            lng: longitude,
            label: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          });
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation error, fallback to userLocation:', err);
          setCurrentGpsCoords({
            lat: userLocation.lat,
            lng: userLocation.lng,
            label: userLocation.addressName || 'Device Current Location',
          });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setCurrentGpsCoords({
        lat: userLocation.lat,
        lng: userLocation.lng,
        label: userLocation.addressName || 'Device Current Location',
      });
      setIsLocating(false);
    }
  };

  // Active location computed
  const activeLocation = selectedLocationType === 'CURRENT_GPS'
    ? {
        lat: currentGpsCoords?.lat ?? userLocation.lat,
        lng: currentGpsCoords?.lng ?? userLocation.lng,
        address: currentGpsCoords?.label ?? userLocation.addressName ?? 'Device Current Location',
      }
    : {
        lat: COMMAND_CENTER_LOCATIONS[selectedLocationType].lat,
        lng: COMMAND_CENTER_LOCATIONS[selectedLocationType].lng,
        address: COMMAND_CENTER_LOCATIONS[selectedLocationType].name,
      };

  const activeDisplayLabel = isLocating
    ? 'Detecting GPS location...'
    : selectedLocationType === 'CURRENT_GPS'
      ? (currentGpsCoords?.label || 'Use Current Location (GPS)')
      : COMMAND_CENTER_LOCATIONS[selectedLocationType].name;

  const handleConfirmSOS = async () => {
    setIsTransmitting(true);

    const eventId = `sos-evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const entityId = `citizen-sos-${Date.now()}`;

    const urgencyLabel = selectedUrgency === 'CRITICAL_HELP'
      ? 'Critical Urgent Help'
      : selectedUrgency === 'TRAPPED'
        ? 'Trapped in Water / Debris'
        : 'Medical assistance';

    const deltaPayload = {
      title: `CRITICAL CITIZEN SOS: ${urgencyLabel} (${peopleCount} People)`,
      severity: 'CRITICAL',
      sub_type: 'CITIZEN_DISTRESS_SOS',
      details: emergencyDetails || 'Citizen triggered emergency SOS distress beacon.',
      urgency: selectedUrgency,
      people_count: peopleCount,
      has_children: hasChildren,
      has_injuries: hasInjuries,
    };

    const delta: OperationalStateDelta = {
      event_id: eventId,
      type: 'INCIDENT_REPORTED',
      entity_id: entityId,
      entity_type: 'INCIDENT',
      previous_state: 'UNKNOWN',
      new_state: 'CRITICAL',
      location: activeLocation,
      observed_at: new Date().toISOString(),
      source_id: 'citizen-app-user',
      confidence: 1.0,
      freshness: {
        last_observed_at: new Date().toISOString(),
        valid_until: new Date(Date.now() + 86400000).toISOString(),
        is_stale: false,
      },
      evidence: [],
      sync_status: 'PENDING',
      metadata: deltaPayload,
    };

    const signalMeta: ActiveSignal = {
      id: eventId,
      type: 'SOS',
      title: `🚨 SOS Signal: ${urgencyLabel}`,
      details: `${peopleCount} people · ${activeLocation.address}`,
      status: 'PENDING_SYNC',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: { lat: activeLocation.lat, lng: activeLocation.lng, addressName: activeLocation.address },
      payload: deltaPayload,
    };

    await transmitEmergencyDelta(delta, signalMeta);

    setIsTransmitting(false);
    onSignalTransmitted();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card sos-modal-card">
        {/* SOS Header */}
        <div className="modal-header sos-modal-header">
          <div className="sos-header-title">
            <div className="sos-header-badge">
              <AlertTriangle size={18} className="sos-title-icon" />
            </div>
            <h2>Confirm Emergency SOS</h2>
          </div>
          <button type="button" className="btn-modal-close-round" onClick={onClose} aria-label="Cancel">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body sos-modal-body">
          {/* Custom Location Dropdown Button & Popover */}
          <div className="custom-loc-container" ref={dropdownRef}>
            <button
              type="button"
              className={`location-select-btn ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <div className="loc-btn-content">
                {isLocating ? (
                  <Loader2 size={15} className="loc-box-icon spin-icon" />
                ) : selectedLocationType === 'CURRENT_GPS' ? (
                  <Navigation size={15} className="loc-box-icon" />
                ) : (
                  <MapPin size={15} className="loc-box-icon" />
                )}
                <span className="loc-btn-text">{activeDisplayLabel}</span>
              </div>
              <ChevronDown size={15} className={`loc-box-chevron ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown Menu */}
            {isDropdownOpen && (
              <div className="custom-loc-dropdown">
                {/* 1. Use Current Location (Phone GPS) */}
                <div
                  className={`custom-loc-item current-loc-item ${selectedLocationType === 'CURRENT_GPS' ? 'selected' : ''}`}
                  onClick={handleSelectCurrentLocation}
                >
                  <div className="loc-item-icon-wrap gps">
                    {isLocating ? (
                      <Loader2 size={14} className="spin-icon text-blue" />
                    ) : (
                      <Navigation size={14} className="text-blue" />
                    )}
                  </div>
                  <div className="loc-item-text-group">
                    <div className="loc-item-primary">Use Current Location</div>
                    <div className="loc-item-secondary">
                      {isLocating ? 'Detecting device GPS...' : 'Trace live phone coordinates'}
                    </div>
                  </div>
                  {selectedLocationType === 'CURRENT_GPS' && (
                    <Check size={14} className="loc-item-check" />
                  )}
                </div>

                <div className="custom-loc-divider">
                  <span>COMMAND CENTER LOCATIONS</span>
                </div>

                {/* 2. Command Center Locations List */}
                <div className="custom-loc-scroll-list">
                  {COMMAND_CENTER_LOCATIONS.map((loc, idx) => {
                    const isSelected = selectedLocationType === idx;
                    return (
                      <div
                        key={loc.name}
                        className={`custom-loc-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedLocationType(idx);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <div className="loc-item-icon-wrap">
                          <MapPin size={13} className={isSelected ? 'text-blue' : 'text-slate'} />
                        </div>
                        <div className="loc-item-text-group">
                          <div className="loc-item-primary">{loc.name}</div>
                        </div>
                        {isSelected && <Check size={14} className="loc-item-check" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Type Vertical Stack */}
          <div className="form-section">
            <label className="modal-section-label">EMERGENCY TYPE</label>
            <div className="sos-type-vertical-list">
              <button
                type="button"
                className={`sos-type-btn ${selectedUrgency === 'CRITICAL_HELP' ? 'selected' : ''}`}
                onClick={() => setSelectedUrgency('CRITICAL_HELP')}
              >
                <span className="sos-type-emoji">🚨</span>
                <span className="sos-type-name">Critical Urgent Help</span>
              </button>
              <button
                type="button"
                className={`sos-type-btn ${selectedUrgency === 'TRAPPED' ? 'selected' : ''}`}
                onClick={() => setSelectedUrgency('TRAPPED')}
              >
                <span className="sos-type-emoji">🌊</span>
                <span className="sos-type-name">Trapped in Water / Debris</span>
              </button>
              <button
                type="button"
                className={`sos-type-btn ${selectedUrgency === 'MEDICAL' ? 'selected' : ''}`}
                onClick={() => setSelectedUrgency('MEDICAL')}
              >
                <span className="sos-type-emoji">🚑</span>
                <span className="sos-type-name">Medical assistance</span>
              </button>
            </div>
          </div>

          {/* People Needing Rescue Slider & Count */}
          <div className="form-section">
            <div className="section-label-row">
              <label className="modal-section-label">PEOPLE NEEDING RESCUE</label>
              <span className="sos-people-count-pill">{peopleCount >= 10 ? '10+' : peopleCount}</span>
            </div>
            <div className="slider-wrapper">
              <input
                id="sos-people-count-range"
                type="range"
                min={1}
                max={10}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="range-input sos-slider"
                style={{
                  background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${((peopleCount - 1) / 9) * 100}%, #e2e8f0 ${((peopleCount - 1) / 9) * 100}%, #e2e8f0 100%)`
                }}
              />
              <div className="slider-labels-row">
                <span>1</span>
                <span>10+</span>
              </div>
            </div>

            {/* Checkboxes Pill Box */}
            <div className="checkboxes-pill-box">
              <label className="checkbox-pill-label">
                <input
                  type="checkbox"
                  checked={hasChildren}
                  onChange={(e) => setHasChildren(e.target.checked)}
                />
                <span className="checkbox-text">👶 Children</span>
              </label>

              <label className="checkbox-pill-label">
                <input
                  type="checkbox"
                  checked={hasInjuries}
                  onChange={(e) => setHasInjuries(e.target.checked)}
                />
                <span className="checkbox-text">🩹 Injuries</span>
              </label>
            </div>
          </div>

          {/* Additional Details (Optional) */}
          <div className="form-section">
            <label htmlFor="sos-details-input" className="modal-section-label">ADDITIONAL DETAILS (OPTIONAL)</label>
            <textarea
              id="sos-details-input"
              rows={2}
              placeholder="e.g. 2 adults, 1 child on roof near flooded road..."
              value={emergencyDetails}
              onChange={(e) => setEmergencyDetails(e.target.value)}
              className="supplies-notes-textarea"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer supplies-modal-footer">
          <button type="button" className="btn-supplies-cancel" onClick={onClose} disabled={isTransmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger-sos-transmit"
            onClick={handleConfirmSOS}
            disabled={isTransmitting}
          >
            {isTransmitting ? (
              <><Radio size={14} className="spin-icon" /> Transmitting...</>
            ) : (
              <><Radio size={14} /> Transmit SOS</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
