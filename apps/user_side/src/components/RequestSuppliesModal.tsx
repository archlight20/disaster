import React, { useState, useRef, useEffect } from 'react';
import { Package, X, MapPin, Send, ChevronDown, Navigation, Check, Loader2 } from 'lucide-react';
import { OperationalStateDelta } from '@disaster/protocol';
import { transmitEmergencyDelta, ActiveSignal } from '../services/api';

interface RequestSuppliesModalProps {
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

export const RequestSuppliesModal: React.FC<RequestSuppliesModalProps> = ({
  userLocation,
  onClose,
  onSubmitted,
}) => {
  // 'CURRENT_GPS' or number index into COMMAND_CENTER_LOCATIONS
  const [selectedLocationType, setSelectedLocationType] = useState<'CURRENT_GPS' | number>(0);
  const [currentGpsCoords, setCurrentGpsCoords] = useState<{ lat: number; lng: number; label: string } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<'FOOD_WATER' | 'MEDICAL' | 'SHELTER'>('FOOD_WATER');
  const [peopleCount, setPeopleCount] = useState<number>(2);
  const [hasInfant, setHasInfant] = useState<boolean>(false);
  const [hasMedicalNeed, setHasMedicalNeed] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler for "Use Current Location" option
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
          console.warn('Geolocation warning, fallback to userLocation:', err);
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

  // Compute active location for submission
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

  const handleSubmitSupplyRequest = async () => {
    setIsSubmitting(true);

    const eventId = `sup-req-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const entityId = `citizen-supply-${Date.now()}`;

    const itemsNeeded = [
      selectedCategory === 'FOOD_WATER' ? 'Food & Water' : selectedCategory === 'MEDICAL' ? 'Medical Need' : 'Tarps & Blankets',
      hasInfant ? 'Infant Formula / Diapers' : null,
      hasMedicalNeed ? 'Urgent Prescription Medical Need' : null,
    ].filter(Boolean);

    const deltaPayload = {
      title: `SUPPLY REQUEST: ${itemsNeeded.join(', ')} (${peopleCount} People)`,
      severity: 'HIGH',
      sub_type: 'ESSENTIAL_SUPPLY_REQUEST',
      details: `Requesting essential supplies for ${peopleCount} people. Notes: ${notes || 'None'}`,
      people_count: peopleCount,
      has_infant: hasInfant,
      has_medical: hasMedicalNeed,
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
      type: 'SUPPLY',
      title: `🍞 Supply Request: ${itemsNeeded.join(', ')}`,
      details: `${peopleCount} people · ${activeLocation.address}`,
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
      <div className="modal-card supplies-modal-card">
        {/* Modal Header */}
        <div className="modal-header supplies-modal-header">
          <div className="modal-title-row">
            <div className="supplies-header-badge">
              <Package size={17} className="icon-blue" />
            </div>
            <h2>Request Essential Supplies</h2>
          </div>
          <button type="button" className="btn-modal-close-round" onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body supplies-modal-body">
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

          {/* Primary Need 3-Tab Grid */}
          <div className="form-section">
            <label className="modal-section-label">PRIMARY NEED</label>
            <div className="primary-need-grid">
              <button
                type="button"
                className={`primary-need-btn ${selectedCategory === 'FOOD_WATER' ? 'selected' : ''}`}
                onClick={() => setSelectedCategory('FOOD_WATER')}
              >
                <span className="need-emoji">🥤</span>
                <span className="need-label">Food & Water</span>
              </button>

              <button
                type="button"
                className={`primary-need-btn ${selectedCategory === 'MEDICAL' ? 'selected' : ''}`}
                onClick={() => setSelectedCategory('MEDICAL')}
              >
                <span className="need-emoji">🩺</span>
                <span className="need-label">Medical Need</span>
              </button>

              <button
                type="button"
                className={`primary-need-btn ${selectedCategory === 'SHELTER' ? 'selected' : ''}`}
                onClick={() => setSelectedCategory('SHELTER')}
              >
                <span className="need-emoji">🏕️</span>
                <span className="need-label">Tarps & Blankets</span>
              </button>
            </div>
          </div>

          {/* People Needing Supplies Slider & Count */}
          <div className="form-section">
            <div className="section-label-row">
              <label className="modal-section-label">PEOPLE NEEDING SUPPLIES</label>
              <span className="people-count-pill">{peopleCount >= 10 ? '10+' : peopleCount}</span>
            </div>
            <div className="slider-wrapper">
              <input
                id="people-count-range"
                type="range"
                min={1}
                max={10}
                value={peopleCount}
                onChange={(e) => setPeopleCount(parseInt(e.target.value))}
                className="range-input supplies-slider"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${((peopleCount - 1) / 9) * 100}%, #e2e8f0 ${((peopleCount - 1) / 9) * 100}%, #e2e8f0 100%)`
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
                  checked={hasInfant}
                  onChange={(e) => setHasInfant(e.target.checked)}
                />
                <span className="checkbox-text">🍼 Includes Infant</span>
              </label>

              <label className="checkbox-pill-label">
                <input
                  type="checkbox"
                  checked={hasMedicalNeed}
                  onChange={(e) => setHasMedicalNeed(e.target.checked)}
                />
                <span className="checkbox-text">🚨 Urgent Medical</span>
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="form-section">
            <label htmlFor="supply-notes-input" className="modal-section-label">ADDITIONAL NOTES</label>
            <textarea
              id="supply-notes-input"
              rows={2}
              placeholder="e.g. Need clean drinking water, 2 adult meals..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="supplies-notes-textarea"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer supplies-modal-footer">
          <button type="button" className="btn-supplies-cancel" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-supplies-submit"
            onClick={handleSubmitSupplyRequest}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : <><Send size={13} /> Submit Request</>}
          </button>
        </div>
      </div>
    </div>
  );
};
