import React, { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

const USERS = ['Ben', 'Lauren', 'Daisy', 'Evie', 'Jacqui'];
const NAME_COLORS = {
  Ben: '#0770C2',
  Lauren: '#007D62',
  Daisy: '#E84393',
  Evie: '#FDCB6E',
  Jacqui: '#7C3AED',
};

function UserAvatar({ currentUser, onSetCurrentUser }) {
  const [showPicker, setShowPicker] = useState(false);
  const color = NAME_COLORS[currentUser] || '#64748B';

  return (
    <div className="relative">
      {/* Avatar button — always visible */}
      <button
        onClick={() => setShowPicker(!showPicker)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-gray-200 hover:border-[#A29BFE] hover:shadow-md transition-all"
      >
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: color }}
        >
          {currentUser ? currentUser[0] : '?'}
        </span>
        <span className="text-sm font-bold text-slate-800 hidden sm:inline">
          {currentUser || 'Choose'}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-500" />
      </button>

      {/* Picker modal */}
      {showPicker && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-3 min-w-[200px]">
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Who's practising?</p>
              <button onClick={() => setShowPicker(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {USERS.map(name => {
                const isActive = currentUser === name;
                const c = NAME_COLORS[name];
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onSetCurrentUser(name);
                      setShowPicker(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#EDE8FF] ring-2 ring-[#A29BFE]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: c }}
                    >
                      {name[0]}
                    </span>
                    <span className={`font-bold text-sm ${isActive ? 'text-[#7C3AED]' : 'text-slate-800'}`}>
                      {name}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-[#7C3AED] font-medium">Active</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export { USERS, NAME_COLORS };
export default UserAvatar;
