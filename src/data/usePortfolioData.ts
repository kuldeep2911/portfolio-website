import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  profile as staticProfile,
  projects as staticProjects,
  skills as staticSkills,
  ongoing as staticOngoing,
  socialLinks as staticSocialLinks,
} from './portfolio'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileData {
  id?: number
  name: string
  title: string
  tagline: string
  bio: string
  location: string
  email: string
  available_for_work: boolean
  years_of_experience: number
  projects_completed: number
  models_deployed: number
  robot_lines: string[]
  stats: { value: string; label: string }[]
  contact_text: string
}

export interface BrainNode {
  id?: number
  label: string
  icon: string
  x: number
  y: number
  cx: number
  cy: number
  dur: number
  sort_order?: number
}

export interface ProjectData {
  id: string
  title: string
  description: string
  long_description: string
  tags: string[]
  category: string
  status: string
  bento_texts?: string[]
  github_url?: string
  demo_url?: string
  video_url?: string
  paper_url?: string
  featured: boolean
  year: number
  sort_order?: number
}

export interface SkillData {
  id?: number
  category: string
  icon: string
  items: { name: string; proficiency: number }[]
  sort_order?: number
}

export interface OngoingData {
  id: string
  title: string
  icon: string
  status: string
  highlights: string[]
  sort_order?: number
}

export interface SocialLinkData {
  id?: number
  platform: string
  url: string
  handle: string
  sort_order?: number
}

export interface PortfolioData {
  profile: ProfileData | null
  brainNodes: BrainNode[]
  projects: ProjectData[]
  skills: SkillData[]
  ongoing: OngoingData[]
  socialLinks: SocialLinkData[]
  loading: boolean
}

// ─── Static fallbacks ─────────────────────────────────────────────────────────

const STATIC_PROFILE: ProfileData = {
  name: staticProfile.name,
  title: staticProfile.title,
  tagline: staticProfile.tagline,
  bio: staticProfile.bio,
  location: staticProfile.location,
  email: staticProfile.email,
  available_for_work: staticProfile.availableForWork,
  years_of_experience: staticProfile.yearsOfExperience,
  projects_completed: staticProfile.projectsCompleted,
  models_deployed: staticProfile.modelsDeployed,
  robot_lines: [
    "Oh hey — you must be here to learn about Kuldeep.",
    "He's a third-year AI & ML engineer at Manipal University — GPA 8.56, published researcher, and patent holder.",
    "He builds things that think: LLMs, RAG systems, neural networks. The kind of work that gets noticed."
  ],
  stats: [
    { value: '8.56 GPA', label: 'Academic Score' },
    { value: '2 Publications', label: 'Research Output' },
    { value: '3 Projects', label: 'Built & Shipped' },
  ],
  contact_text: "I'll make sure Kuldeep reads your message first."
}

const STATIC_BRAIN_NODES: BrainNode[] = [
  { label: "LLM Fine-Tuning", icon: "Brain", x: 75, y: 20, cx: 50, cy: 20, dur: 3.2 },
  { label: "RAG Systems", icon: "Database", x: 85, y: 48, cx: 65, cy: 40, dur: 2.5 },
  { label: "Medical AI", icon: "Activity", x: 70, y: 75, cx: 50, cy: 75, dur: 3.8 },
  { label: "Social Networks", icon: "Network", x: 30, y: 75, cx: 50, cy: 75, dur: 2.9 },
  { label: "NLP & BERT", icon: "MessageSquare", x: 15, y: 48, cx: 35, cy: 40, dur: 4.0 },
  { label: "Published Research", icon: "FileText", x: 25, y: 20, cx: 50, cy: 20, dur: 3.5 },
]

const STATIC_PROJECTS: ProjectData[] = staticProjects.map((p, i) => ({
  id: p.id,
  title: p.title,
  description: p.description,
  long_description: p.longDescription,
  tags: p.tags,
  category: p.category,
  status: p.status,
  bento_texts: p.bentoTexts || [],
  github_url: p.githubUrl,
  demo_url: p.demoUrl,
  video_url: p.videoUrl,
  paper_url: p.paperUrl,
  featured: p.featured,
  year: p.year,
  sort_order: i,
}))

