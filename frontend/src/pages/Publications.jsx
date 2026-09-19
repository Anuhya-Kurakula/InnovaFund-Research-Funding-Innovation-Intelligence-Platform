import {useState} from 'react';
import {api} from '../services/api';

const Icon=({name,size=18})=>{
 const p={search:<><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,file:<><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></>,bookmark:<><path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21z"/></>,arrow:<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>};
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{p[name]}</svg>
};

export default function Publications(){
 const [q,setQ]=useState('machine learning'),[results,setResults]=useState([]),[error,setError]=useState(''),[loading,setLoading]=useState(false),[searched,setSearched]=useState(false);
 const search=async()=>{setLoading(true);setError('');setSearched(true);try{setResults((await api(`/publications/search?q=${encodeURIComponent(q)}`)).results||[])}catch(e){setError(e.message)}finally{setLoading(false)}};
 const save=async(r)=>{try{await api('/profile/publications',{method:'POST',body:JSON.stringify(r)});alert('Publication saved to your profile')}catch(e){setError(e.message)}};
 return <section>
  <div className="page-head"><div><span className="eyebrow">OpenAlex</span><h1>Publications</h1><p>Search and discover research papers from OpenAlex.</p></div></div>
  <div className="search-box"><Icon name="search"/><input aria-label="Publication search" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="Search publications, topics, authors..." /><button className="button" onClick={search}>Search <Icon name="arrow" size={17}/></button></div>
  {searched&&!loading&&<div className="result-count">About {results.length.toLocaleString()} results found</div>}
  {loading&&<div className="loading">Searching OpenAlex…</div>}
  {error&&<p className="error">{error}</p>}
  <div className="stack">
   {results.map((r,i)=><article className="card publication-card" key={r.external_id||i}>
    <div className={`doc-icon ${i%3===1?'green':i%3===2?'purple':''}`}><Icon name="file" size={25}/></div>
    <div>
      <h3 className="result-title">{r.title}</h3>
      <div className="meta"><span>{r.venue||'Unknown venue'}</span><span>·</span><span>{r.publication_date||'No date'}</span><span>·</span><span className="accent">{Number(r.citation_count||0).toLocaleString()} citations</span></div>
      <p className="authors">{r.authors?.slice(0,5).join(', ')||'Author information unavailable'}</p>
      <span className="tag">Research</span>
    </div>
    <div className="result-actions"><button className="bookmark" title="Bookmark"><Icon name="bookmark"/></button><button className="button" onClick={()=>save(r)}>Save</button></div>
   </article>)}
   {!loading&&searched&&!results.length&&!error&&<div className="card state">No publications found. Try another search.</div>}
  </div>
 </section>
}
