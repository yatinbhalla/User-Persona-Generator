import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { 
  User, 
  Briefcase, 
  MapPin, 
  GraduationCap, 
  Wallet, 
  Users, 
  Quote, 
  Target, 
  Flame, 
  Brain, 
  Smartphone, 
  HelpCircle,
  TrendingUp,
  Download,
  FileJson,
  Info
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { GeneratedPersona } from '../types';

interface PersonaCardProps {
  data: GeneratedPersona;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `persona-${data.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `persona-${data.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const Section = ({ title, icon: Icon, children, bgColor = "bg-white" }: { title: string, icon: any, children: React.ReactNode, bgColor?: string }) => (
    <div className={`${bgColor} rounded-lg p-4 shadow-sm border border-slate-100 flex flex-col h-full`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
          <Icon size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{title}</h3>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );

  const ListItem = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-2 text-[13px] text-slate-600 mb-1.5 leading-snug">
      <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-400 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">
      {/* Container to capture */}
      <div 
        ref={cardRef} 
        className="bg-white text-slate-900 p-8 shadow-2xl rounded-sm font-sans border border-slate-200"
        style={{ minWidth: '1000px' }}
      >
        {/* Top Header */}
        <div className="flex justify-between items-end mb-6 border-b-2 border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
              USER PERSONA: <span className="text-slate-500">{data.occupation.toUpperCase()}</span>
            </p>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">
              {data.name.toUpperCase()}, {data.age}: <span className="text-indigo-600">{data.tagline.toUpperCase()}</span>
            </h1>
          </div>
          <div className="text-right pb-1">
            <div className="flex items-center gap-2 justify-end">
              <span className="text-3xl font-black tracking-tighter leading-none">
                <span className="text-slate-900">Persona</span>
                <span className="text-indigo-600">Gen</span>
              </span>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI-POWERED INSIGHTS</p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="mb-8 bg-indigo-50/50 p-4 border-l-4 border-indigo-500 rounded-r-lg">
          <p className="text-lg font-bold text-slate-800 italic leading-tight">
            "{data.quote}"
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-5 mb-8">
          
          {/* Left Column: Photo & Stats */}
          <div className="col-span-4 space-y-5">
            <div className="aspect-[4/3] overflow-hidden rounded-xl border-4 border-white shadow-xl bg-slate-100">
              <img 
                src={data.imageUrl} 
                className="w-full h-full object-cover" 
                alt={data.name}
                crossOrigin="anonymous" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: User, label: "AGE", value: data.age },
                { icon: Briefcase, label: "OCCUPATION", value: data.occupation },
                { icon: MapPin, label: "LOCATION", value: data.location },
                { icon: GraduationCap, label: "EDUCATION", value: data.education },
                { icon: Wallet, label: "INCOME", value: data.monthlyIncome },
                { icon: Users, label: "FAMILY", value: data.family },
              ].map((item, i) => (
                <div key={i} className="flex gap-2.5 items-center p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                  <div className="text-indigo-600"><item.icon size={18} /></div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{item.label}</p>
                    <p className="text-xs font-bold text-slate-700 leading-tight truncate max-w-[90px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Column: Bio & Economics */}
          <div className="col-span-4 space-y-5">
            <Section title={`ABOUT ${data.name.split(' ')[0].toUpperCase()}`} icon={Info} bgColor="bg-blue-50/30">
              <p className="text-[13px] text-slate-600 leading-relaxed italic border-l-2 border-blue-200 pl-3">
                {data.about}
              </p>
            </Section>

            <Section title="FINANCIAL BEHAVIOR" icon={Wallet} bgColor="bg-emerald-50/30">
              <ul className="list-none">
                {data.financialBehavior.map((item, i) => <ListItem key={i}>{item}</ListItem>)}
              </ul>
            </Section>

            <Section title="INCOME & EXPENSE SNAPSHOT" icon={TrendingUp} bgColor="bg-rose-50/30">
              <div className="flex gap-3 mb-3">
                <div className="flex-1 p-2 bg-emerald-100/50 rounded text-center border border-emerald-200">
                  <p className="text-[9px] font-bold text-emerald-700 uppercase">Total Income</p>
                  <p className="text-sm font-black text-emerald-900">{data.incomeAndExpense.totalIncome}</p>
                </div>
                <div className="flex-1 p-2 bg-rose-100/50 rounded text-center border border-rose-200">
                  <p className="text-[9px] font-bold text-rose-700 uppercase">Total Expenses</p>
                  <p className="text-sm font-black text-rose-900">{data.incomeAndExpense.totalExpenses}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic leading-tight">{data.incomeAndExpense.details}</p>
            </Section>
          </div>

          {/* Right Column: Traits & Tech */}
          <div className="col-span-4 space-y-5">
            <Section title="BEHAVIOR & MINDSET" icon={Brain} bgColor="bg-purple-50/30">
              <ul className="list-none">
                {data.behaviorAndMindset.map((item, i) => <ListItem key={i}>{item}</ListItem>)}
              </ul>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-2">GOALS & ASPIRATIONS</h4>
                <ul className="list-none">
                  {data.goalsAndAspirations.map((item, i) => <ListItem key={i}>{item}</ListItem>)}
                </ul>
              </div>
            </Section>

            <Section title="PAIN POINTS" icon={Flame} bgColor="bg-orange-50/30">
              <ul className="list-none">
                {data.painPoints.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 mb-2 leading-tight">
                    <span className="mt-1 h-2 w-2 rounded bg-orange-400/50 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section title="DIGITAL USAGE" icon={Smartphone} bgColor="bg-slate-50/50">
              <div className="flex gap-4 items-center">
                <div className="w-24 h-24 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.digitalUsage}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="percentage"
                        stroke="none"
                      >
                        {data.digitalUsage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color.includes('blue') ? '#3b82f6' : entry.color.includes('green') ? '#22c55e' : entry.color.includes('orange') ? '#f97316' : '#94a3b8'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1">
                  {data.digitalUsage.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                      <span className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="uppercase">{item.label} {item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </div>
        </div>

        {/* Footer Row */}
        <div className="grid grid-cols-4 gap-4 pt-6 border-t font-bold border-slate-100">
           <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-[10px] text-slate-400 uppercase mb-2 flex items-center gap-1.5"><Quote size={10}/> IN A NUTSHELL</h4>
              <p className="text-[11px] text-slate-600 leading-tight italic">
                {data.howHelp[0] || "A complete profile of needs and behaviors."}
              </p>
           </div>
           
           <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-[10px] text-slate-400 uppercase mb-2 flex items-center gap-1.5"><Target size={10}/> PREFERRED SUPPORT</h4>
              <div className="flex flex-wrap gap-1.5">
                {data.preferredSupport.map((s, i) => (
                  <span key={i} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded uppercase text-slate-500">{s}</span>
                ))}
              </div>
           </div>

           <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="text-[10px] text-slate-400 uppercase mb-2 flex items-center gap-1.5"><Users size={10}/> MARKET SIZE</h4>
              <p className="text-xl font-black text-indigo-600 tracking-tighter leading-none">{data.marketSize}</p>
              <p className="text-[9px] text-slate-400 uppercase mt-1">ESTIMATED REACH</p>
           </div>

           <div className="bg-slate-50 p-4 rounded-lg flex flex-col justify-center">
              <h4 className="text-[10px] text-slate-400 uppercase mb-1">OUR PHILOSOPHY</h4>
              <p className="text-[11px] text-slate-500 italic leading-snug">
                Helping businesses truly see the human behind the target audience.
              </p>
           </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-center gap-4 mt-4">
        <button
          onClick={handleExportJSON}
          className="group flex items-center gap-2 px-6 py-3 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-full transition-all hover:border-slate-600"
        >
          <FileJson size={18} className="group-hover:scale-110 transition-transform" />
          Export Data
        </button>

        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="group flex items-center gap-2 px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 rounded-full shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isExporting ? (
            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
          )}
          Download Infographic
        </button>
      </div>
    </div>
  );
};

export default PersonaCard;
