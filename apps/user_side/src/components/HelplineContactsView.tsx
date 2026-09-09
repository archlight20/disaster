import React from 'react';
import { ArrowLeft, PhoneCall, ShieldCheck, HeartPulse, Radio, Phone } from 'lucide-react';

interface HelplineContactsViewProps {
  onBack: () => void;
}

const HELPLINES = [
  {
    id: '112',
    name: 'National Emergency Response',
    number: '112',
    desc: '24/7 Universal Emergency & Ambulance Dispatch across all sectors',
    icon: ShieldCheck,
    colorClass: 'blue',
    callNumber: '112',
  },
  {
    id: '1078',
    name: 'Disaster Response Force (NDRF)',
    number: '1078',
    desc: 'Rescue boats, helicopter extraction & flood response units',
    icon: HeartPulse,
    colorClass: 'red',
    callNumber: '1078',
  },
  {
    id: 'eoc',
    name: 'EOC Sector Command Center',
    number: '1800-425-001',
    desc: 'Local Sector 4 Control Room Direct Radio Relay & Logistics',
    icon: Radio,
    colorClass: 'cyan',
    callNumber: '1800425001',
  },
  {
    id: '108',
    name: 'Emergency Medical & Trauma',
    number: '108',
    desc: 'Rapid paramedic dispatch, critical stabilization & triage transport',
    icon: PhoneCall,
    colorClass: 'emerald',
    callNumber: '108',
  },
];

export const HelplineContactsView: React.FC<HelplineContactsViewProps> = ({ onBack }) => {
  return (
    <div className="help-contacts-page">
      {/* Top Navigation Bar */}
      <div className="help-top-bar">
        <button type="button" className="btn-back-sos" onClick={onBack} aria-label="Back to SOS Home">
          <ArrowLeft size={20} />
        </button>
        <div className="help-title-badge">
          <PhoneCall size={14} className="icon-cyan" />
          <span>EMERGENCY HELPLINES</span>
        </div>
      </div>

      {/* Helplines List Container */}
      <div className="contacts-list-container">
        {HELPLINES.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className={`helpline-card ${item.colorClass}`}>
              <div className="helpline-card-top">
                <div className={`helpline-icon-badge ${item.colorClass}`}>
                  <IconComponent size={20} />
                </div>
                <div className="helpline-header-info">
                  <h3>{item.name}</h3>
                  <p className="helpline-desc">{item.desc}</p>
                </div>
              </div>

              <div className="helpline-card-action-row">
                <div className="helpline-number-display">
                  <Phone size={14} className={`num-phone-icon ${item.colorClass}`} />
                  <span className="num-digits">{item.number}</span>
                </div>
                <a href={`tel:${item.callNumber}`} className={`btn-call-action ${item.colorClass}`}>
                  <Phone size={13} />
                  <span>Call Now</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
