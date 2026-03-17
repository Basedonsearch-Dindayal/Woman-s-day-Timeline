"use client";
import React, { useState, useMemo, useEffect } from 'react';
import './Timeline.css';
import { legacyCollection } from './data';

const ImageResolver = ({ target }: { target: string }) => {
  const [source, setSource] = useState<string>("");
  const [isResolving, setIsResolving] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const query = encodeURIComponent(target);
        const api = `https://en.wikipedia.org/w/api.php?action=query&titles=${query}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
        const res = await fetch(api);
        const json = await res.json();
        const pages = json.query.pages;
        const id = Object.keys(pages)[0];
        const path = pages[id].thumbnail?.source;

        setSource(path || `https://ui-avatars.com/api/?name=${target}&background=D4AF37&color=000`);
      } catch {
        setSource(`https://ui-avatars.com/api/?name=${target}&background=D4AF37&color=000`);
      } finally {
        setIsResolving(false);
      }
    };
    fetchAsset();
  }, [target]);

  return (
    <div className={`media_container ${isResolving ? 'shimmer_base' : ''}`}>
      {!isResolving && <img src={source} alt={target} className="image_reveal" />}
    </div>
  );
};

export default function WomanhoodApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterKey, setFilterKey] = useState("All");

  const categories = ["Science", "Sports", "Politics", "Education", "Aviation", "Medicine", "Adventure", "Public Service"];

  const filteredItems = useMemo(() => {
    return legacyCollection.filter((item) => {
      const matchText = item.iconName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchKey = filterKey === "All" || item.discipline === filterKey;
      return matchText && matchKey;
    });
  }, [searchTerm, filterKey]);

  const handleExternalLink = (name: string) => {
    const link = `https://en.wikipedia.org/wiki/${encodeURIComponent(name.replace(/ /g, "_"))}`;
    window.open(link, "_blank");
  };

  return (
    <div className="wh_root">
      <header className="wh_hero">
        <div className="wh_mandala"></div>
        <div className="wh_hero_text">
          <h1 className="wh_tagline">Happy Woman's Day</h1>
          <h1 className="wh_logo">WOMANHOOD</h1>
          <p className="wh_tagline">The Undefeated 50-Year Legacy of Indian Womanhood</p>
        </div>
      </header>

      <nav className="wh_controls">
        <div className="wh_nav_inner">
          <input 
            type="text" 
            placeholder="Explore by name..." 
            className="wh_search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="wh_filter_bar">
            <button onClick={() => setFilterKey("All")} className={filterKey === "All" ? "wh_chip active" : "wh_chip"}>All</button>
            {categories.map(c => (
              <button key={c} onClick={() => setFilterKey(c)} className={filterKey === c ? "wh_chip active" : "wh_chip"}>{c}</button>
            ))}
          </div>
        </div>
      </nav>

      <main className="wh_timeline">
        <div className="wh_spine"></div>
        {filteredItems.map((entry, idx) => (
          <div key={idx} className={`wh_row ${idx % 2 === 0 ? 'wh_l' : 'wh_r'}`}>
            <div className="wh_node"><div className="wh_node_dot"></div></div>
            <article className="wh_card">
              <div className="wh_visual">
                <ImageResolver target={entry.iconName} />
                <div className="wh_period">{entry.period}</div>
              </div>
              <div className="wh_content">
                <span className="wh_sector">{entry.discipline}</span>
                <h2 className="wh_name">{entry.iconName}</h2>
                <p className="wh_info">{entry.narrative}</p>
                <button className="wh_link" onClick={() => handleExternalLink(entry.iconName)}>
                  Learn More <span>→</span>
                </button>
              </div>
            </article>
          </div>
        ))}
      </main>

      <footer className="wh_footer">
        <p>WOMANHOOD ARCHIVES 2026 | INTERNATIONAL WOMEN'S DAY</p>
      </footer>
    </div>
  );
}