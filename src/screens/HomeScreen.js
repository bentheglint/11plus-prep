import React from 'react';
import { BookOpen, Calculator, Brain, GraduationCap, BarChart3, Wrench } from 'lucide-react';

function SubjectCard({ title, icon: Icon, gradient, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-8 transition-all transform hover:scale-[1.03] shadow-lg hover:shadow-xl animate-scale-in`}
    >
      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
        <Icon className="w-9 h-9" />
      </div>
      <h3 className="text-2xl font-heading font-bold">{title}</h3>
    </button>
  );
}

function HomeScreen({ currentUser, onSetCurrentUser, onSubjectSelect, onViewProgress, onSpeedReview }) {
  const nameColors = { Ben: '#0984E3', Lauren: '#00B894', Daisy: '#E84393', Evie: '#FDCB6E' };

  return (
    <div className="app-bg p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 mt-8 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-[#2D3436]">
              11+ Test Prep
            </h1>
          </div>
          <p className="text-sm text-[#636E72] mb-1">Built by Ben</p>
          <p className="text-lg text-[#636E72] font-medium">Choose a subject to start practising!</p>
        </div>

        {/* Name picker */}
        <div className="mb-6 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <p className="text-sm font-medium text-[#636E72] mb-3">Who's practising?</p>
          <div className="flex justify-center gap-3">
            {['Ben', 'Lauren', 'Daisy', 'Evie'].map(name => (
              <button
                key={name}
                onClick={() => onSetCurrentUser(name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${
                  currentUser === name
                    ? 'text-white shadow-lg ring-2 ring-offset-2'
                    : 'bg-white/80 text-[#2D3436] border-2 border-white/60 hover:border-[#A29BFE] hover:shadow-md'
                }`}
                style={currentUser === name ? {
                  background: nameColors[name],
                  ringColor: nameColors[name],
                  '--tw-ring-color': nameColors[name]
                } : {}}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: nameColors[name] }}
                >
                  {name[0]}
                </span>
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <button
            onClick={onViewProgress}
            className="flex items-center gap-3 px-6 py-3 bg-white text-[#2D3436] font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-5 h-5 text-[#6C5CE7]" />
            <span className="font-heading">View My Progress</span>
          </button>
          {(currentUser === 'Ben' || currentUser === 'Lauren' || currentUser === 'Daisy') && (
            <button
              onClick={onSpeedReview}
              className="flex items-center gap-3 px-6 py-3 bg-white text-[#2D3436] font-bold rounded-xl border border-amber-300 hover:bg-amber-50 transition-colors"
            >
              <Wrench className="w-5 h-5 text-amber-500" />
              <span className="font-heading">Speed Review</span>
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 stagger-children">
          <SubjectCard
            title="Maths"
            icon={Calculator}
            gradient="from-[#0984E3] to-[#0652DD]"
            onClick={() => onSubjectSelect('maths')}
          />
          <SubjectCard
            title="English"
            icon={BookOpen}
            gradient="from-[#00B894] to-[#00876A]"
            onClick={() => onSubjectSelect('english')}
          />
          <SubjectCard
            title="Verbal Reasoning"
            icon={Brain}
            gradient="from-[#6C5CE7] to-[#5A4BD1]"
            onClick={() => onSubjectSelect('verbalreasoning')}
          />
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
