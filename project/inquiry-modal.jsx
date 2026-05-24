// inquiry-modal.jsx — Almeja Azul Global Inquiry Form
// Loads on any page; call window.openInquiry(type?) to show.

(function(){
  const style=document.createElement('style');
  style.textContent=`
    .alm-inq-overlay{position:fixed;inset:0;z-index:800;background:rgba(26,37,48,0.78);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;pointer-events:none;transition:opacity 0.35s cubic-bezier(0.16,1,0.3,1);}
    .alm-inq-overlay.on{opacity:1;pointer-events:all;}
    .alm-inq-box{background:#faf8f4;border-radius:10px;width:100%;max-width:880px;max-height:92vh;overflow:hidden;display:grid;grid-template-columns:220px 1fr;position:relative;transform:translateY(22px) scale(0.97);transition:transform 0.42s cubic-bezier(0.16,1,0.3,1);}
    .alm-inq-overlay.on .alm-inq-box{transform:none;}
    .alm-inq-side{background:var(--c-teal);padding:40px 28px;display:flex;flex-direction:column;gap:0;}
    .alm-inq-side-logo{max-width:150px;height:auto;width:100%;object-fit:contain;object-position:left center;flex-shrink:0;filter:brightness(0) invert(1);opacity:0.88;margin-bottom:28px;}
    .alm-inq-side h3{font-family:var(--ff-s);font-size:24px;font-weight:300;color:#fff;line-height:1.2;margin-bottom:auto;}
    .alm-inq-side h3 em{font-style:italic;color:var(--c-brand);}
    .alm-inq-bullets{display:flex;flex-direction:column;gap:11px;margin-top:32px;}
    .alm-inq-bullet{font-size:12px;font-weight:300;color:rgba(255,255,255,0.65);line-height:1.5;padding-left:14px;position:relative;}
    .alm-inq-bullet::before{content:'';position:absolute;left:0;top:6px;width:4px;height:4px;border-radius:50%;background:var(--c-brand);}
    .alm-inq-body{padding:32px 36px;overflow-y:auto;max-height:92vh;}
    .alm-inq-close{position:absolute;top:14px;right:14px;z-index:20;width:34px;height:34px;border-radius:50%;background:rgba(26,37,48,0.07);border:1px solid rgba(26,37,48,0.1);color:var(--c-ink);cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;transition:background 0.2s;font-family:var(--ff-n);}
    .alm-inq-close:hover{background:rgba(26,37,48,0.14);}
    .alm-inq-lbl{font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(26,37,48,0.42);display:block;margin-bottom:6px;}
    .alm-inq-inp{width:100%;padding:10px 13px;background:#fff;border:1.5px solid rgba(26,37,48,0.12);border-radius:6px;font-family:var(--ff-n);font-size:14px;color:var(--c-ink);outline:none;transition:border-color 0.2s;box-sizing:border-box;}
    .alm-inq-inp:focus{border-color:var(--c-brand);}
    .alm-inq-ta{resize:vertical;min-height:86px;}
    .alm-inq-cc{flex-shrink:0;padding:10px 8px;background:#fff;border:1.5px solid rgba(26,37,48,0.12);border-radius:6px;font-family:var(--ff-n);font-size:13px;color:var(--c-ink);outline:none;cursor:pointer;width:108px;}
    .alm-inq-pills{display:flex;flex-wrap:wrap;gap:7px;}
    .alm-inq-pill{padding:6px 13px;border:1px solid rgba(26,37,48,0.18);border-radius:100px;font-size:11px;font-family:var(--ff-n);color:rgba(26,37,48,0.62);cursor:pointer;background:transparent;transition:all 0.2s;line-height:1;}
    .alm-inq-pill.on{background:var(--c-brand);border-color:var(--c-brand);color:var(--c-ink);font-weight:600;}
    .alm-inq-row{margin-bottom:15px;}
    .alm-inq-2col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:15px;}
    .alm-inq-submit{width:100%;padding:14px;background:var(--c-brand);color:var(--c-ink);border:none;border-radius:100px;font-family:var(--ff-n);font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;margin-top:18px;transition:background 0.3s,transform 0.25s;}
    .alm-inq-submit:hover{background:var(--c-brand-dk);color:#fff;transform:translateY(-1px);}
    .alm-inq-done{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:48px 24px;min-height:340px;}
    @media(max-width:640px){.alm-inq-box{grid-template-columns:1fr;border-radius:0;max-height:100dvh;}.alm-inq-side{display:none;}.alm-inq-body{max-height:100dvh;}.alm-inq-2col{grid-template-columns:1fr;}}
  `;
  document.head.appendChild(style);

  const mountEl=document.createElement('div');
  mountEl.id='almeja-inq-root';
  document.body.appendChild(mountEl);

  const CC=[
    {v:'+63',t:'+63 Philippines'},{v:'+1',t:'+1 US / Canada'},
    {v:'+61',t:'+61 Australia'},{v:'+44',t:'+44 United Kingdom'},
    {v:'+65',t:'+65 Singapore'},{v:'+81',t:'+81 Japan'},
    {v:'+82',t:'+82 South Korea'},{v:'+971',t:'+971 UAE'},
    {v:'+64',t:'+64 New Zealand'},{v:'+60',t:'+60 Malaysia'},
    {v:'+66',t:'+66 Thailand'},{v:'+49',t:'+49 Germany'},
    {v:'+33',t:'+33 France'},{v:'+86',t:'+86 China'},
  ];

  const TYPES=['Room Reservation','Day Tour','Corporate & Team Building','Destination Wedding','Island Tour','Function Hall / Venue','General Inquiry'];

  function InquiryModal({open,initType,onClose}){
    const {useState,useEffect}=React;
    const [anim,setAnim]=useState(false);
    const [done,setDone]=useState(false);
    const [f,setF]=useState({name:'',email:'',cc:'+63',phone:'',type:'',guests:'',arrival:'',departure:'',message:''});
    const set=(k,v)=>setF(p=>({...p,[k]:v}));

    useEffect(()=>{
      if(!open){setAnim(false);return;}
      setDone(false);
      setF(p=>({...p,type:initType||''}));
      const t=setTimeout(()=>setAnim(true),10);
      const esc=e=>e.key==='Escape'&&onClose();
      document.addEventListener('keydown',esc);
      document.body.style.overflow='hidden';
      return()=>{clearTimeout(t);document.removeEventListener('keydown',esc);document.body.style.overflow='';};
    },[open,initType]);

    if(!open)return null;
    const isDayTour=f.type==='Day Tour';

    return(
      <div className={`alm-inq-overlay${anim?' on':''}`} onClick={e=>e.target===e.currentTarget&&onClose()}>
        <div className="alm-inq-box">
          <button className="alm-inq-close" onClick={onClose}>✕</button>

          <div className="alm-inq-side">
            <img className="alm-inq-side-logo" src="uploads/Almeja Logo_Large_PNG.png" alt="Almeja Azul"/>
            <h3>Make your<br/><em>visit happen</em></h3>
          </div>

          <div className="alm-inq-body">
            {done?(
              <div className="alm-inq-done">
                <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(75,191,224,0.15)',border:'1.5px solid var(--c-brand)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--c-brand)',fontSize:20,marginBottom:20}}>✓</div>
                <h3 style={{fontFamily:'var(--ff-s)',fontSize:30,fontWeight:300,marginBottom:8}}>Inquiry received</h3>
                <p style={{fontSize:13,color:'rgba(26,37,48,0.55)',maxWidth:300,lineHeight:1.75,marginBottom:28}}>Thank you{f.name?' '+f.name.split(' ')[0]:''}, our team will be in touch shortly. For the fastest response, continue on Messenger.</p>
                <a href="https://m.me/AlmejaAzulResort" target="_blank" className="m-book" style={{display:'inline-block',padding:'13px 28px',borderRadius:100,textDecoration:'none',fontSize:11,letterSpacing:'0.1em',textTransform:'uppercase',fontWeight:700}}>Continue on Messenger →</a>
                <button onClick={onClose} style={{display:'block',marginTop:14,background:'none',border:'none',fontFamily:'var(--ff-n)',fontSize:12,color:'rgba(26,37,48,0.4)',cursor:'pointer',textDecoration:'underline'}}>Close</button>
              </div>
            ):(
              <form onSubmit={e=>{e.preventDefault();setDone(true);}}>
                <p style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--c-brand)',marginBottom:4}}>Inquiry</p>
                <h3 style={{fontFamily:'var(--ff-s)',fontSize:26,fontWeight:300,marginBottom:2}}>Plan your visit</h3>
                <p style={{fontSize:12,color:'rgba(26,37,48,0.45)',marginBottom:22,lineHeight:1.5}}>Fill in your details and we'll tailor a quote.</p>

                <div className="alm-inq-2col">
                  <div><label className="alm-inq-lbl">Full Name *</label><input required className="alm-inq-inp" type="text" placeholder="Juan dela Cruz" value={f.name} onChange={e=>set('name',e.target.value)}/></div>
                  <div><label className="alm-inq-lbl">Email *</label><input required className="alm-inq-inp" type="email" placeholder="you@email.com" value={f.email} onChange={e=>set('email',e.target.value)}/></div>
                </div>

                <div className="alm-inq-row">
                  <label className="alm-inq-lbl">Phone Number</label>
                  <div style={{display:'flex',gap:8}}>
                    <select className="alm-inq-cc" value={f.cc} onChange={e=>set('cc',e.target.value)}>
                      {CC.map(c=><option key={c.t} value={c.v}>{c.t}</option>)}
                    </select>
                    <input className="alm-inq-inp" type="tel" placeholder="9XX XXX XXXX" value={f.phone} onChange={e=>set('phone',e.target.value)} style={{flex:1}}/>
                  </div>
                </div>

                <div className="alm-inq-row">
                  <label className="alm-inq-lbl">Inquiry Type</label>
                  <div className="alm-inq-pills">
                    {TYPES.map(t=><button type="button" key={t} className={`alm-inq-pill${f.type===t?' on':''}`} onClick={()=>set('type',f.type===t?'':t)}>{t}</button>)}
                  </div>
                </div>

                <div className="alm-inq-2col">
                  <div><label className="alm-inq-lbl">Number of Guests</label><input className="alm-inq-inp" type="number" min="1" placeholder="e.g. 4" value={f.guests} onChange={e=>set('guests',e.target.value)}/></div>
                  <div><label className="alm-inq-lbl">Arrival / Visit Date</label><input className="alm-inq-inp" type="date" value={f.arrival} onChange={e=>set('arrival',e.target.value)}/></div>
                </div>

                {!isDayTour&&(
                  <div className="alm-inq-row">
                    <label className="alm-inq-lbl">Departure Date</label>
                    <input className="alm-inq-inp" type="date" value={f.departure} min={f.arrival} onChange={e=>set('departure',e.target.value)}/>
                  </div>
                )}

                <div className="alm-inq-row">
                  <label className="alm-inq-lbl">Message</label>
                  <textarea className="alm-inq-inp alm-inq-ta" placeholder="Tell us what you have in mind…" value={f.message} onChange={e=>set('message',e.target.value)}/>
                </div>

                <button type="submit" className="alm-inq-submit">Send Inquiry →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  function InquiryApp(){
    const [s,setS]=React.useState({open:false,type:null});
    React.useEffect(()=>{
      window.openInquiry=t=>setS({open:true,type:t||null});
      window.closeInquiry=()=>setS(p=>({...p,open:false}));
    },[]);
    return React.createElement(InquiryModal,{open:s.open,initType:s.type,onClose:()=>setS(p=>({...p,open:false}))});
  }

  ReactDOM.createRoot(mountEl).render(React.createElement(InquiryApp));
})();