const STATIC_SKILLS: SkillData[] = staticSkills.map((s, i) => ({
  id: i + 1,
  category: s.category,
  icon: s.icon,
  items: s.items,
  sort_order: i,
}))

const STATIC_ONGOING: OngoingData[] = staticOngoing.map((o, i) => ({
  id: o.id,
  title: o.title,
  icon: o.icon,
  status: o.status,
  highlights: o.highlights,
  sort_order: i,
}))

const STATIC_SOCIAL: SocialLinkData[] = staticSocialLinks.map((s, i) => ({
  id: i + 1,
  platform: s.platform,
  url: s.url,
  handle: s.handle,
  sort_order: i,
}))

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function usePortfolioData(): PortfolioData {
  const [data, setData] = useState<PortfolioData>({
    profile: STATIC_PROFILE,
    brainNodes: STATIC_BRAIN_NODES,
    projects: STATIC_PROJECTS,
    skills: STATIC_SKILLS,
    ongoing: STATIC_ONGOING,
    socialLinks: STATIC_SOCIAL,
    loading: false,
  })

  useEffect(() => {
    if (!isSupabaseConfigured) return

    setData(prev => ({ ...prev, loading: true }))

    async function fetchAll() {
      try {
        const [
          profileRes, nodesRes, projectsRes, skillsRes, ongoingRes, socialRes
        ] = await Promise.all([
          supabase.from('profile').select('*').limit(1).single(),
          supabase.from('brain_nodes').select('*').order('sort_order').order('id'),
          supabase.from('projects').select('*').order('sort_order').order('id'),
          supabase.from('skills').select('*').order('sort_order').order('id'),
          supabase.from('ongoing_projects').select('*').order('sort_order').order('id'),
          supabase.from('social_links').select('*').order('sort_order').order('id'),
        ])

        setData({
          profile: profileRes.data ?? STATIC_PROFILE,
          brainNodes: nodesRes.data?.length ? nodesRes.data : STATIC_BRAIN_NODES,
          projects: projectsRes.data?.length ? projectsRes.data : STATIC_PROJECTS,
          skills: skillsRes.data?.length ? skillsRes.data : STATIC_SKILLS,
          ongoing: ongoingRes.data?.length ? ongoingRes.data : STATIC_ONGOING,
          socialLinks: socialRes.data?.length ? socialRes.data : STATIC_SOCIAL,
          loading: false,
        })
      } catch {
        // Supabase unreachable — keep static data
        setData(prev => ({ ...prev, loading: false }))
      }
    }

    fetchAll()
  }, [])

  return data
}

// ─── Seed helper (call once from admin) ──────────────────────────────────────

export async function seedDatabase() {
  if (!isSupabaseConfigured) throw new Error('Supabase not configured')

  await supabase.from('profile').delete().neq('id', 0)
  await supabase.from('profile').insert({
    ...STATIC_PROFILE,
    robot_lines: STATIC_PROFILE.robot_lines,
    stats: STATIC_PROFILE.stats,
    id: undefined,
  })

  // brain_nodes uses an auto-generated identity id, so we must clear existing
  // rows first — otherwise re-running setup keeps appending duplicate areas.
  await supabase.from('brain_nodes').delete().neq('id', 0)
  for (let i = 0; i < STATIC_BRAIN_NODES.length; i++) {
    await supabase.from('brain_nodes').insert({ ...STATIC_BRAIN_NODES[i], sort_order: i })
  }

  for (let i = 0; i < STATIC_PROJECTS.length; i++) {
    await supabase.from('projects').upsert({ ...STATIC_PROJECTS[i], sort_order: i })
  }

  await supabase.from('skills').delete().neq('id', 0)
  for (let i = 0; i < STATIC_SKILLS.length; i++) {
    await supabase.from('skills').insert({ ...STATIC_SKILLS[i], sort_order: i, id: undefined })
  }

  for (let i = 0; i < STATIC_ONGOING.length; i++) {
    await supabase.from('ongoing_projects').upsert({ ...STATIC_ONGOING[i], sort_order: i })
  }

  await supabase.from('social_links').delete().neq('id', 0)
  for (let i = 0; i < STATIC_SOCIAL.length; i++) {
    await supabase.from('social_links').insert({ ...STATIC_SOCIAL[i], sort_order: i, id: undefined })
  }
}
