import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, X, MapPin, Send, ChevronDown, Navigation, Check, Loader2 } from 'lucide-react';
import { OperationalStateDelta } from '@disaster/protocol';
import { transmitEmergencyDelta, ActiveSignal } from '../services/api';

interface ReportIncidentModalProps {
  userLocation: { lat: number; lng: number; addressName: string };
  onClose: () => void;
  onSubmitted: () => void;
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

const HAZARD_TYPES = [
  { id: 'FLOOD', label: 'Rising Water / Flooding', emoji: '🌊' },
  { id: 'ROAD_BLOCKED', label: 'Road / Pathway Blocked', emoji: '🚧' },
  { id: 'BRIDGE_DAMAGE', label: 'Bridge / Causeway Damaged', emoji: '🌉' },
  { id: 'FIRE', label: 'Active Fire / Explosion', emoji: '🔥' },
  { id: 'POWER_DOWN', label: 'Downed Power Lines / Electrical', emoji: '⚡' },
  { id: 'OTHER', label: 'Other Severe Hazard', emoji: '⚠️' },
];

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  userLocation,
  onClose,
  onSubmitted,
}) => {
  // Location selection: 'CURRENT_GPS' or index into COMMAND_CENTER_LOCATIONS
  const [selectedLocationType, setSelectedLocationType] = useState<'CURRENT_GPS' | number>(0);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState<boolean>(false);
  const locDropdownRef = useRef<HTMLDivElement>(null);

  // Hazard type selection & custom dropdown
  const [incidentType, setIncidentType] = useState<string>('FLOOD');
  const [isHazardDropdownOpen, setIsHazardDropdownOpen] = useState<boolean>(false);
  const hazardDropdownRef = useRef<HTMLDivElement>(null);

  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locDropdownRef.current && !locDropdownRef.current.contains(event.target as Node)) {
        setIsLocDropdownOpen(false);
      }
      if (hazardDropdownRef.current && !hazardDropdownRef.current.contains(event.target as Node)) {
        setIsHazardDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Use Current Location handler with device GPS tracing
  const handleSelectCurrentLocation = () => {
    setIsLocDropdownOpen(false);
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

  const currentHazard = HAZARD_TYPES.find((h) => h.id === incidentType) || HAZARD_TYPES[0];

  const handleSubmitReport = async () => {
    setIsSubmitting(true);

    const eventId = `haz-rpt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const entityId = `citizen-hazard-${Date.now()}`;
    const reportDesc = description.trim() || `${currentHazard.label} reported near ${activeLocation.address}`;

    const deltaPayload = {
      title: `CITIZEN HAZARD REPORT: ${currentHazard.label}`,
      severity: 'HIGH',
      sub_type: incidentType,
      details: reportDesc,
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
      type: 'INCIDENT',
      title: `⚠️ Hazard: ${currentHazard.label}`,
      details: `${reportDesc} · ${activeLocation.address}`,
      status: 'PENDING_SYNC',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: { lat: activeLocation.lat, lng: activeLocation.lng, addressName: activeLocation.address },
      payload: deltaPayload,
    };

    await transmitEmergencyDelta(delta, signalMeta);

    setIsSubmitting(false);
    onSubmitted();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card report-modal-card">
        {/* Modal Header */}
        <div className="modal-header report-modal-header">
          <div className="modal-title-row">
            <div className="report-header-badge">
              <AlertTriangle size={18} className="report-title-icon" />
            </div>
            <h2>Report Dangerous Situation</h2>
          </div>
          <button type="button" className="btn-modal-close-round" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body report-modal-body">
          {/* LOCATION Section */}
          <div className="form-section">
            <label className="modal-section-label">LOCATION</label>
            <div className="custom-loc-container" ref={locDropdownRef}>
              <button
                type="button"
                className={`location-select-btn ${isLocDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
                aria-expanded={isLocDropdownOpen}
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
                <ChevronDown size={15} className={`loc-box-chevron ${isLocDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Custom Location Dropdown Menu */}
              {isLocDropdownOpen && (
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
                            setIsLocDropdownOpen(false);
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
          </div>

          {/* HAZARD TYPE Section */}
          <div className="form-section">
            <label className="modal-section-label">HAZARD TYPE</label>
            <div className="hazard-select-container" ref={hazardDropdownRef}>
              <button
                type="button"
                className={`hazard-select-btn ${isHazardDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsHazardDropdownOpen(!isHazardDropdownOpen)}
                aria-expanded={isHazardDropdownOpen}
              >
                <div className="hazard-btn-content">
                  <span className="hazard-btn-emoji">{currentHazard.emoji}</span>
                  <span className="hazard-btn-label">{currentHazard.label}</span>
                </div>
                <ChevronDown size={15} className={`hazard-chevron ${isHazardDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Hazard Custom Dropdown Menu */}
              {isHazardDropdownOpen && (
                <div className="hazard-custom-dropdown">
                  {HAZARD_TYPES.map((h) => {
                    const isSelected = h.id === incidentType;
                    return (
                      <div
                        key={h.id}
                        className={`hazard-dropdown-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setIncidentType(h.id);
                          setIsHazardDropdownOpen(false);
                        }}
                      >
                        <span className="hazard-item-emoji">{h.emoji}</span>
                        <span className="hazard-item-name">{h.label}</span>
                        {isSelected && <Check size={14} className="hazard-item-check" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* DESCRIPTION OF DANGER Section */}
          <div className="form-section">
            <label htmlFor="hazard-desc-input" className="modal-section-label">DESCRIPTION OF DANGER</label>
            <textarea
              id="hazard-desc-input"
              rows={3}
              placeholder="e.g. water level rising fast near bridge , Road impassable for cars"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="report-desc-textarea"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer report-modal-footer">
          <button type="button" className="btn-supplies-cancel" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-amber-report-submit"
            onClick={handleSubmitReport}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              <><Send size={13} /> Submit Report</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
