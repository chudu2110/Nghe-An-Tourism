import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ExternalLink, MapPin, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Section from '../components/Section';
import { useI18n } from '../i18n';
import { buildSiteDocs, searchSite } from '../services/siteSearch';

type WebResult = {
  title: string;
  url: string;
  snippet?: string;
};

function googleMapsSearchUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

function duckDuckGoSearchUrl(q: string) {
  return `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
}

function normalizeQuery(q: string | null) {
  return (q ?? '').trim();
}

function flattenDuckDuckGoTopics(topics: any[]): WebResult[] {
  const results: WebResult[] = [];

  const visit = (node: any) => {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (Array.isArray(node.Topics)) {
      visit(node.Topics);
      return;
    }
    const title = typeof node.Text === 'string' ? node.Text : '';
    const url = typeof node.FirstURL === 'string' ? node.FirstURL : '';
    if (!title || !url) return;
    results.push({ title, url });
  };

  visit(topics);
  return results;
}

async function fetchDuckDuckGoResults(q: string, signal: AbortSignal): Promise<WebResult[]> {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&no_html=1&skip_disambig=1`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`DuckDuckGo error: ${res.status}`);
  const data = await res.json();

  const results: WebResult[] = [];
  if (typeof data?.Heading === 'string' && typeof data?.AbstractURL === 'string' && data.Heading && data.AbstractURL) {
    results.push({
      title: data.Heading,
      url: data.AbstractURL,
      snippet: typeof data?.AbstractText === 'string' ? data.AbstractText : undefined,
    });
  }

  const related = Array.isArray(data?.RelatedTopics) ? flattenDuckDuckGoTopics(data.RelatedTopics) : [];
  related.forEach((r) => results.push(r));

  const seen = new Set<string>();
  return results.filter((r) => {
    const key = r.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function SearchResults() {
  const { t } = useI18n();
  const location = useLocation();
  const q = useMemo(() => normalizeQuery(new URLSearchParams(location.search).get('q')), [location.search]);
  const siteDocs = useMemo(() => buildSiteDocs(t), [t]);
  const siteResults = useMemo(() => searchSite(siteDocs, q, 12), [siteDocs, q]);
  const [results, setResults] = useState<WebResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    fetchDuckDuckGoResults(q, controller.signal)
      .then((items) => setResults(items))
      .catch((e) => {
        if (controller.signal.aborted) return;
        setError(e instanceof Error ? e.message : 'Search error');
        setResults([]);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [q]);

  return (
    <div className="bg-white">
      <Section title={q ? `${t('Tìm kiếm')}: ${q}` : t('Tìm kiếm')} subtitle="Kết quả trong website & trên web">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Search size={18} />
              <span className="text-sm">{q ? `Từ khóa: ${q}` : t('Bạn muốn đi đâu?')}</span>
            </div>

            {q && (
              <div className="flex gap-2">
                <a
                  href={googleMapsSearchUrl(q)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 hover:border-gray-300 text-sm font-semibold text-gray-800"
                >
                  <MapPin size={16} />
                  Google Maps
                  <ExternalLink size={14} />
                </a>
                <a
                  href={duckDuckGoSearchUrl(q)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900 hover:bg-black text-sm font-semibold text-white"
                >
                  DuckDuckGo
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {!q && (
            <div className="mt-10 text-center text-gray-600">
              <p className="text-lg">{t('Bạn muốn đi đâu?')}</p>
              <p className="text-sm mt-2">
                <Link to="/" className="text-red-600 font-semibold hover:underline">
                  Quay lại trang Home
                </Link>
              </p>
            </div>
          )}

          {q && (
            <div className="mt-10 space-y-12">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-900">Trong website</h3>
                  <span className="text-xs text-gray-400">{siteResults.length} kết quả</span>
                </div>

                <div className="mt-4 space-y-3">
                  {siteResults.length === 0 && <p className="text-gray-600">{t('Không tìm thấy kết quả')}</p>}
                  {siteResults.map((r) => (
                    <Link
                      key={r.doc.id}
                      to={r.doc.path}
                      className="block p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{r.doc.title}</p>
                          {r.snippet && <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis">{r.snippet}</p>}
                          <p className="text-xs text-gray-400 mt-2 truncate">{r.doc.kind} • {r.doc.path}</p>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-[0.3em] uppercase text-gray-900">Trên web</h3>
                <div className="mt-4">
                  {isLoading && <p className="text-gray-600">Đang tải...</p>}
                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  {!isLoading && !error && results.length === 0 && (
                    <p className="text-gray-600">{t('Không tìm thấy kết quả')}</p>
                  )}

                  <div className="space-y-4">
                    {results.slice(0, 12).map((r) => (
                      <a
                        key={r.url}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 truncate">{r.title}</p>
                            {r.snippet && <p className="text-sm text-gray-600 mt-1 overflow-hidden text-ellipsis">{r.snippet}</p>}
                            <p className="text-xs text-gray-400 mt-2 truncate">{r.url}</p>
                          </div>
                          <ExternalLink size={16} className="text-gray-400 shrink-0 mt-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}
