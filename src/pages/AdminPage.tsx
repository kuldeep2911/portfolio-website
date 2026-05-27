import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { seedDatabase } from '../data/usePortfolioData'
import type {
  ProfileData, BrainNode, ProjectData, SkillData, OngoingData, SocialLinkData
} from '../data/usePortfolioData'

// ─── Tiny reusable components ─────────────────────────────────────────────────

const s = {
  section: { marginBottom: 32, background: '#1a1a1a', borderRadius: 8, padding: 24, border: '1px solid #333' } as React.CSSProperties,
  label: { display: 'block', fontSize: 12, color: '#888', marginBottom: 4, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  input: { width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 6, color: '#fff', padding: '8px 12px', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const },
  textarea: { width: '100%', background: '#0d0d0d', border: '1px solid #333', borderRadius: 6, color: '#fff', padding: '8px 12px', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' as const, minHeight: 80, resize: 'vertical' as const },
  btn: { background: '#E0003C', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontSize: 14, fontWeight: 600 } as React.CSSProperties,
  btnSecondary: { background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontSize: 14 } as React.CSSProperties,
  btnDanger: { background: '#5a0010', color: '#ff6b8a', border: '1px solid #7a0018', borderRadius: 6, padding: '6px 14px', cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
  row: { display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16, background: '#111', padding: 16, borderRadius: 8, border: '1px solid #2a2a2a' } as React.CSSProperties,
  card: { flex: 1 } as React.CSSProperties,
  h3: { color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 16px 0' },
  success: { background: '#0d2e0d', border: '1px solid #1a5c1a', color: '#4caf50', padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 },
  error: { background: '#2e0d0d', border: '1px solid #5c1a1a', color: '#f44336', padding: '10px 16px', borderRadius: 6, marginBottom: 16, fontSize: 14 },
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return <div style={type === 'success' ? s.success : s.error}>{msg}</div>
}

// ─── TABS ────────────────────────────────────────────────────────────────────

const TABS = ['About', 'Brain Map', 'Projects', 'Skills', 'Ongoing', 'Contact', 'Setup']

// ─── ABOUT TAB ───────────────────────────────────────────────────────────────

function AboutTab() {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single().then(({ data }) => {
      if (data) setProfile(data)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    if (!profile) return
    const { id, updated_at, created_at, ...rest } = profile as any
    // update instead of upsert to avoid modifying the identity column
    const { error } = await supabase.from('profile').update(rest).eq('id', id || 1)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: 'Saved!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const updateLine = (i: number, val: string) => {
    if (!profile) return
    const lines = [...profile.robot_lines]
    lines[i] = val
    setProfile({ ...profile, robot_lines: lines })
  }

  const addLine = () => {
    if (!profile) return
    setProfile({ ...profile, robot_lines: [...profile.robot_lines, ''] })
  }

  const removeLine = (i: number) => {
    if (!profile) return
    const lines = profile.robot_lines.filter((_, idx) => idx !== i)
    setProfile({ ...profile, robot_lines: lines })
  }

  const updateStat = (i: number, key: 'value' | 'label', val: string) => {
    if (!profile) return
    const stats = profile.stats.map((s, idx) => idx === i ? { ...s, [key]: val } : s)
    setProfile({ ...profile, stats })
  }

  const addStat = () => {
    if (!profile) return
    setProfile({ ...profile, stats: [...profile.stats, { value: '', label: '' }] })
  }

  const removeStat = (i: number) => {
    if (!profile) return
    const stats = profile.stats.filter((_, idx) => idx !== i)
    setProfile({ ...profile, stats })
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>
  if (!profile) return <p style={{ color: '#888' }}>No data — run Setup first.</p>

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={s.section}>
        <h3 style={s.h3}>Profile</h3>
        <label style={s.label}>Name</label>
        <input style={s.input} value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <label style={s.label}>Title</label>
        <input style={s.input} value={profile.title} onChange={e => setProfile({ ...profile, title: e.target.value })} />
        <label style={s.label}>Tagline</label>
        <input style={s.input} value={profile.tagline} onChange={e => setProfile({ ...profile, tagline: e.target.value })} />
        <label style={s.label}>Bio</label>
        <textarea style={s.textarea} value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
        <label style={s.label}>Email</label>
        <input style={s.input} value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
        <label style={s.label}>Location</label>
        <input style={s.input} value={profile.location} onChange={e => setProfile({ ...profile, location: e.target.value })} />
        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Years Experience</label>
            <input style={s.input} type="number" value={profile.years_of_experience} onChange={e => setProfile({ ...profile, years_of_experience: +e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Projects Completed</label>
            <input style={s.input} type="number" value={profile.projects_completed} onChange={e => setProfile({ ...profile, projects_completed: +e.target.value })} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Models Deployed</label>
            <input style={s.input} type="number" value={profile.models_deployed} onChange={e => setProfile({ ...profile, models_deployed: +e.target.value })} />
          </div>
        </div>
        <label style={s.label}>Available for Work</label>
        <select style={s.input} value={profile.available_for_work ? 'true' : 'false'} onChange={e => setProfile({ ...profile, available_for_work: e.target.value === 'true' })}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div style={s.section}>
        <h3 style={s.h3}>Robot Speech Lines (Hero Section)</h3>
        {profile.robot_lines.map((line, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <textarea style={{ ...s.textarea, marginBottom: 0, flex: 1 }} value={line} onChange={e => updateLine(i, e.target.value)} rows={2} />
            <button style={s.btnDanger} onClick={() => removeLine(i)}>✕</button>
          </div>
        ))}
        <button style={s.btnSecondary} onClick={addLine}>+ Add Line</button>
      </div>

      <div style={s.section}>
        <h3 style={s.h3}>Robot Speech (Contact Section)</h3>
        <textarea 
          style={{ ...s.textarea, minHeight: 60 }} 
          value={profile.contact_text || ''} 
          onChange={e => setProfile({ ...profile, contact_text: e.target.value })} 
          placeholder="I'll make sure Kuldeep reads your message first."
        />
      </div>

      <div style={s.section}>
        <h3 style={s.h3}>Stats Row (about section)</h3>
        {profile.stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 8, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Value</label>
              <input style={{ ...s.input, marginBottom: 0 }} value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Label</label>
              <input style={{ ...s.input, marginBottom: 0 }} value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
            </div>
            <button style={{ ...s.btnDanger, height: 42 }} onClick={() => removeStat(i)}>✕</button>
          </div>
        ))}
        <button style={s.btnSecondary} onClick={addStat}>+ Add Stat</button>
      </div>

      <button style={s.btn} onClick={save}>Save All</button>
    </div>
  )
}

// ─── BRAIN MAP TAB ────────────────────────────────────────────────────────────

function BrainMapTab() {
  const [nodes, setNodes] = useState<BrainNode[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  const ICONS = ['Brain', 'Database', 'Activity', 'Network', 'MessageSquare', 'FileText', 'Code', 'Cpu', 'Eye', 'Server']

  useEffect(() => {
    supabase.from('brain_nodes').select('*').order('sort_order').then(({ data }) => {
      if (data) setNodes(data)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    // Delete all then reinsert
    await supabase.from('brain_nodes').delete().neq('id', 0)
    const toInsert = nodes.map((n, i) => {
      const { id, updated_at, created_at, ...rest } = n as any
      return { ...rest, sort_order: i }
    })
    const { error } = await supabase.from('brain_nodes').insert(toInsert)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: 'Saved!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const update = (i: number, key: keyof BrainNode, val: string | number) => {
    setNodes(nodes.map((n, idx) => idx === i ? { ...n, [key]: val } : n))
  }

  const addNode = () => {
    setNodes([...nodes, { label: 'New Node', icon: 'Brain', x: 50, y: 50, cx: 50, cy: 50, dur: 3.0 }])
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>
  if (!nodes.length) return <div><p style={{ color: '#888' }}>No nodes — run Setup first.</p></div>

  return (
    <div>
      {toast && <Toast {...toast} />}
      {nodes.map((node, i) => (
        <div key={i} style={s.row}>
          <div style={s.card}>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 2 }}>
                <label style={s.label}>Label</label>
                <input style={{ ...s.input, marginBottom: 0 }} value={node.label} onChange={e => update(i, 'label', e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={s.label}>Icon</label>
                <select style={{ ...s.input, marginBottom: 0 }} value={node.icon} onChange={e => update(i, 'icon', e.target.value)}>
                  {ICONS.map(ic => <option key={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {(['x','y','cx','cy','dur'] as const).map(k => (
                <div key={k} style={{ flex: 1 }}>
                  <label style={s.label}>{k}</label>
                  <input style={{ ...s.input, marginBottom: 0 }} type="number" step={k === 'dur' ? 0.1 : 1} value={node[k]} onChange={e => update(i, k, +e.target.value)} />
                </div>
              ))}
            </div>
          </div>
          <button style={{ ...s.btnDanger, marginTop: 20 }} onClick={() => setNodes(nodes.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <button style={s.btnSecondary} onClick={addNode}>+ Add Node</button>
        <button style={s.btn} onClick={save}>Save All</button>
      </div>
    </div>
  )
}

// ─── PROJECTS TAB ─────────────────────────────────────────────────────────────

function ProjectsTab() {
  const [projects, setProjects] = useState<ProjectData[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(0)

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      if (data) setProjects(data)
      setLoading(false)
    })
  }, [])

  const save = async (p: ProjectData) => {
    const { error } = await supabase.from('projects').upsert(p)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: `"${p.title}" saved!`, type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const remove = async (id: string) => {
    await supabase.from('projects').delete().eq('id', id)
    setProjects(projects.filter(p => p.id !== id))
  }

  const update = (i: number, key: keyof ProjectData, val: unknown) => {
    setProjects(projects.map((p, idx) => idx === i ? { ...p, [key]: val } : p))
  }

  const addProject = () => {
    const newId = `project-${Date.now()}`
    setProjects([...projects, {
      id: newId, title: 'New Project', description: '', long_description: '',
      tags: [], category: 'ml', status: 'research', bento_texts: ['', '', ''],
      featured: false, year: new Date().getFullYear(), sort_order: projects.length
    }])
    setExpanded(projects.length)
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>

  return (
    <div>
      {toast && <Toast {...toast} />}
      {projects.map((p, i) => (
        <div key={p.id} style={{ ...s.section, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <h3 style={{ ...s.h3, margin: 0 }}>{p.title} <span style={{ color: '#555', fontSize: 13, fontWeight: 400 }}>({p.year})</span></h3>
            <span style={{ color: '#555' }}>{expanded === i ? '▲' : '▼'}</span>
          </div>

          {expanded === i && (
            <div style={{ marginTop: 16 }}>
              <label style={s.label}>ID (slug)</label>
              <input style={s.input} value={p.id} onChange={e => update(i, 'id', e.target.value)} />
              <label style={s.label}>Title</label>
              <input style={s.input} value={p.title} onChange={e => update(i, 'title', e.target.value)} />
              <label style={s.label}>Short Description</label>
              <textarea style={s.textarea} value={p.description} onChange={e => update(i, 'description', e.target.value)} />
              <label style={s.label}>Long Description</label>
              <textarea style={{ ...s.textarea, minHeight: 120 }} value={p.long_description} onChange={e => update(i, 'long_description', e.target.value)} />
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Category</label>
                  <input style={s.input} list="categories" value={p.category} onChange={e => update(i, 'category', e.target.value)} />
                  <datalist id="categories">
                    {['ml','nlp','cv','llm','data'].map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Status (leave blank to hide)</label>
                  <input style={s.input} list="statusList" value={p.status || ''} onChange={e => update(i, 'status', e.target.value)} />
                  <datalist id="statusList">
                    {['production','research','open-source'].map(c => <option key={c} value={c} />)}
                  </datalist>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Year</label>
                  <input style={s.input} type="number" value={p.year} onChange={e => update(i, 'year', +e.target.value)} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.label}>Featured</label>
                  <select style={s.input} value={p.featured ? 'true' : 'false'} onChange={e => update(i, 'featured', e.target.value === 'true')}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <label style={s.label}>Tags (comma-separated)</label>
              <input style={s.input} value={p.tags.join(',')} onChange={e => update(i, 'tags', e.target.value.split(','))} />
              <label style={s.label}>GitHub URL</label>
              <input style={s.input} value={p.github_url || ''} onChange={e => update(i, 'github_url', e.target.value)} />
              <label style={s.label}>Demo URL</label>
              <input style={s.input} value={p.demo_url || ''} onChange={e => update(i, 'demo_url', e.target.value)} />
              <label style={s.label}>Demo Video URL (Google Drive/YouTube)</label>
              <input style={s.input} value={p.video_url || ''} onChange={e => update(i, 'video_url', e.target.value)} />
              <label style={s.label}>Bento Box Texts (3 boxes)</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[0, 1, 2].map(bIdx => (
                  <textarea
                    key={bIdx}
                    style={{ ...s.textarea, flex: 1, minHeight: 80, marginBottom: 0 }}
                    value={p.bento_texts?.[bIdx] || ''}
                    onChange={e => {
                      const newBento = [...(p.bento_texts || ['', '', ''])]
                      newBento[bIdx] = e.target.value
                      update(i, 'bento_texts', newBento)
                    }}
                    placeholder={`Box ${bIdx + 1} text`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={s.btn} onClick={() => {
                  const pToSave = { ...p, tags: p.tags.map(t => t.trim()).filter(Boolean) }
                  save(pToSave)
                }}>Save</button>
                <button style={s.btnDanger} onClick={() => remove(p.id)}>Delete Project</button>
              </div>
            </div>
          )}
        </div>
      ))}
      <button style={s.btnSecondary} onClick={addProject}>+ Add Project</button>
    </div>
  )
}

// ─── SKILLS TAB ───────────────────────────────────────────────────────────────

function SkillsTab() {
  const [skillGroups, setSkillGroups] = useState<SkillData[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('skills').select('*').order('sort_order').then(({ data }) => {
      if (data) setSkillGroups(data)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    await supabase.from('skills').delete().neq('id', 0)
    const toInsert = skillGroups.map((sg, i) => {
      const { id, updated_at, created_at, ...rest } = sg as any
      return { ...rest, sort_order: i }
    })
    const { error } = await supabase.from('skills').insert(toInsert)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: 'Saved!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const updateCategory = (i: number, val: string) => {
    setSkillGroups(skillGroups.map((sg, idx) => idx === i ? { ...sg, category: val } : sg))
  }

  const updateItem = (gi: number, ii: number, key: 'name' | 'proficiency', val: string | number) => {
    setSkillGroups(skillGroups.map((sg, idx) => idx === gi ? {
      ...sg, items: sg.items.map((it, iidx) => iidx === ii ? { ...it, [key]: val } : it)
    } : sg))
  }

  const addItem = (gi: number) => {
    setSkillGroups(skillGroups.map((sg, idx) => idx === gi ? {
      ...sg, items: [...sg.items, { name: 'New Skill', proficiency: 80 }]
    } : sg))
  }

  const removeItem = (gi: number, ii: number) => {
    setSkillGroups(skillGroups.map((sg, idx) => idx === gi ? {
      ...sg, items: sg.items.filter((_, iidx) => iidx !== ii)
    } : sg))
  }

  const addGroup = () => {
    setSkillGroups([...skillGroups, { category: 'New Category', icon: 'Code', items: [] }])
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>

  return (
    <div>
      {toast && <Toast {...toast} />}
      {skillGroups.map((sg, gi) => (
        <div key={gi} style={s.section}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 3 }}>
              <label style={s.label}>Category Name</label>
              <input style={{ ...s.input, marginBottom: 0 }} value={sg.category} onChange={e => updateCategory(gi, e.target.value)} />
            </div>
            <button style={{ ...s.btnDanger, alignSelf: 'flex-end' }} onClick={() => setSkillGroups(skillGroups.filter((_, idx) => idx !== gi))}>Remove Group</button>
          </div>
          {sg.items.map((item, ii) => (
            <div key={ii} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input style={{ ...s.input, flex: 3, marginBottom: 0 }} placeholder="Skill name" value={item.name} onChange={e => updateItem(gi, ii, 'name', e.target.value)} />
              <input style={{ ...s.input, flex: 1, marginBottom: 0 }} type="number" min={0} max={100} placeholder="0-100" value={item.proficiency} onChange={e => updateItem(gi, ii, 'proficiency', +e.target.value)} />
              <button style={s.btnDanger} onClick={() => removeItem(gi, ii)}>✕</button>
            </div>
          ))}
          <button style={{ ...s.btnSecondary, marginTop: 4 }} onClick={() => addItem(gi)}>+ Add Skill</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={s.btnSecondary} onClick={addGroup}>+ Add Category</button>
        <button style={s.btn} onClick={save}>Save All</button>
      </div>
    </div>
  )
}

// ─── ONGOING TAB ──────────────────────────────────────────────────────────────

function OngoingTab() {
  const [items, setItems] = useState<OngoingData[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)
  const ICONS = ['Network', 'Bot', 'Cpu', 'Brain', 'Code', 'Database', 'Activity', 'Server', 'Eye']

  useEffect(() => {
    supabase.from('ongoing_projects').select('*').order('sort_order').then(({ data }) => {
      if (data) setItems(data)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    await supabase.from('ongoing_projects').delete().neq('id', 'x')
    const toInsert = items.map((item, i) => {
      const { id, updated_at, created_at, ...rest } = item as any
      return { ...rest, sort_order: i }
    })
    const { error } = await supabase.from('ongoing_projects').insert(toInsert)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: 'Saved!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const update = (i: number, key: keyof OngoingData, val: unknown) => {
    setItems(items.map((item, idx) => idx === i ? { ...item, [key]: val } : item))
  }

  const updateHighlight = (gi: number, hi: number, val: string) => {
    setItems(items.map((item, idx) => idx === gi ? {
      ...item, highlights: item.highlights.map((h, hidx) => hidx === hi ? val : h)
    } : item))
  }

  const addHighlight = (gi: number) => {
    setItems(items.map((item, idx) => idx === gi ? {
      ...item, highlights: [...item.highlights, '']
    } : item))
  }

  const removeHighlight = (gi: number, hi: number) => {
    setItems(items.map((item, idx) => idx === gi ? {
      ...item, highlights: item.highlights.filter((_, hidx) => hidx !== hi)
    } : item))
  }

  const addItem = () => {
    setItems([...items, { id: `ongoing-${Date.now()}`, title: 'New Project', icon: 'Network', status: 'in_progress', highlights: [] }])
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>

  return (
    <div>
      {toast && <Toast {...toast} />}
      {items.map((item, i) => (
        <div key={item.id} style={s.section}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 3 }}>
              <label style={s.label}>Title</label>
              <input style={s.input} value={item.title} onChange={e => update(i, 'title', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Icon</label>
              <select style={s.input} value={item.icon} onChange={e => update(i, 'icon', e.target.value)}>
                {ICONS.map(ic => <option key={ic}>{ic}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={s.label}>Status (leave blank to hide)</label>
              <input style={s.input} list="ongoingStatusList" value={item.status || ''} onChange={e => update(i, 'status', e.target.value)} />
              <datalist id="ongoingStatusList">
                {['in_progress', 'planning', 'beta'].map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
          <label style={s.label}>Highlights</label>
          {item.highlights.map((h, hi) => (
            <div key={hi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input style={{ ...s.input, flex: 1, marginBottom: 0 }} value={h} onChange={e => updateHighlight(i, hi, e.target.value)} />
              <button style={s.btnDanger} onClick={() => removeHighlight(i, hi)}>✕</button>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={s.btnSecondary} onClick={() => addHighlight(i)}>+ Add Highlight</button>
            <button style={s.btnDanger} onClick={() => setItems(items.filter((_, idx) => idx !== i))}>Remove Project</button>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={s.btnSecondary} onClick={addItem}>+ Add Project</button>
        <button style={s.btn} onClick={save}>Save All</button>
      </div>
    </div>
  )
}

// ─── CONTACT TAB ──────────────────────────────────────────────────────────────

function ContactTab() {
  const [links, setLinks] = useState<SocialLinkData[]>([])
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('social_links').select('*').order('sort_order').then(({ data }) => {
      if (data) setLinks(data)
      setLoading(false)
    })
  }, [])

  const save = async () => {
    await supabase.from('social_links').delete().neq('id', 0)
    const toInsert = links.map((l, i) => {
      const { id, updated_at, created_at, ...rest } = l as any
      return { ...rest, sort_order: i }
    })
    const { error } = await supabase.from('social_links').insert(toInsert)
    setToast(error ? { msg: error.message, type: 'error' } : { msg: 'Saved!', type: 'success' })
    setTimeout(() => setToast(null), 3000)
  }

  const update = (i: number, key: keyof SocialLinkData, val: string) => {
    setLinks(links.map((l, idx) => idx === i ? { ...l, [key]: val } : l))
  }

  if (loading) return <p style={{ color: '#888' }}>Loading…</p>

  return (
    <div>
      {toast && <Toast {...toast} />}
      {links.map((link, i) => (
        <div key={i} style={s.row}>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Platform</label>
            <input style={{ ...s.input, marginBottom: 0 }} value={link.platform} onChange={e => update(i, 'platform', e.target.value)} />
          </div>
          <div style={{ flex: 2 }}>
            <label style={s.label}>URL</label>
            <input style={{ ...s.input, marginBottom: 0 }} value={link.url} onChange={e => update(i, 'url', e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={s.label}>Handle</label>
            <input style={{ ...s.input, marginBottom: 0 }} value={link.handle} onChange={e => update(i, 'handle', e.target.value)} />
          </div>
          <button style={{ ...s.btnDanger, alignSelf: 'flex-end' }} onClick={() => setLinks(links.filter((_, idx) => idx !== i))}>✕</button>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12 }}>
        <button style={s.btnSecondary} onClick={() => setLinks([...links, { platform: '', url: '', handle: '' }])}>+ Add Link</button>
        <button style={s.btn} onClick={save}>Save All</button>
      </div>
    </div>
  )
}

// ─── SETUP TAB ────────────────────────────────────────────────────────────────

function SetupTab() {
  const [seeding, setSeeding] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const runSeed = async () => {
    if (!window.confirm('⚠️ WARNING: Seeding the database will WIPE OUT any custom changes you have made in the admin portal and reset everything to the original static data. Are you absolutely sure you want to do this?')) {
      return
    }
    setSeeding(true)
    try {
      await seedDatabase()
      setToast({ msg: 'Database seeded with your portfolio.ts data! Reload the other tabs.', type: 'success' })
    } catch (e: unknown) {
      setToast({ msg: String(e), type: 'error' })
    }
    setSeeding(false)
    setTimeout(() => setToast(null), 6000)
  }

  return (
    <div>
      {toast && <Toast {...toast} />}
      <div style={s.section}>
        <h3 style={s.h3}>Supabase Status</h3>
        <p style={{ color: isSupabaseConfigured ? '#4caf50' : '#f44336', fontSize: 14, margin: '0 0 16px 0' }}>
          {isSupabaseConfigured ? '✅ Supabase is configured via env vars.' : '❌ Supabase env vars not set. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'}
        </p>
        <h3 style={s.h3}>Step 1 — Create Database Tables</h3>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
          Paste the contents of <code style={{ color: '#E0003C' }}>supabase_migration.sql</code> into your Supabase Dashboard → SQL Editor → Run.
        </p>
        <h3 style={{ ...s.h3, marginTop: 24 }}>Step 2 — Seed with Existing Data</h3>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 12 }}>
          Click below to push all your current portfolio.ts data into the database. Only do this once.
        </p>
        <button style={s.btn} onClick={runSeed} disabled={seeding || !isSupabaseConfigured}>
          {seeding ? 'Seeding…' : 'Seed Database'}
        </button>
      </div>
    </div>
  )
}

// ─── MAIN ADMIN PAGE ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [pwError, setPwError] = useState(false)

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === 'true') setAuthed(true)
  }, [])

  const login = () => {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authed', 'true')
      setAuthed(true)
      setPwError(false)
    } else {
      setPwError(true)
    }
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#111', border: '1px solid #333', borderRadius: 12, padding: 40, minWidth: 320 }}>
          <h2 style={{ color: '#fff', margin: '0 0 4px 0', fontSize: 20 }}>Admin Dashboard</h2>
          <p style={{ color: '#555', fontSize: 13, margin: '0 0 24px 0' }}>Portfolio CMS</p>
          <label style={s.label}>Password</label>
          <input
            type="password"
            style={s.input}
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            autoFocus
          />
          {pwError && <p style={{ color: '#f44336', fontSize: 13, margin: '-8px 0 12px' }}>Wrong password.</p>}
          <button style={{ ...s.btn, width: '100%' }} onClick={login}>Login</button>
        </div>
      </div>
    )
  }

  const tabContents = [<AboutTab />, <BrainMapTab />, <ProjectsTab />, <SkillsTab />, <OngoingTab />, <ContactTab />, <SetupTab />]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#111', borderBottom: '1px solid #222', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Admin Dashboard</span>
          <span style={{ color: '#555', fontSize: 13, marginLeft: 12 }}>Portfolio CMS</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/" target="_blank" style={{ color: '#888', fontSize: 13, textDecoration: 'none' }}>View Site ↗</a>
          <button style={s.btnSecondary} onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false) }}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #222', padding: '0 24px', display: 'flex', gap: 0 }}>
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '12px 16px',
              fontSize: 14, color: activeTab === i ? '#E0003C' : '#666',
              borderBottom: activeTab === i ? '2px solid #E0003C' : '2px solid transparent',
              fontWeight: activeTab === i ? 600 : 400,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <h2 style={{ color: '#fff', fontSize: 18, marginBottom: 24 }}>{TABS[activeTab]}</h2>
        {tabContents[activeTab]}
      </div>
    </div>
  )
}
